# 🔒 Bảo Mật

## Quản Lý Tokens

Dự án này sử dụng **environment variables** để bảo mật API tokens và thông tin nhạy cảm.

### ✅ Cách Đúng

1. **Lưu tokens trong file `.env`**
   ```env
   KHOTAIKHOAN_TOKEN=your_token_here
   VIOTP_TOKEN=your_token_here
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   ```

2. **File `.env` đã được thêm vào `.gitignore`**
   - Không bao giờ commit file này lên Git
   - Chỉ lưu trữ local

3. **Chia sẻ template thay vì token thật**
   - Push `config.example.env` (không chứa token thật)
   - Người khác copy và điền token của họ

### ❌ KHÔNG Làm

1. ❌ Hardcode token trong source code
   ```javascript
   // SAI - ĐỪNG LÀM THẾ NÀY!
   const TOKEN = '7fd2a591d2054e13b2a732fd60810d8a';
   ```

2. ❌ Commit file `.env` lên GitHub
3. ❌ Chia sẻ token qua chat/email không mã hóa
4. ❌ Screenshot code có chứa token
5. ❌ Push token trong commit history

### 🔍 Kiểm Tra Trước Khi Push

Trước khi push code lên GitHub, kiểm tra:

```bash
# Xem files sẽ được commit
git status

# Đảm bảo .env KHÔNG có trong danh sách
# Nếu có, hủy add:
git reset .env
```

### 🚨 Nếu Đã Lộ Token

Nếu vô tình push token lên GitHub:

1. **Ngay lập tức:** Đổi token mới trên trang API
2. **Xóa khỏi Git history:**
   ```bash
   # Xóa file khỏi history
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch .env" \
   --prune-empty --tag-name-filter cat -- --all
   
   # Force push
   git push origin --force --all
   ```
3. **Thông báo:** Nếu token bị lộ trong repository public, coi như đã bị compromise

### 📝 Best Practices

1. **Rotate tokens định kỳ**
   - Đổi token mỗi 3-6 tháng
   - Đặc biệt nếu có nhiều người sử dụng

2. **Sử dụng .gitignore**
   - Luôn thêm `.env` vào `.gitignore`
   - Commit `.gitignore` trước bất kỳ file nào khác

3. **Kiểm tra git hooks**
   - Cài đặt pre-commit hooks để ngăn commit file `.env`

4. **Production deployment**
   - Sử dụng secrets management của platform
   - Vercel: Environment Variables
   - Heroku: Config Vars
   - Docker: Environment variables hoặc secrets

### 🛡️ Production Deployment

Khi deploy production, **KHÔNG** upload file `.env`:

#### Vercel:
```bash
# Thêm environment variables trong dashboard
Settings → Environment Variables
```

#### Heroku:
```bash
heroku config:set KHOTAIKHOAN_TOKEN=your_token
heroku config:set VIOTP_TOKEN=your_token
heroku config:set TELEGRAM_BOT_TOKEN=your_token
```

#### Docker:
```bash
docker run -e KHOTAIKHOAN_TOKEN=your_token \
           -e VIOTP_TOKEN=your_token \
           -e TELEGRAM_BOT_TOKEN=your_token \
           your-image
```

### 📞 Báo Cáo Vấn Đề Bảo Mật

Nếu phát hiện lỗ hổng bảo mật, vui lòng **KHÔNG** tạo public issue. 
Liên hệ trực tiếp qua email để báo cáo.

---

**Nhớ:** Bảo mật là trách nhiệm của mọi người! 🔐

