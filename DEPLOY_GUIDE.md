# 🚀 Hướng Dẫn Deploy Lên Netlify + Domain Namecheap

## 📋 Tổng Quan Kiến Trúc

Vì project này cần Node.js server chạy 24/7, chúng ta sẽ chia làm 3 phần:

```
Frontend (Static)     →  Netlify + Domain Namecheap
Backend API (Express) →  Render.com (Free tier)
Telegram Bot         →  Render.com (Free tier)
```

---

## 🎯 PHẦN 1: Deploy Frontend Lên Netlify

### Bước 1: Đăng Ký Netlify

1. Truy cập https://www.netlify.com
2. Sign up (dùng GitHub account)
3. Click "Add new site" → "Import an existing project"

### Bước 2: Kết Nối GitHub Repository

1. Chọn "GitHub"
2. Authorize Netlify
3. Chọn repository: `nvtuyen3001/otpgmail_bot`

### Bước 3: Cấu Hình Build Settings

```
Build command: (để trống)
Publish directory: public
```

### Bước 4: Deploy

Click "Deploy site" → Đợi vài giây → Site sẵn sàng!

URL tạm: `https://random-name-123.netlify.app`

---

## 🎯 PHẦN 2: Deploy Backend Lên Render

### Bước 1: Tạo Account Render

1. Truy cập https://render.com
2. Sign up (dùng GitHub account)

### Bước 2: Deploy Backend API

1. Click "New +" → "Web Service"
2. Chọn repository: `nvtuyen3001/otpgmail_bot`
3. Cấu hình:

```
Name: otpgmail-backend
Environment: Node
Build Command: npm install
Start Command: node server.js
```

4. **Environment Variables** (quan trọng!):

```
KHOTAIKHOAN_TOKEN=your_token_here
VIOTP_TOKEN=your_token_here
PORT=3000
```

5. Click "Create Web Service"

→ Bạn sẽ có URL: `https://otpgmail-backend.onrender.com`

### Bước 3: Deploy Telegram Bot

1. Click "New +" → "Background Worker"
2. Chọn repository: `nvtuyen3001/otpgmail_bot`
3. Cấu hình:

```
Name: otpgmail-bot
Environment: Node
Build Command: npm install
Start Command: node telegram-bot.js
```

4. **Environment Variables**:

```
TELEGRAM_BOT_TOKEN=your_bot_token
VIOTP_TOKEN=your_token_here
```

5. Click "Create Background Worker"

---

## 🎯 PHẦN 3: Kết Nối Frontend với Backend

### Bước 1: Cập Nhật Frontend

Sửa file `public/index.html`, thay đổi API endpoint:

```javascript
// Thay vì: const response = await fetch('/api/request', ...
// Đổi thành:
const API_BASE_URL = 'https://otpgmail-backend.onrender.com';
const response = await fetch(`${API_BASE_URL}/api/request`, ...
```

### Bước 2: Redeploy Frontend

```bash
git add public/index.html
git commit -m "Update API endpoint"
git push origin main
```

Netlify sẽ tự động redeploy!

---

## 🌐 PHẦN 4: Kết Nối Domain Namecheap

### Bước 1: Lấy Netlify DNS Info

1. Vào Netlify Dashboard
2. Chọn site của bạn
3. Go to "Domain settings"
4. Click "Add custom domain"
5. Nhập domain của bạn (ví dụ: `otpgmail.com`)
6. Netlify sẽ cho bạn DNS records:

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site.netlify.app
```

### Bước 2: Cấu Hình DNS Trên Namecheap

1. Đăng nhập Namecheap
2. Go to "Domain List"
3. Click "Manage" bên cạnh domain
4. Chọn "Advanced DNS"
5. Xóa tất cả DNS records cũ
6. Thêm records mới từ Netlify:

#### Option A: Dùng Netlify DNS (Khuyên dùng - dễ nhất)

1. Trong Netlify, chọn "Use Netlify DNS"
2. Netlify sẽ cho bạn 4 nameservers:
   ```
   dns1.p03.nsone.net
   dns2.p03.nsone.net
   dns3.p03.nsone.net
   dns4.p03.nsone.net
   ```
3. Trong Namecheap → "Domain" → "Nameservers"
4. Chọn "Custom DNS"
5. Paste 4 nameservers từ Netlify
6. Save

#### Option B: Dùng Namecheap DNS

1. Thêm A Record:
   ```
   Type: A Record
   Host: @
   Value: 75.2.60.5
   TTL: Automatic
   ```

2. Thêm CNAME Record:
   ```
   Type: CNAME Record
   Host: www
   Value: your-site.netlify.app
   TTL: Automatic
   ```

3. Click "Save All Changes"

### Bước 3: Đợi DNS Propagate

- Thường mất 5-30 phút
- Có thể mất tới 48 giờ
- Kiểm tra tại: https://dnschecker.org

### Bước 4: Enable HTTPS Trong Netlify

1. Quay lại Netlify Dashboard
2. Domain settings → HTTPS
3. Click "Verify DNS configuration"
4. Click "Provision certificate"
5. Đợi vài phút → HTTPS sẵn sàng!

---

## ✅ Kiểm Tra Hoàn Tất

Sau khi setup xong:

1. **Frontend**: https://yourdomain.com → Hiển thị giao diện
2. **Backend API**: https://otpgmail-backend.onrender.com/api/check
3. **Telegram Bot**: Gửi `/status` cho bot

---

## 💰 Chi Phí

- ✅ **Netlify**: MIỄN PHÍ (100GB bandwidth/tháng)
- ✅ **Render Free Tier**: MIỄN PHÍ
  - ⚠️ Lưu ý: Free tier sleep sau 15 phút không dùng
  - First request sẽ mất ~30 giây để wake up
- 💵 **Render Paid** ($7/tháng): Không sleep, tốt hơn
- 💵 **Domain Namecheap**: ~$10-15/năm (bạn đã có)

---

## 🚀 PHƯƠNG ÁN 2: Deploy Toàn Bộ Lên VPS (Tốt Nhất)

Nếu bạn muốn performance tốt và không bị sleep:

### Nhà Cung Cấp VPS:
- **DigitalOcean**: $4-6/tháng
- **Vultr**: $3.5-6/tháng
- **Linode**: $5/tháng
- **Contabo**: €4/tháng (~$4.5)

### Setup:
```bash
# SSH vào VPS
ssh root@your-vps-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Clone project
git clone https://github.com/nvtuyen3001/otpgmail_bot.git
cd otpgmail_bot

# Setup
npm install
cp config.example.env .env
nano .env  # Điền tokens

# Install PM2 để chạy 24/7
npm install -g pm2

# Chạy
pm2 start server.js
pm2 start telegram-bot.js
pm2 save
pm2 startup

# Install Nginx
apt install nginx

# Cấu hình domain...
```

Point domain từ Namecheap đến VPS IP.

---

## 📞 Troubleshooting

### Frontend không call được Backend:
- Kiểm tra CORS trong `server.js`
- Kiểm tra URL backend trong frontend

### Render service sleep:
- Upgrade lên paid tier ($7/tháng)
- Hoặc dùng cron job ping mỗi 14 phút

### Domain không hoạt động:
- Đợi DNS propagate (tới 48h)
- Kiểm tra DNS: `nslookup yourdomain.com`
- Kiểm tra tại dnschecker.org

---

## 🎯 Bước Tiếp Theo

Bạn muốn:
1. **Deploy theo Option 1** (Netlify + Render - Free)?
2. **Deploy lên VPS** (Performance tốt hơn)?

Cho tôi biết và tôi sẽ hướng dẫn chi tiết từng bước!

