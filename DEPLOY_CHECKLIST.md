# ✅ Checklist Trước Khi Deploy/Push lên GitHub

## 🔍 Kiểm Tra Files

### 1. File `.env`
- [ ] File `.env` có trong `.gitignore`
- [ ] Kiểm tra `.env` KHÔNG có trong `git status`
- [ ] Đã tạo `config.example.env` (không chứa token thật)

### 2. Source Code
- [ ] KHÔNG có tokens hardcoded trong source
- [ ] Tất cả tokens đọc từ `process.env.XXX`
- [ ] Có validate tokens khi start app

### 3. Git Status
```bash
# Chạy lệnh này và kiểm tra
git status

# ĐẢM BẢO .env KHÔNG CÓ trong danh sách!
```

### 4. Files Cần Push
✅ **NÊN push:**
- `server.js`
- `telegram-bot.js`
- `public/index.html`
- `package.json`
- `.gitignore`
- `config.example.env`
- `README.md`
- `SETUP.md`
- `SECURITY.md`
- Tất cả documentation files

❌ **KHÔNG push:**
- `.env` (chứa tokens thật!)
- `node_modules/`
- `*.log`
- `.DS_Store`, `Thumbs.db`

## 🚀 Deploy Lên GitHub

### Bước 1: Khởi tạo Git (nếu chưa có)
```bash
git init
git add .
git commit -m "Initial commit"
```

### Bước 2: Kiểm tra lại lần cuối
```bash
# Xem tất cả files sẽ được commit
git ls-files

# Đảm bảo .env KHÔNG có trong list
# Nếu có, xóa ngay:
git rm --cached .env
git commit -m "Remove .env from tracking"
```

### Bước 3: Push lên GitHub
```bash
# Thêm remote repository
git remote add origin https://github.com/username/repo-name.git

# Push
git push -u origin main
```

### Bước 4: Cập nhật README trên GitHub
- [ ] Thêm hướng dẫn cài đặt
- [ ] Cảnh báo về bảo mật
- [ ] Link đến SETUP.md và SECURITY.md

## 🔐 Cho Người Khác Sử Dụng

### Hướng dẫn trong README.md:

```markdown
## Setup

1. Clone repository
2. Run `npm install`
3. Copy `config.example.env` to `.env`
4. Fill in your tokens in `.env`
5. Run `npm start`
```

### Email/Message template:

```
Xin chào,

Để sử dụng project này:

1. Clone repo: git clone <url>
2. Copy config.example.env thành .env
3. Điền tokens của bạn vào .env:
   - KHOTAIKHOAN_TOKEN: Lấy tại khotaikhoan.vip
   - VIOTP_TOKEN: Lấy tại viotp.com
   - TELEGRAM_BOT_TOKEN: Lấy từ @BotFather
4. npm install
5. npm start

LƯU Ý: Không push file .env lên GitHub!
```

## 🏢 Production Deployment

### Vercel
```bash
# Thêm environment variables trong Vercel Dashboard
# Settings → Environment Variables
KHOTAIKHOAN_TOKEN=xxx
VIOTP_TOKEN=xxx
TELEGRAM_BOT_TOKEN=xxx
```

### Heroku
```bash
heroku config:set KHOTAIKHOAN_TOKEN=xxx
heroku config:set VIOTP_TOKEN=xxx
heroku config:set TELEGRAM_BOT_TOKEN=xxx
```

### Docker
```dockerfile
# .env file sẽ được mount hoặc pass qua -e
docker run -e KHOTAIKHOAN_TOKEN=xxx ...
```

## 🐛 Nếu Đã Lỡ Push Token

### Bước 1: Đổi token ngay lập tức
- Vào trang API provider
- Generate token mới
- Update file `.env` local

### Bước 2: Xóa token khỏi Git history
```bash
# Cảnh báo: Lệnh này sẽ rewrite history!
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push
git push origin --force --all
```

### Bước 3: Thông báo team
- Báo cho team biết token đã bị lộ
- Đổi token mới cho mọi người

## ✅ Final Check

- [ ] `.env` trong `.gitignore`
- [ ] `.env` KHÔNG có trong `git ls-files`
- [ ] Source code dùng `process.env`
- [ ] `config.example.env` có trong repo
- [ ] README.md có hướng dẫn setup
- [ ] SECURITY.md có trong repo
- [ ] Test app chạy được với `.env`
- [ ] Documentation đầy đủ

## 🎉 Sẵn Sàng Deploy!

Nếu tất cả checklist đều ✅, bạn có thể an tâm push lên GitHub!

```bash
git push origin main
```

**Nhớ:** Bảo mật không phải là option, là bắt buộc! 🔒

