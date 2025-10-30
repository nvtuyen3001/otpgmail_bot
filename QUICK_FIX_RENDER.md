# ⚡ Quick Fix - Render Deploy Error

## 🔴 Lỗi gặp phải:
```
❌ Lỗi: Thiếu API tokens! Vui lòng tạo file .env và thêm tokens.
==> Exited with status 1
```

## ✅ Đã sửa xong! 

Code đã được update và push lên GitHub (commit `34e10ac`).

---

## 🚀 Bây giờ làm gì?

### Bước 1: Thêm Environment Variable trên Render (BẮT BUỘC)

1. Vào https://dashboard.render.com
2. Click vào service **otpgmail-backend**
3. Click tab **Environment** (bên trái)
4. Click **Add Environment Variable**
5. Thêm biến:

```
Key: DAILYOTP_API_KEY
Value: (dán API key DailyOTP của bạn)
```

6. Click **Save Changes**

### Bước 2: Deploy code mới

Render sẽ tự động restart sau khi save env vars.

Nếu chưa deploy code mới:
1. Tab **Manual Deploy**
2. Click **Deploy latest commit**

### Bước 3: Xem Logs

1. Tab **Logs**
2. Đợi ~30 giây
3. Tìm dòng:

**Thành công:**
```
🔑 Checking API tokens...
✅ Available providers:
   - DailyOTP
🚀 Server đang chạy tại http://localhost:3000
```

**Nếu vẫn lỗi:**
```
❌ Lỗi: Không có API token nào!
```
→ Quay lại Bước 1, kiểm tra đã save env vars chưa

---

## 📋 Lấy DailyOTP API Key ở đâu?

1. Vào https://dailyotp.com
2. Đăng nhập
3. Vào phần **API** hoặc **Settings**
4. Copy API Key
5. Dán vào Render Environment Variable

---

## 🧪 Test

Sau khi deploy thành công:

### Test Balance:
```
https://otpgmail-bot.onrender.com/api/balance
```

Kết quả:
```json
{
  "success": true,
  "balances": {
    "dailyotp": {
      "balance": 10.50
    }
  }
}
```

### Test Website:
1. Mở https://otpgmail-bot.onrender.com
2. Xem Balance có hiển thị không
3. Thử thuê số từ DailyOTP

---

## 💡 Giải thích

**Trước:**
- Server yêu cầu CẢ 3 tokens (KhoTaiKhoan, VIOTP, DailyOTP)
- Nếu thiếu 1 → Exit với lỗi

**Sau (đã fix):**
- Server chỉ cần ÍT NHẤT 1 token
- Log rõ provider nào available
- Không exit nếu có ít nhất 1 provider

---

## ⚠️ Lưu ý quan trọng

- File `.env` CHỈ dùng cho local
- Production PHẢI dùng Environment Variables
- Render KHÔNG đọc file `.env`
- Sau khi add/update env vars → Service tự restart

---

## 📚 Chi tiết

Xem file `RENDER_ENV_SETUP.md` để biết thêm chi tiết về:
- Cách add nhiều providers
- Troubleshooting
- Best practices

---

**Commit mới nhất:** `34e10ac` - Fix: Allow server to run with partial API tokens

Deploy code này và thêm `DAILYOTP_API_KEY` là xong! 🎉

