# 🚀 HƯỚNG DẪN DEPLOY TỪNG BƯỚC - NETLIFY + RENDER

## 📋 Chuẩn Bị

- ✅ GitHub repository: https://github.com/nvtuyen3001/otpgmail_bot
- ✅ Code đã được push
- ✅ Có sẵn tokens: KHOTAIKHOAN_TOKEN, VIOTP_TOKEN, TELEGRAM_BOT_TOKEN

---

# PHẦN 1: DEPLOY BACKEND API LÊN RENDER 🔧

## Bước 1: Đăng Ký Render

1. Truy cập: **https://render.com**
2. Click **"Get Started for Free"**
3. Chọn **"Sign up with GitHub"**
4. Authorize Render truy cập GitHub

---

## Bước 2: Deploy Backend (Express API)

### 2.1. Tạo Web Service

1. Click **"New +"** (góc trên bên phải)
2. Chọn **"Web Service"**
3. Click **"Connect a repository"**
4. Tìm và chọn: **`nvtuyen3001/otpgmail_bot`**

### 2.2. Cấu Hình Service

Điền thông tin:

```
Name: otpgmail-backend
Region: Singapore (hoặc gần Việt Nam nhất)
Branch: main
Root Directory: (để trống)
Runtime: Node
Build Command: npm install
Start Command: node server.js
Instance Type: Free
```

### 2.3. Thêm Environment Variables

Scroll xuống phần **"Environment Variables"**, click **"Add Environment Variable"**

Thêm 3 biến:

```
Key: KHOTAIKHOAN_TOKEN
Value: f07ce62a1dfb9f7b5a8a12dd0a8ec59e87f703e2da9aef13cb04ah2zwa3fa0e5

Key: VIOTP_TOKEN
Value: 7fd2a591d2054e13b2a732fd60810d8a

Key: PORT
Value: 3000
```

### 2.4. Deploy

1. Click **"Create Web Service"**
2. Đợi ~3-5 phút
3. Khi status = **"Live"** → Thành công!
4. **LƯU LẠI URL**: `https://otpgmail-backend.onrender.com`

### 2.5. Test Backend

Mở browser, truy cập:
```
https://otpgmail-backend.onrender.com
```

Hoặc test API:
```
https://otpgmail-backend.onrender.com/api/check?requestId=test&provider=viotp
```

---

## Bước 3: Deploy Telegram Bot (Background Worker)

### 3.1. Tạo Background Worker

1. Click **"New +"** → **"Background Worker"**
2. Chọn repository: **`nvtuyen3001/otpgmail_bot`**

### 3.2. Cấu Hình Worker

```
Name: otpgmail-telegram-bot
Region: Singapore
Branch: main
Root Directory: (để trống)
Runtime: Node
Build Command: npm install
Start Command: node telegram-bot.js
Instance Type: Free
```

### 3.3. Thêm Environment Variables

```
Key: TELEGRAM_BOT_TOKEN
Value: 7635730400:AAGlhLhcqovt_DVkDPlZwwoRMEhlgffIVd0

Key: VIOTP_TOKEN
Value: 7fd2a591d2054e13b2a732fd60810d8a
```

### 3.4. Deploy

1. Click **"Create Background Worker"**
2. Đợi bot khởi động
3. Kiểm tra Logs → Thấy:
   ```
   🤖 Telegram Bot đã khởi động!
   ✅ Bot đã sẵn sàng!
   ```

### 3.5. Test Bot

1. Mở Telegram
2. Tìm bot của bạn
3. Gửi `/start`
4. Gửi `/status` → Xem bot có hoạt động không

---

# PHẦN 2: DEPLOY FRONTEND LÊN NETLIFY 🌐

## Bước 4: Cập Nhật Frontend URL

Trước khi deploy Netlify, cần update API endpoint trong frontend.

### 4.1. Sửa file `public/index.html`

Tìm dòng này (khoảng dòng 230-240):

```javascript
const response = await fetch('/api/request', {
```

Thay đổi thành:

```javascript
const API_BASE_URL = 'https://otpgmail-backend.onrender.com';
const response = await fetch(`${API_BASE_URL}/api/request`, {
```

