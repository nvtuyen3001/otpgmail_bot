# 🚀 Hướng Dẫn Cài Đặt

## 📋 Yêu Cầu

- Node.js >= 14.x
- npm hoặc yarn
- API Token từ KhoTaiKhoan.vip
- API Token từ VIOTP.com
- Telegram Bot Token (tùy chọn - cho bot thông báo)

## 🔧 Cài Đặt

### Bước 1: Clone Repository

```bash
git clone <repository-url>
cd otp_gmail
```

### Bước 2: Cài Dependencies

```bash
npm install
```

### Bước 3: Cấu Hình Environment Variables

1. **Copy file mẫu:**
```bash
# Windows
copy config.example.env .env

# Linux/Mac
cp config.example.env .env
```

2. **Mở file `.env` và điền tokens:**

```env
# KhoTaiKhoan.vip API Token
KHOTAIKHOAN_TOKEN=your_token_here

# VIOTP API Token
VIOTP_TOKEN=your_token_here

# Telegram Bot Token (tùy chọn)
TELEGRAM_BOT_TOKEN=your_bot_token_here

# Server Port
PORT=3000
```

### Bước 4: Lấy API Tokens

#### KhoTaiKhoan.vip:
1. Đăng ký tài khoản tại https://khotaikhoan.vip
2. Vào phần API settings
3. Copy API Token

#### VIOTP.com:
1. Đăng ký tài khoản tại https://viotp.com
2. Vào phần API
3. Copy API Token

#### Telegram Bot (Tùy chọn):
1. Mở Telegram, tìm `@BotFather`
2. Gửi `/newbot`
3. Làm theo hướng dẫn
4. Copy Bot Token

## ▶️ Chạy Ứng Dụng

### Chỉ chạy Web Server:

```bash
npm start
```

Hoặc:

```bash
node server.js
```

Truy cập: http://localhost:3000

### Chỉ chạy Telegram Bot:

```bash
npm run bot
```

Hoặc:

```bash
node telegram-bot.js
```

### Chạy cả hai (Development):

**Windows (PowerShell):**
```powershell
# Terminal 1
node server.js

# Terminal 2
node telegram-bot.js
```

**Linux/Mac:**
```bash
npm run dev
```

## 🐳 Deploy với Docker (Tùy chọn)

```bash
# Build image
docker build -t otp-gmail-service .

# Run container
docker run -d \
  -p 3000:3000 \
  -e KHOTAIKHOAN_TOKEN=your_token \
  -e VIOTP_TOKEN=your_token \
  -e TELEGRAM_BOT_TOKEN=your_token \
  --name otp-service \
  otp-gmail-service
```

## 🔒 Bảo Mật

⚠️ **QUAN TRỌNG:**

1. **KHÔNG BAO GIỜ** commit file `.env` lên GitHub
2. File `.env` đã được thêm vào `.gitignore`
3. Chỉ commit file `config.example.env` (không chứa token thật)
4. Không hardcode token trong source code
5. Sử dụng environment variables cho production

## ✅ Kiểm Tra Cài Đặt

Nếu thiếu tokens, bạn sẽ thấy lỗi:

```
❌ Lỗi: Thiếu API tokens! Vui lòng tạo file .env và thêm tokens.
💡 Copy file config.example.env thành .env và điền token thật.
```

Nếu thành công:

```
🚀 Server đang chạy tại http://localhost:3000
```

Hoặc (cho bot):

```
🤖 Telegram Bot đã khởi động!
✅ Bot đã sẵn sàng! Kiểm tra mỗi 30 giây...
```

## 🐛 Troubleshooting

### Lỗi: Cannot find module 'dotenv'
```bash
npm install dotenv
```

### Lỗi: Missing tokens
- Kiểm tra file `.env` có tồn tại không
- Kiểm tra tên biến trong `.env` có đúng không
- Đảm bảo không có khoảng trắng thừa

### Port đã được sử dụng
```bash
# Thay đổi port trong .env
PORT=3001
```

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra file `.env` đã được tạo chưa
2. Kiểm tra tokens có đúng không
3. Xem logs trong terminal
4. Đọc file README.md để biết thêm chi tiết

