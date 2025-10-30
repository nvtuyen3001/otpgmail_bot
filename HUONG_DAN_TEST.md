# 🧪 Hướng Dẫn Test Trực Tiếp

## Vấn đề hiện tại
Frontend logs cho thấy `otp_code: null` và `status: pending` - Nghĩa là backend chưa nhận được OTP từ DailyOTP.

## Cách kiểm tra

### Cách 1: Xem Backend Logs

1. **Mở terminal đang chạy server**
2. **Tìm dòng có text**: `[CHECK OTP DAILYOTP] Response:`
3. **Xem orderStatus**:

```
Nếu thấy: "orderStatus":"Waiting message"
→ OTP chưa gửi về, cần đợi thêm

Nếu thấy: "orderStatus":"Completed","sms":"Your code is 123456"
→ OTP đã về, check xem backend có extract được không

Nếu thấy: "orderStatus":"Expired"
→ Đã hết hạn (20 phút), cần thuê số mới
```

### Cách 2: Test Script (Recommended)

Tôi đã tạo script test trực tiếp. Sử dụng như sau:

#### Bước 1: Lấy transId
Trong browser console (F12), tìm dòng:
```
[Frontend] Checking OTP for requestId: 4353620943
```

Hoặc xem trong table, cột "STT" sẽ có request ID.

#### Bước 2: Chạy test script
```bash
node test_check_otp.js <TRANS_ID>
```

Ví dụ:
```bash
node test_check_otp.js 4353620943
```

#### Kết quả sẽ cho biết:

**Nếu đang chờ:**
```
=== PARSED DATA ===
Order Status: Waiting message
SMS Message: (not received yet)

⏳ Status: Still waiting for message...
💡 Try running this script again in a few seconds
```

**Nếu đã có OTP:**
```
=== PARSED DATA ===
Order Status: Completed
SMS Message: Your verification code is 123456

✅ OTP FOUND: 123456
✅ Status: Order completed!
```

**Nếu hết hạn:**
```
Order Status: Expired
❌ Status: Order Expired
```

### Cách 3: Test API thủ công

Mở browser console và chạy (thay TRANS_ID):

```javascript
fetch('http://localhost:3000/api/check?requestId=TRANS_ID&provider=dailyotp')
  .then(r => r.json())
  .then(data => {
    console.log('=== BACKEND RESPONSE ===');
    console.log('Success:', data.success);
    console.log('OTP Code:', data.otp_code);
    console.log('Status:', data.status);
    console.log('Message:', data.message);
    console.log('\nFull response:', JSON.stringify(data, null, 2));
  });
```

## 🔍 Phân tích kết quả

### Trường hợp 1: "Waiting message"
**Nguyên nhân:** Google/Gmail chưa gửi OTP về số điện thoại

**Giải pháp:**
- Đợi thêm (có thể mất 1-5 phút)
- Kiểm tra lại sau bằng test script
- Nếu quá 10 phút vẫn "Waiting" → Số có thể bị lỗi, thuê số mới

### Trường hợp 2: "Completed" nhưng không có OTP
**Có thể:**
- Tin nhắn không chứa mã số (hiếm)
- Regex extraction thất bại

**Debug:**
```bash
# Chạy test script để xem tin nhắn thực tế
node test_check_otp.js <TRANS_ID>

# Xem "SMS Message:" là gì
```

**Nếu tin nhắn có format lạ**, ví dụ:
```
"Your code: G-one-two-three-four-five-six"  ❌ Không có số
"Code G-abcdef"  ❌ Không phải số
"<#> 123456 is your code"  ✅ Có số, nhưng có ký tự đặc biệt
```

### Trường hợp 3: Backend returns OTP nhưng frontend null

**Kiểm tra:**
1. Backend logs có `✅ OTP received: 123456` không?
2. Frontend response có `"otp_code":"123456"` không?

**Nếu backend có nhưng frontend null:**
- Vấn đề ở response format
- Check xem response có đúng structure không:
  ```json
  {
    "success": true,
    "otp_code": "123456",  // ← Phải là string "123456"
    "status": "completed"
  }
  ```

## ⚡ Quick Debug Command

```bash
# Chạy lệnh này để test ngay (thay TRANS_ID):
node test_check_otp.js TRANS_ID

# Ví dụ:
node test_check_otp.js 4353620943
```

## 📝 Gửi kết quả cho tôi

Nếu vẫn không hiểu vấn đề, hãy gửi cho tôi:

1. **Output của test script:**
   ```bash
   node test_check_otp.js <TRANS_ID>
   ```

2. **Backend logs** (dòng có `[CHECK OTP DAILYOTP] Response:`)

3. **Frontend logs** (screenshot console)

Tôi sẽ phân tích chính xác vấn đề! 🎯

