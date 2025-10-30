# 🚀 Deploy Update - DailyOTP Integration

## ✅ Đã Push lên GitHub

**Repository**: https://github.com/nvtuyen3001/otpgmail_bot

**Latest commit**: Add click to copy for phone numbers and OTP codes

## 📋 Những gì đã thêm

### 1. DailyOTP Integration
- ✅ API thuê số từ Bangladesh (Server 5)
- ✅ Dịch vụ: Google/Gmail/YouTube
- ✅ Auto-check OTP mỗi 3 giây
- ✅ Hiển thị số dư DailyOTP

### 2. Click to Copy
- ✅ Click số điện thoại → Copy với format:
  - DailyOTP: `+8801234567890`
  - VIOTP: `+84912345678`
- ✅ Click OTP → Copy trực tiếp
- ✅ Visual feedback + notifications

### 3. Balance Display
- ✅ Hiển thị số dư góc phải trên
- ✅ Auto-refresh mỗi 30 giây
- ✅ DailyOTP: Hiển thị real-time
- ✅ VIOTP: N/A (không có API)

## 🔧 Cần làm gì để deploy

### Option 1: Deploy trên Render (Recommended)

1. **Đăng nhập Render**: https://render.com
2. **Chọn Web Service** đang chạy
3. **Settings** → **Environment Variables**
4. **Thêm/Update**:
   ```
   DAILYOTP_API_KEY=52f771c0efb2d91c54263723a9ef131fVneDkBm14veGlmzS8BOV
   ```
5. **Save Changes**
6. Render sẽ tự động **redeploy** từ GitHub

### Option 2: Manual Deploy

Nếu không auto-deploy:

1. Vào **Dashboard** → Chọn service
2. Click **Manual Deploy** → **Deploy latest commit**
3. Đợi ~2-3 phút
4. Xong!

## 🧪 Test sau khi deploy

1. Mở URL production (ví dụ: `https://otpgmail-bot.onrender.com`)
2. Kiểm tra:
   - ✅ Có hiển thị số dư DailyOTP góc phải?
   - ✅ Có option "DailyOTP" trong dropdown?
   - ✅ Thuê số → Có nhận được phone number?
   - ✅ OTP có về và hiển thị?
   - ✅ Click số/OTP có copy được?

## 📝 Environment Variables Required

Đảm bảo có đủ các biến này trên production:

```env
KHOTAIKHOAN_TOKEN=your_token_here
VIOTP_TOKEN=your_token_here
DAILYOTP_API_KEY=52f771c0efb2d91c54263723a9ef131fVneDkBm14veGlmzS8BOV
TELEGRAM_BOT_TOKEN=your_bot_token_here (optional)
PORT=3000
```

## 🎯 Các API Endpoints

Mới thêm:
- `GET /api/balance` - Lấy số dư DailyOTP/VIOTP
- `POST /api/request` - Hỗ trợ provider `dailyotp`
- `GET /api/check` - Hỗ trợ check OTP từ DailyOTP

## ⚠️ Lưu ý

1. **API Key**: Đã hardcode trong code, nhưng nên lưu trong ENV
2. **CORS**: Đã enable cho production
3. **Rate Limiting**: Chưa có, nên thêm sau
4. **Logging**: Console log đầy đủ để debug

## 🐛 Debug nếu có lỗi

### Lỗi: "Thiếu API tokens"
→ Check Environment Variables trên Render có đủ không

### Lỗi: "Failed to rent number"
→ Check DailyOTP API key còn hoạt động không

### Lỗi: Balance hiển thị "Error"
→ DailyOTP API có thể bị rate limit hoặc key hết hạn

### OTP không về
→ Check backend logs trên Render Dashboard

## 📱 Telegram Bot (Optional)

Nếu muốn deploy cả Telegram bot:

```bash
# Trên Render, thêm background worker:
npm run bot
```

Hoặc tạo thêm 1 service riêng cho bot.

## ✨ Hoàn thành!

Sau khi deploy xong:
- GitHub: ✅ Updated
- Render: ✅ Deployed
- Testing: 🧪 Cần test
- Documentation: ✅ Complete

**URL Production**: https://otpgmail-bot.onrender.com (hoặc URL của bạn)

Chúc mừng! 🎉

