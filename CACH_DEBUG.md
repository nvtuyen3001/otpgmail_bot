# 🔍 Cách Debug Khi OTP Không Hiển Thị

## Vấn đề hiện tại
Bạn thấy OTP đã gửi về nhưng web không hiển thị.

## ⚡ Giải pháp nhanh

### Bước 1: Reload lại trang web
```
Nhấn Ctrl + F5 (hoặc Cmd + Shift + R trên Mac)
```
Điều này đảm bảo JavaScript mới nhất được load.

### Bước 2: Mở Console để xem logs
1. Nhấn `F12` (hoặc click chuột phải → Inspect)
2. Chuyển sang tab **Console**
3. Thuê số mới từ DailyOTP
4. Quan sát các log hiển thị

### Bước 3: Kiểm tra logs trong Console

**Khi thuê số thành công, bạn sẽ thấy:**
```
[Frontend] Renting number - Provider: dailyotp, ServiceId: gmail
```

**Khi đang check OTP, bạn sẽ thấy (mỗi 3 giây):**
```
[Frontend] Checking OTP for requestId: 4353620943, provider: dailyotp
[Frontend] Full response data: {"success":true,"otp_code":null,"status":"pending"}
[Frontend] data.success: true
[Frontend] data.otp_code: null
[Frontend] data.status: pending
[Frontend] ⏳ Still pending...
```

**Khi nhận được OTP, bạn sẽ thấy:**
```
[Frontend] Full response data: {"success":true,"otp_code":"123456","status":"completed","message":"..."}
[Frontend] data.success: true
[Frontend] data.otp_code: 123456
[Frontend] data.status: completed
[Frontend] ✅ OTP received: 123456
```

## 🎯 Điểm cần kiểm tra

### ✅ Nếu thấy log `✅ OTP received: 123456`
→ **Frontend nhận được OTP rồi!**

Kiểm tra:
1. OTP có hiển thị trong bảng không?
2. Có thông báo popup màu xanh không?
3. Status có đổi thành "Hoàn thành" không?

### ❌ Nếu KHÔNG thấy log `✅ OTP received`
→ **Frontend chưa nhận được OTP**

Có thể:
1. `data.success` là `false` → Backend có lỗi
2. `data.otp_code` là `null` → Chưa có OTP hoặc trích xuất thất bại
3. `data.status` là `pending` → Đang đợi tin nhắn

### ⚠️ Nếu thấy log `⚠️ Unexpected response`
→ **Response không đúng format**

Copy response JSON và báo lại.

## 🔧 Kiểm tra Backend

Mở terminal đang chạy server, tìm dòng:

**Khi thuê số:**
```
[REQUEST] Provider: dailyotp, ServiceId: gmail
[REQUEST DAILYOTP] Response: {"message":"Success","data":{...}}
```

**Khi check OTP:**
```
[CHECK OTP] Provider: dailyotp, RequestId: 4353620943
[CHECK OTP DAILYOTP] Response: {"message":"Success","data":{"orderStatus":"Waiting message"}}
```

**Khi có OTP:**
```
[CHECK OTP DAILYOTP] Response: {"message":"Success","data":{"orderStatus":"Completed","sms":"Your code is 123456"}}
[CHECK OTP DAILYOTP] ✅ OTP received: 123456
```

### ✅ Nếu thấy backend log `✅ OTP received: 123456`
→ **Backend đã trích xuất được OTP!**

Nhưng frontend không hiển thị → Vấn đề ở response hoặc frontend.

## 🧪 Test thủ công

Mở Console trong browser và chạy:

```javascript
// Thay YOUR_TRANS_ID bằng transId thật
fetch('http://localhost:3000/api/check?requestId=YOUR_TRANS_ID&provider=dailyotp')
  .then(r => r.json())
  .then(data => {
    console.log('=== MANUAL TEST ===');
    console.log('Response:', JSON.stringify(data, null, 2));
    console.log('success:', data.success);
    console.log('otp_code:', data.otp_code);
    console.log('status:', data.status);
  });
```

**Response mong đợi khi có OTP:**
```json
{
  "success": true,
  "otp_code": "123456",
  "status": "completed",
  "message": "Your verification code is 123456"
}
```

## 📋 Checklist

Nếu vẫn không hiển thị, check:

- [ ] Đã reload trang bằng `Ctrl+F5`?
- [ ] Console có hiển thị logs không?
- [ ] Backend có log `✅ OTP received`?
- [ ] Frontend có log `✅ OTP received`?
- [ ] Response có field `success: true`?
- [ ] Response có field `otp_code: "..."`?
- [ ] Polling interval có đang chạy không?

## 💡 Các trường hợp thường gặp

### 1. OTP đã hết hạn
**Triệu chứng:** Status hiển thị "Hết hạn"
**Nguyên nhân:** Session 20 phút đã kết thúc
**Giải pháp:** Thuê số mới

### 2. Tin nhắn không chứa OTP dạng số
**Triệu chứng:** Backend log `Message received but no OTP code found`
**Nguyên nhân:** Regex không match (ví dụ: OTP bằng chữ)
**Giải pháp:** Check tin nhắn trong backend log, có thể cần điều chỉnh regex

### 3. Polling đã dừng
**Triệu chứng:** Console không còn log check OTP nữa
**Nguyên nhân:** Đã timeout (10 phút) hoặc có lỗi
**Giải pháp:** Thuê số mới

## 🆘 Vẫn không được?

Hãy gửi cho tôi:

1. **Screenshot Console** (tab Console trong Developer Tools)
2. **Backend logs** (terminal output)
3. **Manual test result** (kết quả từ fetch command ở trên)

Tôi sẽ giúp debug tiếp! 🚀

