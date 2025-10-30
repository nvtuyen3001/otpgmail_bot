# 🔑 Setup Environment Variables trên Render

## Vấn đề đã sửa

Code đã được cập nhật để:
- ✅ Không yêu cầu tất cả tokens (chỉ cần ít nhất 1)
- ✅ Log rõ ràng provider nào available
- ✅ Trả về error message rõ ràng nếu thiếu token

## 🚀 Cách Setup trên Render

### Bước 1: Vào Dashboard

1. Truy cập: https://dashboard.render.com
2. Click vào service: **otpgmail-backend** (hoặc tên service của bạn)

### Bước 2: Thêm Environment Variables

1. Click tab **Environment** (bên trái)
2. Click nút **Add Environment Variable**

### Bước 3: Thêm các biến sau

#### Biến bắt buộc (ít nhất 1):

**DailyOTP (Khuyên dùng):**
```
Key: DAILYOTP_API_KEY
Value: your_dailyotp_api_key_here
```

**VIOTP:**
```
Key: VIOTP_TOKEN
Value: your_viotp_token_here
```

**KhoTaiKhoan:**
```
Key: KHOTAIKHOAN_TOKEN
Value: your_khotaikhoan_token_here
```

#### Biến tùy chọn:

**Telegram Bot (nếu dùng bot):**
```
Key: TELEGRAM_BOT_TOKEN
Value: your_telegram_bot_token_here
```

**Port (tự động):**
```
Key: PORT
Value: 3000
```
*(Render tự động set, không cần thêm)*

### Bước 4: Save và Deploy

1. Click **Save Changes**
2. Render sẽ tự động **restart** service
3. Đợi ~1-2 phút để service khởi động lại

---

## 📋 Ví dụ Setup với DailyOTP

Nếu bạn chỉ muốn dùng DailyOTP:

### Environment Variables:
```
DAILYOTP_API_KEY=sk_test_abc123xyz...
```

### Logs khi khởi động thành công:
```
🔑 Checking API tokens...
⚠️  Warning: KHOTAIKHOAN_TOKEN not found
⚠️  Warning: VIOTP_TOKEN not found
✅ Available providers:
   - DailyOTP
🚀 Server đang chạy tại http://localhost:3000
```

### Thử thuê số:
- ✅ DailyOTP: Hoạt động bình thường
- ❌ VIOTP: "VIOTP chưa được cấu hình..."
- ❌ KhoTaiKhoan: "KhoTaiKhoan chưa được cấu hình..."

---

## 🔍 Kiểm tra Environment Variables

### Cách 1: Qua Dashboard
1. Vào service → **Environment** tab
2. Xem danh sách biến đã thêm

### Cách 2: Qua Logs
1. Vào service → **Logs** tab
2. Tìm dòng:
```
🔑 Checking API tokens...
✅ Available providers:
   - DailyOTP
```

### Cách 3: Test API
Mở browser và truy cập:
```
https://your-app.onrender.com/api/balance
```

**Nếu có DailyOTP:**
```json
{
  "success": true,
  "balances": {
    "dailyotp": {
      "balance": 10.50,
      "limit": 100
    },
    "viotp": {
      "balance": null,
      "available": false
    }
  }
}
```

---

## ❌ Các lỗi thường gặp

### Lỗi 1: "Không có API token nào"

**Log:**
```
❌ Lỗi: Không có API token nào! Cần ít nhất 1 provider.
💡 Production: Set Environment Variables trong dashboard
```

**Nguyên nhân:** Chưa thêm bất kỳ token nào

**Cách sửa:**
1. Vào **Environment** tab
2. Thêm ít nhất 1 token (DAILYOTP_API_KEY khuyên dùng)
3. Save Changes
4. Đợi service restart

### Lỗi 2: "DailyOTP chưa được cấu hình"

**Trong browser console:**
```
[Frontend] Rent failed: {success: false, message: "DailyOTP chưa được cấu hình..."}
```

**Nguyên nhân:** Đã chọn DailyOTP nhưng chưa có `DAILYOTP_API_KEY`

**Cách sửa:**
1. Thêm `DAILYOTP_API_KEY` vào Environment Variables
2. Hoặc chọn provider khác (VIOTP/KhoTaiKhoan)

### Lỗi 3: Service restart nhưng không load biến mới

**Cách sửa:**
1. Vào tab **Manual Deploy**
2. Click **Deploy latest commit**
3. Hoặc click **Clear build cache & deploy**

---

## 🧪 Test sau khi setup

### Test 1: Kiểm tra logs

**Logs thành công:**
```
🔑 Checking API tokens...
✅ Available providers:
   - DailyOTP
🚀 Server đang chạy tại http://localhost:3000
```

### Test 2: Test Balance API

```bash
curl https://your-app.onrender.com/api/balance
```

**Response mong đợi:**
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

### Test 3: Test Rent Number

1. Mở website
2. Chọn provider có token
3. Click "Thuê số"
4. Kiểm tra có hoạt động không

---

## 📝 Checklist Setup

- [ ] Đã vào Render Dashboard
- [ ] Đã chọn đúng service
- [ ] Đã vào tab **Environment**
- [ ] Đã thêm ít nhất 1 API token
- [ ] Đã click **Save Changes**
- [ ] Service đã restart tự động
- [ ] Đã kiểm tra logs (có dòng "Available providers")
- [ ] Đã test Balance API
- [ ] Đã test thuê số từ website

---

## 💡 Tips

- **Khuyên dùng DailyOTP:** Giá rẻ, API ổn định
- **Có thể thêm nhiều providers:** Service sẽ hỗ trợ tất cả
- **Không cần tất cả tokens:** Chỉ cần provider bạn dùng
- **Logs rất quan trọng:** Luôn check logs sau khi deploy
- **Test trước khi dùng:** Đảm bảo balance API trả về đúng

---

## 🔗 Link hữu ích

- Render Dashboard: https://dashboard.render.com
- DailyOTP: https://dailyotp.com
- VIOTP: https://viotp.com
- KhoTaiKhoan: https://khotaikhoan.vip

---

**Cập nhật:** Code hiện tại cho phép server chạy với chỉ 1 provider! 🎉

