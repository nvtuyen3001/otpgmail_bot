# 🐛 SỬA LỖI "FAILED TO FETCH"

## ❌ Nguyên Nhân Thường Gặp

### 1. Backend URL Sai
### 2. Backend Chưa Deploy hoặc Đang Sleep
### 3. CORS Chưa Được Cấu Hình
### 4. HTTPS/HTTP Mixed Content

---

## ✅ GIẢI PHÁP TỪNG BƯỚC

### BƯỚC 1: Kiểm Tra Backend URL

#### 1.1. Kiểm tra file `public/index.html`

Mở file và tìm dòng ~192:

```javascript
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? '' 
    : 'https://otpgmail-backend.onrender.com';
```

✅ **ĐÚNG**: So sánh với `'localhost'`  
❌ **SAI**: So sánh với `'https://...'` 

#### 1.2. Kiểm tra Backend có đang chạy không

Mở browser, truy cập:
```
https://otpgmail-backend.onrender.com
```

**Kết quả mong đợi**:
```
Cannot GET /
```
Hoặc response JSON → Backend đang chạy ✅

**Nếu thấy**:
- "Service Unavailable" → Backend đang sleep
- Không load được → Backend chưa deploy hoặc URL sai

---

### BƯỚC 2: Wake Up Backend (Nếu Đang Sleep)

Render Free Tier sleep sau 15 phút không dùng.

#### Cách Wake Up:

1. **Truy cập trực tiếp backend**:
   ```
   https://otpgmail-backend.onrender.com
   ```
   Đợi ~30 giây để wake up

2. **Hoặc call API test**:
   ```
   https://otpgmail-backend.onrender.com/api/check?requestId=test&provider=viotp
   ```

3. Sau khi thấy response → Thử lại trên frontend

---

### BƯỚC 3: Kiểm Tra Console Errors

#### 3.1. Mở Browser Console

1. Nhấn **F12** trên web của bạn
2. Chọn tab **Console**
3. Refresh page (F5)
4. Click "Thuê số"
5. Xem lỗi gì hiển thị

#### 3.2. Các Lỗi Thường Gặp

**Lỗi 1: CORS Error**
```
Access to fetch at 'https://...' from origin 'https://...' has been blocked by CORS policy
```

**Giải pháp**: Sửa backend CORS (xem Bước 4)

---

**Lỗi 2: ERR_CONNECTION_REFUSED**
```
Failed to fetch
net::ERR_CONNECTION_REFUSED
```

**Nguyên nhân**: Backend không chạy hoặc URL sai

**Giải pháp**:
- Kiểm tra backend URL
- Kiểm tra backend có đang chạy không (Render Dashboard)

---

**Lỗi 3: Mixed Content**
```
Mixed Content: The page at 'https://...' was loaded over HTTPS, but requested an insecure resource 'http://...'
```

**Nguyên nhân**: Frontend HTTPS nhưng gọi backend HTTP

**Giải pháp**: Đảm bảo backend URL dùng `https://` không phải `http://`

---

### BƯỚC 4: Sửa CORS Trong Backend

Nếu vẫn bị CORS error, cập nhật `server.js`:

```javascript
// Thay vì:
app.use(cors());

// Đổi thành:
app.use(cors({
  origin: [
    'https://otpgmail.netlify.app',
    'https://yourdomain.com', // Nếu có custom domain
    'http://localhost:3000'   // Cho development
  ],
  credentials: true
}));
```

Sau đó redeploy backend lên Render.

---

### BƯỚC 5: Kiểm Tra Network Tab

#### 5.1. Mở Network Tab

1. F12 → Tab **Network**
2. Tick ✅ "Preserve log"
3. Click "Thuê số"
4. Xem request đã gửi đi chưa

#### 5.2. Phân Tích Request

Click vào request `/api/request`:

**Status Code**:
- `200` → OK ✅
- `404` → Endpoint không tồn tại
- `500` → Lỗi server
- `0` hoặc `(failed)` → Không kết nối được

**Response**:
- Xem response body có gì
- Kiểm tra có error message không

---

### BƯỚC 6: Test Backend Trực Tiếp

#### 6.1. Test Bằng Postman hoặc cURL

```bash
# Test endpoint
curl -X POST https://otpgmail-backend.onrender.com/api/request \
  -H "Content-Type: application/json" \
  -d '{"serviceId":"2","provider":"khotaikhoan"}'
```

Hoặc dùng Postman:
```
URL: https://otpgmail-backend.onrender.com/api/request
Method: POST
Headers: Content-Type: application/json
Body (raw JSON):
{
  "serviceId": "2",
  "provider": "khotaikhoan"
}
```

**Nếu thành công** → Backend OK, vấn đề ở frontend  
**Nếu lỗi** → Vấn đề ở backend

---

### BƯỚC 7: Kiểm Tra Render Logs

#### 7.1. Vào Render Dashboard

1. Truy cập https://dashboard.render.com
2. Chọn service: `otpgmail-backend`
3. Xem tab **Logs**

#### 7.2. Tìm Lỗi

Khi bạn click "Thuê số", logs sẽ hiển thị:

```
[REQUEST] Provider: khotaikhoan, ServiceId: 2
[REQUEST KHOTAIKHOAN] Response: ...
```

Hoặc lỗi:
```
Error: ...
```

---

## 🔧 QUICK FIX

### Fix 1: Đảm Bảo Backend Đã Deploy

1. Vào https://dashboard.render.com
2. Kiểm tra service `otpgmail-backend`
3. Status phải là **"Live"** (màu xanh)
4. Nếu không, click "Manual Deploy" → "Deploy latest commit"

### Fix 2: Wake Up Backend

Truy cập:
```
https://otpgmail-backend.onrender.com
```

Đợi 30 giây → Thử lại

### Fix 3: Redeploy Frontend

```bash
git add public/index.html
git commit -m "Fix API endpoint configuration"
git push origin main
```

Netlify tự động redeploy sau vài phút.

---

## 🎯 CHECKLIST DEBUG

- [ ] Backend URL đúng trong `public/index.html`?
- [ ] Backend đang chạy (status Live)?
- [ ] Backend wake up (không sleep)?
- [ ] Browser Console có lỗi gì?
- [ ] Network tab có request được gửi không?
- [ ] CORS đã enable trong backend?
- [ ] Backend URL dùng HTTPS?
- [ ] Render logs có lỗi gì?

---

## 💡 TEST NHANH

### Test 1: Backend Alive
```
https://otpgmail-backend.onrender.com
```
→ Phải thấy "Cannot GET /" hoặc response

### Test 2: API Direct Call
Paste vào browser:
```
https://otpgmail-backend.onrender.com/api/check?requestId=test&provider=viotp
```
→ Phải có response JSON

### Test 3: Frontend Console
```javascript
// Paste vào Browser Console
console.log(API_BASE_URL);
```
→ Phải hiển thị: `https://otpgmail-backend.onrender.com`

---

## 🆘 VẪN KHÔNG ĐƯỢC?

Cho tôi biết:

1. **Backend URL bạn đang dùng**: `_______________`
2. **Frontend URL**: `_______________`
3. **Console error**: (Screenshot hoặc copy error)
4. **Render logs**: (Copy vài dòng cuối)

Tôi sẽ giúp debug cụ thể!

---

## ✅ SAU KHI SỬA

1. Clear browser cache (Ctrl + Shift + R)
2. Refresh page
3. Test lại "Thuê số"
4. Kiểm tra Console không có lỗi
5. Thành công! 🎉