Làm tương tự cho tất cả các fetch:
- `/api/request` → `${API_BASE_URL}/api/request`
- `/api/check` → `${API_BASE_URL}/api/check`

### 4.2. Push Update Lên GitHub

```bash
git add public/index.html
git commit -m "Update API endpoint to Render backend"
git push origin main
```

---

## Bước 5: Deploy Lên Netlify

### 5.1. Đăng Ký Netlify

1. Truy cập: **https://www.netlify.com**
2. Click **"Sign up"**
3. Chọn **"Sign up with GitHub"**
4. Authorize Netlify

### 5.2. Import Project

1. Click **"Add new site"**
2. Chọn **"Import an existing project"**
3. Click **"Deploy with GitHub"**
4. Tìm và chọn: **`nvtuyen3001/otpgmail_bot`**

### 5.3. Cấu Hình Build

```
Branch to deploy: main
Base directory: (để trống)
Build command: (để trống)
Publish directory: public
```

### 5.4. Deploy

1. Click **"Deploy site"**
2. Đợi ~1-2 phút
3. Khi deploy xong, bạn sẽ có URL tạm:
   ```
   https://random-name-12345.netlify.app
   ```
4. Click vào URL để test

---

## Bước 6: Đổi Tên Site (Tùy chọn)

1. Trong Netlify Dashboard
2. Go to **"Site settings"**
3. Click **"Change site name"**
4. Đổi thành: `otpgmail` hoặc tên bạn thích
5. URL mới: `https://otpgmail.netlify.app`

---

# PHẦN 3: KẾT NỐI DOMAIN NAMECHEAP 🌐

## Bước 7: Thêm Custom Domain Trong Netlify

### 7.1. Add Domain

1. Trong Netlify site dashboard
2. Go to **"Domain management"**
3. Click **"Add a domain"**
4. Nhập domain của bạn (ví dụ: `otpgmail.com`)
5. Click **"Verify"**
6. Click **"Add domain"**

### 7.2. Chọn Phương Thức DNS

Netlify sẽ hỏi bạn chọn:

**Option A: Use Netlify DNS** (Khuyên dùng - dễ nhất)
- Click **"Use Netlify DNS"**
- Netlify sẽ cho bạn 4 nameservers

**Option B: Use External DNS** (Dùng DNS của Namecheap)
- Click **"Use external DNS"**
- Netlify sẽ cho bạn DNS records để add vào Namecheap

---

## Bước 8: Cấu Hình DNS Trên Namecheap

### Cách 1: Dùng Netlify DNS (Khuyên dùng)

#### 8.1. Lấy Nameservers Từ Netlify

Netlify sẽ hiển thị 4 nameservers như:
```
dns1.p03.nsone.net
dns2.p03.nsone.net
dns3.p03.nsone.net
dns4.p03.nsone.net
```

#### 8.2. Update Nameservers Trong Namecheap

1. Đăng nhập **Namecheap**
2. Go to **"Domain List"**
3. Click **"Manage"** bên cạnh domain của bạn
4. Tìm phần **"NAMESERVERS"**
5. Chọn **"Custom DNS"**
6. Paste 4 nameservers từ Netlify:
   ```
   Nameserver 1: dns1.p03.nsone.net
   Nameserver 2: dns2.p03.nsone.net
   Nameserver 3: dns3.p03.nsone.net
   Nameserver 4: dns4.p03.nsone.net
   ```
7. Click **"✓"** (Save)

#### 8.3. Verify Trong Netlify

1. Quay lại Netlify
2. Click **"Verify DNS configuration"**
3. Đợi ~5-30 phút để DNS propagate
4. Refresh page
5. Khi verification pass → Click **"Provision certificate"**
6. Đợi vài phút → HTTPS sẵn sàng!

---

### Cách 2: Dùng Namecheap DNS

#### 8.1. Lấy DNS Records Từ Netlify

Netlify sẽ hiển thị:
```
A Record:
  Host: @
  Value: 75.2.60.5

CNAME Record:
  Host: www
  Value: your-site.netlify.app
```

#### 8.2. Add Records Vào Namecheap

1. Đăng nhập **Namecheap**
2. Go to **"Domain List"** → **"Manage"**
3. Chọn tab **"Advanced DNS"**
4. Xóa tất cả records cũ (nếu có)
5. Click **"ADD NEW RECORD"**

