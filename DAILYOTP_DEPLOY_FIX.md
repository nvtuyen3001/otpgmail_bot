# 🚀 Sửa Lỗi DailyOTP khi Deploy lên Production

## Vấn đề
DailyOTP API bị lỗi khi deploy lên Render/Heroku.

## ✅ Giải pháp đã thực hiện

### 1. Cải thiện Error Handling
- ✅ Thêm try-catch riêng cho DailyOTP API
- ✅ Thêm timeout: 15s cho rent, 10s cho check
- ✅ Log chi tiết status code và response
- ✅ Trả về error message rõ ràng

### 2. Frontend Logging
- ✅ Log tất cả response từ API
- ✅ Hiển thị error message chi tiết
- ✅ Tooltip hiển thị lỗi khi hover vào Balance

### 3. Test Script
- ✅ Tạo script `test_dailyotp_api.js`
- ✅ Test 3 endpoints: /me, /rent-number, /get-messages
- ✅ Chạy bằng: `npm run test:dailyotp`

---

## 🔧 Cách Deploy lên Production

### Bước 1: Đảm bảo API Key đúng

1. Kiểm tra API key trên local:
```bash
npm run test:dailyotp
```

2. Nếu test thành công, copy API key vào Render

### Bước 2: Update Code lên GitHub

```bash
git add .
git commit -m "Fix DailyOTP error handling and logging"
git push origin main
```

### Bước 3: Deploy lên Render

1. Vào Render Dashboard: https://dashboard.render.com
2. Chọn service: `otpgmail-backend`
3. Click **Deploy latest commit**
4. Đợi deploy xong (~3-5 phút)

### Bước 4: Kiểm tra Environment Variables

1. Vào **Settings** → **Environment**
2. Kiểm tra có biến:
```
DAILYOTP_API_KEY=your_api_key_here
```
3. Nếu chưa có, thêm vào và click **Save Changes**

### Bước 5: Xem Logs

1. Vào tab **Logs**
2. Thuê số từ DailyOTP
3. Kiểm tra logs:

**Thành công:**
```
[REQUEST] Provider: dailyotp, ServiceId: gmail
[REQUEST DAILYOTP] Status: 200
[REQUEST DAILYOTP] Response: {"message":"Success","data":{...}}
```

**Lỗi API Key:**
```
[REQUEST DAILYOTP] API Error: { status: 401, data: {"message":"Invalid API key"} }
```

**Lỗi Timeout:**
```
[REQUEST DAILYOTP] API Error: { message: 'timeout of 15000ms exceeded' }
```

**Lỗi Network:**
```
[REQUEST DAILYOTP] API Error: { message: 'getaddrinfo ENOTFOUND dailyotp.com' }
```

---

## 🧪 Test từ Frontend

### Test 1: Kiểm tra Balance

1. Mở website: https://otpgmail-bot.onrender.com
2. Nhấn F12 → Console
3. Xem log:
```
[Balance] Response: {success: true, balances: {...}}
```

Nếu lỗi:
```
[Balance] DailyOTP Error: Invalid API key
```
→ Sửa API key trong Render

### Test 2: Thuê số

1. Chọn "DailyOTP - Gmail/Google/YouTube"
2. Click "Thuê số"
3. Xem Console:

**Thành công:**
```
[Frontend] Rent response: {success: true, requestId: "...", phone: "+880..."}
```

**Lỗi:**
```
[Frontend] Rent failed: {success: false, message: "DailyOTP API Error: ..."}
```

---

## 🐛 Các Lỗi Thường Gặp

### Lỗi 1: "Invalid API key"

**Nguyên nhân:** API key sai hoặc đã hết hạn

**Cách sửa:**
1. Vào DailyOTP: https://dailyotp.com
2. Lấy API key mới
3. Update trong Render Environment Variables
4. Restart service

### Lỗi 2: "Insufficient balance"

**Nguyên nhân:** Hết tiền trong tài khoản

**Cách sửa:**
1. Vào DailyOTP dashboard
2. Nạp thêm tiền
3. Refresh website và thử lại

### Lỗi 3: "timeout of 15000ms exceeded"

**Nguyên nhân:** DailyOTP API phản hồi chậm

**Cách sửa:**
- Thử lại sau vài phút
- Nếu vẫn lỗi, DailyOTP có thể đang bảo trì
- Dùng VIOTP hoặc KhoTaiKhoan thay thế

### Lỗi 4: "Network error" / "ENOTFOUND"

**Nguyên nhân:** Không kết nối được DailyOTP

**Cách sửa:**
- Kiểm tra DailyOTP có hoạt động: https://dailyotp.com
- Nếu site down → Chờ họ sửa
- Nếu site hoạt động → Có thể server bị block IP

### Lỗi 5: Balance hiển thị "Error"

**Nguyên nhân:** Không gọi được API /me

**Cách sửa:**
- Hover vào "Error" để xem message chi tiết
- Thường là do API key sai
- Update API key và restart

---

## ✅ Checklist Deploy

Trước khi deploy, kiểm tra:

- [ ] Code đã commit và push lên GitHub
- [ ] API key đã test thành công ở local (`npm run test:dailyotp`)
- [ ] Environment variable `DAILYOTP_API_KEY` đã set trên Render
- [ ] Service đã restart sau khi update env vars
- [ ] Test balance từ website (F12 → Console)
- [ ] Test thuê số từ website
- [ ] Xem logs trên Render để confirm không có lỗi

---

## 📞 Nếu Vẫn Lỗi

Hãy cung cấp:

1. **Screenshot Console** (F12 → Console tab)
2. **Render Logs** (copy 20-30 dòng gần nhất)
3. **Kết quả test local** (`npm run test:dailyotp`)
4. **Error message** cụ thể

---

## 💡 Tips

- DailyOTP API có thể chậm hơn các provider khác
- Nên kiểm tra balance thường xuyên
- Nếu hay gặp timeout, có thể tăng timeout lên 20s
- Log chi tiết giúp debug nhanh hơn

---

**Đã cập nhật:** Code hiện tại đã có error handling và logging tốt hơn nhiều! 🎉

