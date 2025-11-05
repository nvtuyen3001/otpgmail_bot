require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// API Tokens - Đọc từ biến môi trường
const KHOTAIKHOAN_TOKEN = process.env.KHOTAIKHOAN_TOKEN;
const KHOTAIKHOAN_BASE_URL = 'https://api.khotaikhoan.vip/api/v1';

const VIOTP_TOKEN = process.env.VIOTP_TOKEN;
const VIOTP_BASE_URL = 'https://api.viotp.com';

const DAILYOTP_API_KEY = process.env.DAILYOTP_API_KEY;
const DAILYOTP_BASE_URL = 'https://dailyotp.com/api';

// Kiểm tra token và log warning
console.log('🔑 Checking API tokens...');
if (!KHOTAIKHOAN_TOKEN) {
  console.warn('⚠️  Warning: KHOTAIKHOAN_TOKEN not found');
}
if (!VIOTP_TOKEN) {
  console.warn('⚠️  Warning: VIOTP_TOKEN not found');
}
if (!DAILYOTP_API_KEY) {
  console.warn('⚠️  Warning: DAILYOTP_API_KEY not found');
}

// Chỉ exit nếu KHÔNG CÓ token nào
if (!KHOTAIKHOAN_TOKEN && !VIOTP_TOKEN && !DAILYOTP_API_KEY) {
  console.error('❌ Lỗi: Không có API token nào! Cần ít nhất 1 provider.');
  console.error('💡 Local: Copy file config.example.env thành .env và điền token');
  console.error('💡 Production: Set Environment Variables trong dashboard');
  process.exit(1);
}

