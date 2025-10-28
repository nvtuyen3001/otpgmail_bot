require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// API Tokens - Đọc từ biến môi trường (.env file)
const KHOTAIKHOAN_TOKEN = process.env.KHOTAIKHOAN_TOKEN;
const KHOTAIKHOAN_BASE_URL = 'https://api.khotaikhoan.vip/api/v1';

const VIOTP_TOKEN = process.env.VIOTP_TOKEN;
const VIOTP_BASE_URL = 'https://api.viotp.com';

// Kiểm tra token có tồn tại không
if (!KHOTAIKHOAN_TOKEN || !VIOTP_TOKEN) {
  console.error('❌ Lỗi: Thiếu API tokens! Vui lòng tạo file .env và thêm tokens.');
  console.error('💡 Copy file config.example.env thành .env và điền token thật.');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Route: Thuê số
app.post('/api/request', async (req, res) => {
  try {
    const { serviceId, provider } = req.body;
    
    console.log(`[REQUEST] Provider: ${provider}, ServiceId: ${serviceId}`);

    if (provider === 'viotp') {
      // Gọi API VIOTP GET /request/getv2
      const response = await axios.get(`${VIOTP_BASE_URL}/request/getv2`, {
        params: {
          token: VIOTP_TOKEN,
          serviceId: parseInt(serviceId) || 3, // 3 = Gmail/Google, 7 = Facebook theo VIOTP
          network: 'VINAPHONE'
        }
      });

      console.log(`[REQUEST VIOTP] Response:`, JSON.stringify(response.data));

      if (response.data && response.data.status_code === 200 && response.data.data) {
        res.json({
          success: true,
          requestId: response.data.data.request_id,
          phone: response.data.data.phone_number,
          price: null,
          provider: 'viotp'
        });
      } else {
        res.json({
          success: false,
          message: response.data.message || 'Không thể thuê số từ VIOTP'
        });
      }
    } else {
      // Gọi API KhoTaiKhoan POST /buy
      const response = await axios.post(`${KHOTAIKHOAN_BASE_URL}/buy`, {
        token: KHOTAIKHOAN_TOKEN,
        serviceId: parseInt(serviceId) || 2, // serviceId = 2 là Gmail/Google
        carrier: 'all'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(`[REQUEST KHOTAIKHOAN] Response:`, JSON.stringify(response.data));

      if (response.data && response.data.requestId) {
        res.json({
          success: true,
          requestId: response.data.requestId,
          phone: response.data.phoneNum,
          price: response.data.price,
          provider: 'khotaikhoan'
        });
      } else if (response.data && response.data.error) {
        res.json({
          success: false,
          error: response.data.error,
          message: response.data.message || 'Không thể thuê số'
        });
      } else {
        res.json({
          success: false,
          message: 'Không thể thuê số'
        });
      }
    }
  } catch (error) {
    console.error('[REQUEST] Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Lỗi kết nối API',
      error: error.response?.data || error.message
    });
  }
});

// Route: Kiểm tra OTP
app.get('/api/check', async (req, res) => {
  try {
    const { requestId, provider } = req.query;
    
    if (!requestId) {
      return res.json({ success: false, message: 'Thiếu requestId' });
    }

    console.log(`[CHECK OTP] Provider: ${provider}, RequestId: ${requestId}`);

    if (provider === 'viotp') {
      // Gọi API VIOTP GET /session/getv2
      const response = await axios.get(`${VIOTP_BASE_URL}/session/getv2`, {
        params: {
          token: VIOTP_TOKEN,
          requestId: requestId
        }
      });

      console.log(`[CHECK OTP VIOTP] Response:`, JSON.stringify(response.data));

      if (response.data && response.data.status_code === 200 && response.data.data) {
        const data = response.data.data;
        
        if (data.Status === 1 && data.Code) {
          // Có OTP
          console.log(`[CHECK OTP VIOTP] ✅ OTP received: ${data.Code}`);
          res.json({
            success: true,
            otp_code: data.Code,
            status: 'completed',
            message: data.SmsContent
          });
        } else if (data.Status === 0) {
          // Chưa có OTP
          console.log(`[CHECK OTP VIOTP] ⏳ Pending...`);
          res.json({
            success: true,
            otp_code: null,
            status: 'pending'
          });
        } else if (data.Status === 2) {
          // Hết hạn
          console.log(`[CHECK OTP VIOTP] ❌ Expired`);
          res.json({
            success: true,
            otp_code: null,
            status: 'expired'
          });
        }
      } else {
        res.json({
          success: false,
          message: response.data.message || 'Không thể kiểm tra OTP'
        });
      }
    } else {
      // Gọi API KhoTaiKhoan GET /getcode
      const response = await axios.get(`${KHOTAIKHOAN_BASE_URL}/getcode`, {
        params: {
          requestId: requestId
        }
      });

      console.log(`[CHECK OTP KHOTAIKHOAN] Response:`, JSON.stringify(response.data));

      // Kiểm tra có OTP không
      if (response.data && response.data.code && response.data.code !== '') {
        // Có OTP
        console.log(`[CHECK OTP KHOTAIKHOAN] ✅ OTP received: ${response.data.code}`);
        res.json({
          success: true,
          otp_code: response.data.code,
          status: 'completed',
          message: response.data.message,
          phoneNum: response.data.phoneNum
        });
      } else if (response.data && response.data.status === 0) {
        // Chưa có OTP
        console.log(`[CHECK OTP KHOTAIKHOAN] ⏳ Pending...`);
        res.json({
          success: true,
          otp_code: null,
          status: 'pending',
          phoneNum: response.data.phoneNum
        });
      } else if (response.data && response.data.error === 'refunded') {
        // Hết hạn
        console.log(`[CHECK OTP KHOTAIKHOAN] ❌ Expired/Refunded`);
        res.json({
          success: true,
          otp_code: null,
          status: 'expired',
          message: response.data.message
        });
      } else {
        console.log(`[CHECK OTP] ⚠️ Unknown response`);
        res.json({
          success: false,
          message: 'Không thể kiểm tra OTP',
          debug: response.data
        });
      }
    }
  } catch (error) {
    console.error('[CHECK OTP] Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Lỗi kết nối API'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});

