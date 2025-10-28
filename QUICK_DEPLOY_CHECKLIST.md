# ⚡ CHECKLIST DEPLOY NHANH - NETLIFY + RENDER

## ✅ Chuẩn Bị (ĐÃ XONG)

- [x] Code đã push lên GitHub
- [x] Frontend đã config API endpoint động
- [x] Có sẵn tokens

---

## 🔧 BƯỚC 1: DEPLOY BACKEND LÊN RENDER (10 phút)

### 1.1. Đăng ký Render
- [ ] Truy cập: https://render.com
- [ ] Sign up with GitHub
- [ ] Authorize Render

### 1.2. Deploy Backend API
- [ ] Click "New +" → "Web Service"
- [ ] Chọn repo: `nvtuyen3001/otpgmail_bot`
- [ ] Config:
  ```
  Name: otpgmail-backend
  Runtime: Node
  Build: npm install
  Start: node server.js
  ```
- [ ] Add Environment Variables:
  ```
  KHOTAIKHOAN_TOKEN=f07ce62a1dfb9f7b5a8a12dd0a8ec59e87f703e2da9aef13cb04ah2zwa3fa0e5
  VIOTP_TOKEN=7fd2a591d2054e13b2a732fd60810d8a
  PORT=3000
  ```
- [ ] Click "Create Web Service"
- [ ] Đợi status = "Live"
- [ ] **LƯU URL**: `https://otpgmail-backend.onrender.com`

### 1.3. Deploy Telegram Bot
- [ ] Click "New +" → "Background Worker"
- [ ] Chọn repo: `nvtuyen3001/otpgmail_bot`
- [ ] Config:
  ```
  Name: otpgmail-telegram-bot
  Runtime: Node
  Build: npm install
  Start: node telegram-bot.js
  ```
- [ ] Add Environment Variables:
  ```
  TELEGRAM_BOT_TOKEN=7635730400:AAGlhLhcqovt_DVkDPlZwwoRMEhlgffIVd0
  VIOTP_TOKEN=7fd2a591d2054e13b2a732fd60810d8a
  ```
- [ ] Click "Create Background Worker"
- [ ] Kiểm tra Logs xem bot có start không

---

## 🌐 BƯỚC 2: DEPLOY FRONTEND LÊN NETLIFY (5 phút)

### 2.1. Cập nhật Backend URL (Nếu cần)
- [ ] Mở `public/index.html`
- [ ] Tìm dòng `const API_BASE_URL`
- [ ] Đảm bảo URL đúng: `https://otpgmail-backend.onrender.com`
- [ ] Commit và push nếu có thay đổi

### 2.2. Deploy Netlify
- [ ] Truy cập: https://www.netlify.com
- [ ] Sign up with GitHub
- [ ] Click "Add new site" → "Import from GitHub"
- [ ] Chọn repo: `nvtuyen3001/otpgmail_bot`
- [ ] Config:
  ```
  Build command: (để trống)
  Publish directory: public
  ```
- [ ] Click "Deploy site"
- [ ] Đợi deploy xong
- [ ] **LƯU URL**: `https://random-name.netlify.app`

### 2.3. Đổi Tên Site (Tùy chọn)
- [ ] Site settings → Change site name
- [ ] Đổi thành: `otpgmail` hoặc tên khác
- [ ] URL mới: `https://otpgmail.netlify.app`

---

## 🌐 BƯỚC 3: KẾT NỐI DOMAIN NAMECHEAP (15-30 phút)

### 3.1. Add Domain Trong Netlify
- [ ] Domain management → "Add a domain"
- [ ] Nhập domain của bạn
- [ ] Click "Verify" → "Add domain"

### 3.2. Chọn DNS Method
- [ ] **Option A** (Khuyên dùng): Use Netlify DNS
  - [ ] Copy 4 nameservers từ Netlify
  - [ ] Paste vào Namecheap (bước 3.3)
  
- [ ] **Option B**: Use External DNS
  - [ ] Copy A record và CNAME từ Netlify
  - [ ] Add vào Namecheap Advanced DNS (bước 3.4)

### 3.3. Update Nameservers (Nếu chọn Option A)
- [ ] Đăng nhập Namecheap
- [ ] Domain List → Manage
- [ ] Nameservers → Custom DNS
- [ ] Paste 4 nameservers từ Netlify
- [ ] Save

### 3.4. Add DNS Records (Nếu chọn Option B)
- [ ] Đăng nhập Namecheap
- [ ] Domain List → Manage → Advanced DNS
- [ ] Add A Record: `@ → 75.2.60.5`
- [ ] Add CNAME: `www → your-site.netlify.app`
- [ ] Save All Changes

### 3.5. Enable HTTPS
- [ ] Quay lại Netlify
- [ ] Domain settings → Verify DNS
- [ ] Click "Provision certificate"
- [ ] Đợi vài phút → HTTPS active!

---

## ✅ BƯỚC 4: KIỂM TRA (5 phút)

### Test Backend
- [ ] Truy cập: `https://otpgmail-backend.onrender.com`
- [ ] Phải thấy "Cannot GET /" (OK)

### Test Bot
- [ ] Mở Telegram
- [ ] Gửi `/start` cho bot
- [ ] Gửi `/status` → Bot phải trả lời

### Test Frontend
- [ ] Truy cập: `https://otpgmail.netlify.app`
- [ ] Hoặc domain: `https://yourdomain.com`
- [ ] Chọn dịch vụ → Click "Thuê số"
- [ ] Kiểm tra có thuê được không

### Test Toàn Bộ
- [ ] Mở Browser Console (F12)
- [ ] Không có lỗi CORS
- [ ] API calls thành công
- [ ] OTP tự động cập nhật

---

## 🎉 HOÀN THÀNH!

Bạn đã có:
- ✅ Backend API trên Render
- ✅ Telegram Bot chạy 24/7
- ✅ Frontend trên Netlify
- ✅ Custom domain (nếu setup)
- ✅ HTTPS miễn phí

---

## 🔗 URLs Quan Trọng

**GitHub**: https://github.com/nvtuyen3001/otpgmail_bot

**Render Backend**: https://otpgmail-backend.onrender.com

**Netlify Frontend**: https://otpgmail.netlify.app

**Domain** (nếu có): https://yourdomain.com

---

## ⚠️ LƯU Ý

### Render Free Tier:
- Sleep sau 15 phút không dùng
- Request đầu mất ~30s để wake up
- Giải pháp: Upgrade $7/tháng hoặc dùng cron job ping

### DNS Propagate:
- Mất 5 phút - 48 giờ
- Kiểm tra: https://dnschecker.org
- Xóa cache: Ctrl + Shift + R

### Nếu Có Lỗi:
- Kiểm tra Render Logs
- Kiểm tra Browser Console (F12)
- Đọc DEPLOY_STEP_BY_STEP.md

---

## 📞 Support

Nếu gặp vấn đề:
1. Xem logs trong Render Dashboard
2. Xem Browser Console (F12)
3. Check DEPLOY_STEP_BY_STEP.md
4. Check TROUBLESHOOTING trong DEPLOY_GUIDE.md

---

**TỔNG THỜI GIAN**: ~30-45 phút

**CHI PHÍ**: $0/tháng (hoàn toàn miễn phí!)

**Chúc mừng! 🎉**