console.log('✅ Available providers:');
if (KHOTAIKHOAN_TOKEN) console.log('   - KhoTaiKhoan');
if (VIOTP_TOKEN) console.log('   - VIOTP');
if (DAILYOTP_API_KEY) console.log('   - DailyOTP');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Route: Thuê số
app.post('/api/request', async (req, res) => {
  try {
    const { serviceId, provider } = req.body;
    
    console.log(`[REQUEST] Provider: ${provider}, ServiceId: ${serviceId}`);

    if (provider === 'dailyotp' || provider === 'dailyotp-bangladesh' || provider === 'dailyotp-cambodia-s3') {
      // Kiểm tra token
      if (!DAILYOTP_API_KEY) {
        return res.json({
          success: false,
          message: 'DailyOTP chưa được cấu hình. Vui lòng thêm DAILYOTP_API_KEY vào Environment Variables.'
        });
      }
      
      // Xác định country và server dựa vào provider
      let appBrand, countryCode, serverName;
      
      if (provider === 'dailyotp-cambodia-s3') {
        appBrand = 'Google';
        countryCode = 'KH'; // Cambodia Server 3
        serverName = 'Server 3';
      } else {
        // Default: Bangladesh (dailyotp hoặc dailyotp-bangladesh)
        appBrand = 'Google / Gmail / Youtube';
        countryCode = 'BD'; // Bangladesh
        serverName = 'Server 5';
      }
      
      // Gọi API DailyOTP GET /rent-number
      try {
        const response = await axios.get(`${DAILYOTP_BASE_URL}/rent-number`, {
          params: {
            appBrand: appBrand,
            countryCode: countryCode,
            serverName: serverName,
            api_key: DAILYOTP_API_KEY
          },
          timeout: 15000
        });

        console.log(`[REQUEST DAILYOTP] Status: ${response.status}`);
        console.log(`[REQUEST DAILYOTP] Response:`, JSON.stringify(response.data));

        if (response.data && response.data.message === 'Success' && response.data.data) {
          res.json({
            success: true,
            requestId: response.data.data.transId,
            phone: response.data.data.phoneNumber,
            price: response.data.data.cost,
            provider: provider // Trả về provider đúng (dailyotp-cambodia-s3, etc)
          });
        } else {
          console.error(`[REQUEST DAILYOTP] Error response:`, response.data);
          res.json({
            success: false,
            message: response.data.message || 'Không thể thuê số từ DailyOTP',
            error_details: response.data
          });
        }
      } catch (dailyotpError) {
        console.error(`[REQUEST DAILYOTP] API Error:`, {
          message: dailyotpError.message,
          status: dailyotpError.response?.status,
          data: dailyotpError.response?.data
        });
        res.json({
          success: false,
          message: `DailyOTP API Error: ${dailyotpError.response?.data?.message || dailyotpError.message}`,
          error_type: dailyotpError.code || 'UNKNOWN'
        });
      }
    } else if (provider === 'viotp') {
      // Kiểm tra token
      if (!VIOTP_TOKEN) {
        return res.json({
          success: false,
          message: 'VIOTP chưa được cấu hình. Vui lòng thêm VIOTP_TOKEN vào Environment Variables.'
        });
      }
      
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
      // Kiểm tra token
      if (!KHOTAIKHOAN_TOKEN) {
        return res.json({
          success: false,
          message: 'KhoTaiKhoan chưa được cấu hình. Vui lòng thêm KHOTAIKHOAN_TOKEN vào Environment Variables.'
        });
      }
      
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

// Route: Lấy số dư
app.get('/api/balance', async (req, res) => {
  try {
    const balances = {};

    // DailyOTP balance
    try {
      const dailyotpResponse = await axios.get(`${DAILYOTP_BASE_URL}/me`, {
        params: { api_key: DAILYOTP_API_KEY },
        timeout: 10000
      });
      console.log(`[BALANCE] DailyOTP Response:`, JSON.stringify(dailyotpResponse.data));
      
      if (dailyotpResponse.data && dailyotpResponse.data.data) {
        balances.dailyotp = {
          balance: dailyotpResponse.data.data.balance || 0,
          limit: dailyotpResponse.data.data.limit || 0
        };
      } else {
        console.error('[BALANCE] DailyOTP invalid response:', dailyotpResponse.data);
        balances.dailyotp = { balance: 0, error: true };
      }
    } catch (error) {
      console.error('[BALANCE] DailyOTP API Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      balances.dailyotp = { 
        balance: 0, 
        error: true,
        error_message: error.response?.data?.message || error.message
      };
    }

    // VIOTP balance - không có API endpoint
    balances.viotp = { balance: null, available: false };

    // KhoTaiKhoan balance - thêm nếu có API
    balances.khotaikhoan = { balance: null, available: false };

    res.json({
      success: true,
      balances: balances
    });

  } catch (error) {
    console.error('[BALANCE] Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Không thể lấy số dư'
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

    if (provider === 'dailyotp' || provider === 'dailyotp-bangladesh' || provider === 'dailyotp-cambodia-s3') {
      // Gọi API DailyOTP GET /get-messages
      try {
        const response = await axios.get(`${DAILYOTP_BASE_URL}/get-messages`, {
          params: {
            transId: requestId,
            api_key: DAILYOTP_API_KEY
          },
          timeout: 10000
        });

        console.log(`[CHECK OTP DAILYOTP] Status: ${response.status}`);
        console.log(`[CHECK OTP DAILYOTP] Response:`, JSON.stringify(response.data));

        if (response.data && response.data.message === 'Success' && response.data.data) {
          const orderData = response.data.data;
          
          console.log(`[CHECK OTP DAILYOTP] Order Status: ${orderData.orderStatus}`);
          
          // Kiểm tra orderStatus - API trả về "Success" khi có OTP
          if (orderData.orderStatus === 'Success' && orderData.code) {
            // Đã nhận OTP - API trả về sẵn code
            console.log(`[CHECK OTP DAILYOTP] ✅ OTP received: ${orderData.code}`);
            res.json({
              success: true,
              otp_code: orderData.code,
              status: 'completed',
              message: orderData.message || null
            });
          } else if (orderData.orderStatus === 'Waiting message' || orderData.orderStatus === 'Pending') {
            // Chưa có tin nhắn
            console.log(`[CHECK OTP DAILYOTP] ⏳ Waiting for message...`);
            res.json({
              success: true,
              otp_code: null,
              status: 'pending'
            });
          } else if (orderData.orderStatus === 'Expired' || orderData.orderStatus === 'Cancelled' || orderData.orderStatus === 'Refunded') {
            console.log(`[CHECK OTP DAILYOTP] ❌ Order ${orderData.orderStatus}`);
            res.json({
              success: true,
              otp_code: null,
              status: 'expired'
            });
          } else {
            // Trạng thái khác - log để debug
            console.log(`[CHECK OTP DAILYOTP] ⚠️ Unknown status: ${orderData.orderStatus}`);
            console.log(`[CHECK OTP DAILYOTP] Full data:`, JSON.stringify(orderData));
            res.json({
              success: true,
              otp_code: orderData.code || null,
              status: orderData.code ? 'completed' : 'pending',
              message: orderData.message || null
            });
          }
        } else {
          console.error(`[CHECK OTP DAILYOTP] Invalid response:`, response.data);
          res.json({
            success: false,
            message: response.data.message || 'Không thể kiểm tra OTP'
          });
        }
      } catch (dailyotpError) {
        console.error(`[CHECK OTP DAILYOTP] API Error:`, {
          message: dailyotpError.message,
          status: dailyotpError.response?.status,
          data: dailyotpError.response?.data
        });
        res.json({
          success: false,
          message: `DailyOTP API Error: ${dailyotpError.response?.data?.message || dailyotpError.message}`,
          error_type: dailyotpError.code || 'UNKNOWN'
        });
      }
    } else if (provider === 'viotp') {
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

// Route: Lấy OTP từ SMS222.us
app.post('/api/fetch-sms222', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url || !url.includes('sms222.us')) {
      return res.json({
        success: false,
        message: 'URL không hợp lệ'
      });
    }
    
    console.log(`[SMS222] Fetching OTP from: ${url}`);
    
    // Fetch HTML từ URL
    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const htmlContent = response.data;
    console.log(`[SMS222] HTML Content Length: ${htmlContent.length}`);
    
    // Extract OTP từ nội dung
    // Pattern 1: G-123456 (Google verification code)
    const googlePattern = /G-(\d{6})/i;
    let match = htmlContent.match(googlePattern);
    
    if (match && match[1]) {
      const otp = match[1];
      console.log(`[SMS222] ✅ OTP extracted: ${otp}`);
      
      return res.json({
        success: true,
        otp: otp,
        phone: null,
        source: 'sms222.us'
      });
    }
    
    // Pattern 2: 6 chữ số liên tiếp (general OTP)
    const generalPattern = /\b(\d{6})\b/;
    match = htmlContent.match(generalPattern);
    
    if (match && match[1]) {
      const otp = match[1];
      console.log(`[SMS222] ✅ OTP extracted (general): ${otp}`);
      
      return res.json({
        success: true,
        otp: otp,
        phone: null,
        source: 'sms222.us'
      });
    }
    
    // Pattern 3: Verification code: 123456
    const verifyPattern = /(?:verification code|verify code|code|otp)[\s:]*(\d{4,8})/i;
    match = htmlContent.match(verifyPattern);
    
    if (match && match[1]) {
      const otp = match[1];
      console.log(`[SMS222] ✅ OTP extracted (verification): ${otp}`);
      
      return res.json({
        success: true,
        otp: otp,
        phone: null,
        source: 'sms222.us'
      });
    }
    
    console.log(`[SMS222] ❌ No OTP found in content`);
    console.log(`[SMS222] First 500 chars:`, htmlContent.substring(0, 500));
    
    return res.json({
      success: false,
      message: 'Không tìm thấy mã OTP trong nội dung'
    });
    
  } catch (error) {
    console.error('[SMS222] Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy OTP: ' + error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});

