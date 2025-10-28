# 🤖 Hướng Dẫn Cài Đặt Telegram Bot

Bot Telegram tự động thông báo khi VIOTP có số Gmail (Vinaphone) sẵn sàng.

## 📋 Bước 1: Tạo Bot Telegram

1. **Mở Telegram**, tìm kiếm `@BotFather`
2. Gửi lệnh: `/newbot`
3. Đặt tên bot (ví dụ: `VIOTP Gmail Notifier`)
4. Đặt username bot (phải kết thúc bằng `bot`, ví dụ: `viotp_gmail_bot`)
5. **Lưu Bot Token** (dạng: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

## 🔧 Bước 2: Cấu Hình Bot

Mở file `telegram-bot.js` và thay đổi:

```javascript
const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE'; // Thay bằng token từ BotFather
```

### (Tùy chọn) Giới hạn người dùng:

Nếu muốn chỉ cho phép một số người cụ thể:

```javascript
const ALLOWED_CHAT_IDS = [123456789, 987654321]; // Thêm chat_id của bạn
```

Để lấy Chat ID của bạn:
1. Gửi tin nhắn cho bot `@userinfobot` trên Telegram
2. Copy `Id` number

## 🚀 Bước 3: Chạy Bot

### Chỉ chạy bot:
```bash
node telegram-bot.js
```

Hoặc:
```bash
npm run bot
```

### Chạy cả web server và bot:
```bash
# Terminal 1: Chạy web server
node server.js

# Terminal 2: Chạy bot
node telegram-bot.js
```

## 📱 Bước 4: Sử dụng Bot

1. **Tìm bot của bạn** trên Telegram (username bạn đã tạo)
2. Nhấn **Start** hoặc gửi `/start`
3. Gửi `/subscribe` để đăng ký nhận thông báo

## 📋 Các Lệnh Bot

| Lệnh | Chức năng |
|------|-----------|
| `/start` | Bắt đầu sử dụng bot |
| `/subscribe` | Đăng ký nhận thông báo tự động |
| `/unsubscribe` | Hủy đăng ký |
| `/check` | Kiểm tra ngay có số không |
| `/status` | Xem trạng thái bot |
| `/balance` | Xem số dư VIOTP |
| `/help` | Hiển thị trợ giúp |

## ⚙️ Cách Hoạt Động

1. Bot tự động kiểm tra **mỗi 30 giây** xem VIOTP có số Gmail không
2. Khi phát hiện có số → gửi thông báo cho **tất cả người đăng ký**
3. Bạn nhận thông báo và vào web `http://localhost:3000` để thuê số

## 🔔 Thông Báo

Bot sẽ gửi tin nhắn như sau:

```
🎉 VIOTP CÓ SỐ GMAIL!

Số Vinaphone sẵn sàng để thuê Gmail/Google.

👉 Vào web ngay: http://localhost:3000
⚡️ Nhanh tay kẻo hết!
```

## 🛠️ Tùy Chỉnh

### Thay đổi thời gian kiểm tra:

Mở `telegram-bot.js`, tìm dòng:

```javascript
const CHECK_INTERVAL = 30000; // 30 giây
```

Thay đổi giá trị (đơn vị: milliseconds):
- 10 giây = 10000
- 30 giây = 30000
- 1 phút = 60000

### Thay đổi URL web:

Tìm và sửa:
```javascript
👉 Vào web ngay: http://localhost:3000
```

Thành domain thật của bạn.

## ❗ Lưu Ý

- Bot cần chạy liên tục để nhận thông báo
- Nên chạy trên VPS/Server để bot hoạt động 24/7
- Kiểm tra quá thường xuyên có thể bị rate limit
- Token bot phải được giữ bí mật

## 🐛 Debug

Kiểm tra log trong terminal:
```
✅ Bot đã sẵn sàng! Kiểm tra mỗi 30 giây...
[AUTO CHECK] Checking... (Subscribers: 1)
✅ New subscriber: 123456789 (Total: 1)
```

Nếu có lỗi:
- Kiểm tra Bot Token có đúng không
- Kiểm tra VIOTP Token có đúng không
- Kiểm tra kết nối internet

## 📞 Support

Có vấn đề? Kiểm tra:
1. Bot token đã đúng chưa
2. Bot đã `/start` chưa
3. Đã `/subscribe` chưa
4. Terminal có báo lỗi gì không

