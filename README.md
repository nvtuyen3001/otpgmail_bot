# Dịch vụ Thuê Số OTP

Web app đơn giản để thuê số điện thoại và nhận OTP từ 3 nguồn API:
- **khotaikhoan.vip** - Gmail/Google (quốc tế)
- **viotp.com** - Gmail (Vinaphone Việt Nam)
- **dailyotp.com** - Gmail/Google/YouTube (Bangladesh)

## Cài đặt

```bash
npm install
```

## Cấu hình

### 1. Tạo file `.env` từ template:

```bash
# Windows
copy config.example.env .env

# Linux/Mac
cp config.example.env .env
```

### 2. Mở file `.env` và điền API Tokens:

```env
KHOTAIKHOAN_TOKEN=your_khotaikhoan_token_here
VIOTP_TOKEN=your_viotp_token_here
DAILYOTP_API_KEY=your_dailyotp_api_key_here
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
PORT=3000
```

⚠️ **LƯU Ý:** File `.env` chứa tokens nhạy cảm và đã được thêm vào `.gitignore`. **KHÔNG push file này lên GitHub!**

📖 Xem hướng dẫn chi tiết: [SETUP.md](SETUP.md)

## Chạy ứng dụng

### Chạy Web Server:

```bash
node server.js
```

hoặc

```bash
npm start
```

Sau đó truy cập: `http://localhost:3000`

### Chạy Telegram Bot (Tùy chọn):

Xem hướng dẫn chi tiết: [TELEGRAM_BOT_SETUP.md](TELEGRAM_BOT_SETUP.md)

```bash
node telegram-bot.js
```

hoặc

```bash
npm run bot
```

Bot sẽ tự động thông báo khi VIOTP có số Gmail sẵn sàng!

## Cấu trúc thư mục

```
otp_gmail/
├── server.js                  # Backend Node.js + Express
├── telegram-bot.js            # Telegram Bot thông báo
├── package.json               # Dependencies
├── README.md                  # Hướng dẫn chính
├── TELEGRAM_BOT_SETUP.md      # Hướng dẫn cài bot
└── public/
    └── index.html             # Frontend (HTML + CSS + JS)
```

## Tính năng

### Web App:
- ✅ Hỗ trợ 3 nguồn API: KhoTaiKhoan.vip, VIOTP.com, DailyOTP.com
- ✅ Chọn dịch vụ Gmail/Google từ 3 provider
- ✅ VIOTP: Thuê số Vinaphone Việt Nam
- ✅ DailyOTP: Số Bangladesh với giá rẻ
- ✅ Thuê số điện thoại tự động
- ✅ Tự động kiểm tra OTP mỗi 3 giây
- ✅ Hiển thị trạng thái: Đang chờ OTP, Hoàn thành, Hết hạn
- ✅ Hiển thị số dư realtime
- ✅ Copy số điện thoại và OTP dễ dàng
- ✅ Giao diện đẹp, tối giản
- ✅ Logging chi tiết để debug
- ✅ Error handling tốt

### Telegram Bot:
- ✅ Thông báo tự động khi VIOTP có số Gmail
- ✅ Kiểm tra mỗi 30 giây
- ✅ Hỗ trợ nhiều người dùng đăng ký
- ✅ Kiểm tra số dư VIOTP
- ✅ Các lệnh: /subscribe, /check, /status, /balance

## API Endpoints

### POST /api/request
Thuê số điện thoại mới

**Request:**
```json
{
  "service": "Gmail/Google"
}
```

**Response:**
```json
{
  "success": true,
  "id": "123456",
  "phone": "0987654321"
}
```

### GET /api/check?id=123456
Kiểm tra OTP

**Response:**
```json
{
  "success": true,
  "otp_code": "123456",
  "status": "completed"
}
```

## Debug & Testing

### Test DailyOTP API
```bash
npm run test:dailyotp
```

Script này sẽ test:
- ✅ Balance API
- ✅ Rent Number API
- ✅ Get Messages API

### Debug DailyOTP trên Production
Xem hướng dẫn chi tiết: [DAILYOTP_DEBUG.md](DAILYOTP_DEBUG.md)

## Lưu ý

- API Token được ẩn ở server, không lộ ra client
- OTP sẽ tự động cập nhật khi có
- Nếu sau 10 phút không có OTP, đơn sẽ tự động hết hạn
- DailyOTP có timeout 15s cho rent và 10s cho check

