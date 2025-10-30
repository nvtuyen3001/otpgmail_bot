# 🔍 Debug DailyOTP API trên Production

## Vấn đề: DailyOTP lỗi khi deploy

Khi deploy lên production (Render/Heroku), DailyOTP có thể gặp lỗi API.

---

## ✅ Bước 1: Kiểm tra API Key

### 1.1. Kiểm tra API Key có đúng không

Vào dashboard của Render/Heroku và kiểm tra environment variable:

```
DAILYOTP_API_KEY=your_api_key_here
```

### 1.2. Test API Key trực tiếp

Mở terminal và chạy lệnh này:

```bash
curl "https://dailyotp.com/api/me?api_key=YOUR_API_KEY_HERE"
```

**Response mong đợi:**
```json
{
  "message": "Success",
  "data": {
    "balance": 10.50,
    "limit": 100
  }
}
```

**Nếu lỗi:**
```json
{
  "message": "Invalid API key"
}
```
→ API key sai hoặc đã hết hạn. Lấy API key mới từ DailyOTP.

---

## ✅ Bước 2: Kiểm tra Log Backend

### 2.1. Xem log trên Render

1. Vào dashboard Render
2. Click vào service `otpgmail-backend`
3. Chuyển sang tab **Logs**
4. Tìm các dòng log:

```
[REQUEST] Provider: dailyotp, ServiceId: gmail
[REQUEST DAILYOTP] Status: 200
[REQUEST DAILYOTP] Response: {...}
```

### 2.2. Các loại lỗi thường gặp

#### Lỗi 1: Timeout
```
[REQUEST DAILYOTP] API Error: { message: 'timeout of 15000ms exceeded' }
```
**Giải pháp:** API DailyOTP phản hồi chậm. Tăng timeout hoặc thử lại.

#### Lỗi 2: Invalid API Key
```
[REQUEST DAILYOTP] Response: { message: "Invalid API key" }
```
**Giải pháp:** Kiểm tra lại API key trong environment variables.

#### Lỗi 3: Insufficient Balance
```
[REQUEST DAILYOTP] Response: { message: "Insufficient balance" }
```
**Giải pháp:** Nạp thêm tiền vào tài khoản DailyOTP.

#### Lỗi 4: Network Error (ENOTFOUND, ECONNREFUSED)
```
[REQUEST DAILYOTP] API Error: { message: 'getaddrinfo ENOTFOUND dailyotp.com' }
```
**Giải pháp:** 
- Kiểm tra DNS của server
- Kiểm tra firewall có chặn không
- DailyOTP có thể đang bảo trì

---

## ✅ Bước 3: Test API từ Frontend Console

### 3.1. Mở Console trong Browser

Nhấn `F12` → Tab **Console**

### 3.2. Test Balance API

```javascript
fetch('https://otpgmail-bot.onrender.com/api/balance')
  .then(r => r.json())
  .then(data => console.log('Balance:', data));
```

**Response mong đợi:**
```json
{
  "success": true,
  "balances": {
    "dailyotp": {
      "balance": 10.50,
      "limit": 100
    }
  }
}
```

**Nếu lỗi:**
```json
{
  "success": true,
  "balances": {
    "dailyotp": {
      "balance": 0,
      "error": true,
      "error_message": "Invalid API key"
    }
  }
}
```

### 3.3. Test Rent Number API

```javascript
fetch('https://otpgmail-bot.onrender.com/api/request', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    serviceId: 'gmail',
    provider: 'dailyotp'
  })
})
  .then(r => r.json())
  .then(data => console.log('Rent:', data));
```

**Response mong đợi:**
```json
{
  "success": true,
  "requestId": "4353620943",
  "phone": "+8801234567890",
  "price": 0.50,
  "provider": "dailyotp"
}
```

**Nếu lỗi:**
```json
{
  "success": false,
  "message": "DailyOTP API Error: Invalid API key",
  "error_type": "API_ERROR"
}
```

---

## ✅ Bước 4: Kiểm tra API DailyOTP trực tiếp

### 4.1. Test rent-number endpoint

```bash
curl -X GET "https://dailyotp.com/api/rent-number?appBrand=Google%20%2F%20Gmail%20%2F%20Youtube&countryCode=BD&serverName=Server%205&api_key=YOUR_API_KEY"
```

**Response thành công:**
```json
{
  "message": "Success",
  "data": {
    "transId": "4353620943",
    "phoneNumber": "+8801234567890",
    "cost": 0.50
  }
}
```

### 4.2. Test get-messages endpoint

```bash
curl -X GET "https://dailyotp.com/api/get-messages?transId=4353620943&api_key=YOUR_API_KEY"
```

**Response chưa có OTP:**
```json
{
  "message": "Success",
  "data": {
    "orderStatus": "Waiting message"
  }
}
```

**Response có OTP:**
```json
{
  "message": "Success",
  "data": {
    "orderStatus": "Success",
    "code": "123456"
  }
}
```

---

## ✅ Bước 5: Cách sửa lỗi

### Lỗi 1: API Key không hợp lệ

**Triệu chứng:** 
- Balance hiển thị "Error"
- Không thuê được số
- Log: `Invalid API key`

**Cách sửa:**

1. Vào dashboard DailyOTP: https://dailyotp.com
2. Lấy API key mới
3. Update environment variable trên Render:
   - Settings → Environment Variables
   - Sửa `DAILYOTP_API_KEY`
4. Restart service

### Lỗi 2: Hết tiền

**Triệu chứng:**
- Balance = $0.00
- Không thuê được số
- Log: `Insufficient balance`

**Cách sửa:**
1. Nạp tiền vào tài khoản DailyOTP
2. Refresh trang web
3. Thử thuê số lại

### Lỗi 3: API Timeout

**Triệu chứng:**
- Lâu không có response
- Log: `timeout of 15000ms exceeded`

**Cách sửa:**
1. Thử lại sau vài phút
2. Nếu vẫn lỗi, DailyOTP có thể đang bảo trì
3. Thử dùng VIOTP hoặc KhoTaiKhoan thay thế

### Lỗi 4: Network/DNS Error

**Triệu chứng:**
- Log: `ENOTFOUND dailyotp.com`
- Không kết nối được API

**Cách sửa:**
1. Kiểm tra DailyOTP có hoạt động không: https://dailyotp.com
2. Nếu site down → Chờ họ sửa
3. Nếu site hoạt động → Có thể server Render bị block, liên hệ support

---

## 🧪 Test Checklist

Trước khi báo lỗi, hãy kiểm tra:

- [ ] API key đã được set trong Environment Variables
- [ ] API key còn hợp lệ (test bằng curl)
- [ ] Tài khoản DailyOTP còn tiền
- [ ] DailyOTP website hoạt động bình thường
- [ ] Backend logs có hiển thị lỗi gì
- [ ] Frontend console có lỗi gì
- [ ] Thử với provider khác (VIOTP) có hoạt động không

---

## 📞 Hỗ Trợ

Nếu vẫn lỗi sau khi làm theo hướng dẫn:

1. Copy toàn bộ backend logs (20-30 dòng gần nhất)
2. Screenshot lỗi trong frontend console
3. Kết quả test curl API
4. Báo lại để được hỗ trợ

---

## 💡 Tips

- DailyOTP API có thể chậm hơn VIOTP/KhoTaiKhoan
- Nên set timeout cao (15s)
- Polling interval = 3s là hợp lý
- Nếu hay lỗi, nên dùng VIOTP thay thế

---

**Cập nhật:** Đã cải thiện error handling và logging trong code. Bây giờ mọi lỗi đều được log chi tiết!