**Thêm A Record:**
```
Type: A Record
Host: @
Value: 75.2.60.5
TTL: Automatic
```

**Thêm CNAME Record:**
```
Type: CNAME Record
Host: www
Value: your-site.netlify.app
TTL: Automatic
```

6. Click **"Save All Changes"**

#### 8.3. Verify và Enable HTTPS

Tương tự Cách 1, bước 8.3

---

## Bước 9: Đợi DNS Propagate

- **Thời gian**: 5 phút - 48 giờ (thường 30 phút)
- **Kiểm tra** tại: https://dnschecker.org

Nhập domain của bạn và kiểm tra:
- ✅ Tất cả vị trí trỏ đến IP của Netlify
- ✅ SSL certificate đã active

---

# ✅ KIỂM TRA HOÀN TẤT

## Test Từng Phần:

### 1. Backend API:
```
https://otpgmail-backend.onrender.com
```
→ Phải hiển thị "Cannot GET /" (nghĩa là server đang chạy)

### 2. Telegram Bot:
Gửi `/status` cho bot → Phải trả lời

### 3. Frontend (Netlify):
```
https://otpgmail.netlify.app
hoặc
https://yourdomain.com
```
→ Phải hiển thị giao diện đầy đủ

### 4. Test Toàn Bộ:
1. Vào web
2. Chọn dịch vụ
3. Click "Thuê số"
4. Kiểm tra có thuê được số không

---

# ⚠️ LƯU Ý QUAN TRỌNG

## Render Free Tier:

### Hạn chế:
- ⏰ Service **sleep** sau 15 phút không sử dụng
- 🐌 Request đầu tiên sau khi sleep mất ~30 giây để wake up
- 📊 750 giờ free/tháng (đủ cho 1 service chạy liên tục)

### Giải pháp:

**Option 1: Dùng Cron Job Ping**
Tạo cron job ping mỗi 14 phút để giữ service awake:
- Dùng cron-job.org
- Ping: `https://otpgmail-backend.onrender.com`

**Option 2: Upgrade Paid** ($7/tháng)
- Không sleep
- Tốc độ nhanh hơn
- 24/7 uptime

---

# 🎉 HOÀN THÀNH!

Giờ bạn đã có:

✅ **Backend API** chạy trên Render  
✅ **Telegram Bot** chạy 24/7 trên Render  
✅ **Frontend** host trên Netlify  
✅ **Custom Domain** từ Namecheap  
✅ **HTTPS** tự động (Let's Encrypt)  

## URLs:

- Frontend: `https://yourdomain.com`
- Backend: `https://otpgmail-backend.onrender.com`
- GitHub: `https://github.com/nvtuyen3001/otpgmail_bot`

---

# 🐛 TROUBLESHOOTING

## Lỗi: Cannot connect to API

**Nguyên nhân**: CORS hoặc backend URL sai

**Giải pháp**:
1. Kiểm tra URL backend trong `public/index.html`
2. Kiểm tra backend có đang chạy không
3. Mở Browser Console (F12) xem lỗi gì

## Lỗi: Site không load

**Nguyên nhân**: DNS chưa propagate

**Giải pháp**:
1. Đợi thêm (tối đa 48h)
2. Kiểm tra DNS: https://dnschecker.org
3. Xóa cache browser (Ctrl + Shift + R)

## Lỗi: Bot không hoạt động

**Nguyên nhân**: Bot token sai hoặc service stopped

**Giải pháp**:
1. Vào Render Dashboard
2. Kiểm tra Logs của bot
3. Restart service nếu cần

---

# 💰 CHI PHÍ

- **Netlify**: Miễn phí (100GB bandwidth/tháng)
- **Render Free**: Miễn phí (750h/tháng, có sleep)
- **Render Paid**: $7/tháng (không sleep, tốt hơn)
- **Domain**: ~$10-15/năm (bạn đã có)

**Tổng chi phí tối thiểu**: $0/tháng (hoàn toàn miễn phí!)

---

Nếu gặp vấn đề, hãy kiểm tra logs trong:
- Render Dashboard → Service → Logs
- Browser Console (F12)
- Telegram Bot logs

**Chúc mừng! Bạn đã deploy thành công! 🎉**

