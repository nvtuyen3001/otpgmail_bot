# Test SMS222.us - Multiple Links Feature

## Cách sử dụng:

### 1. Khởi động server
```bash
node server.js
```

### 2. Mở trình duyệt
```
http://localhost:3000
```

### 3. Test với nhiều link

**Bước 1:** Chọn "SMS222.us - Web OTP Link" từ dropdown

**Bước 2:** Paste nhiều link vào textarea (mỗi link một dòng):
```
https://sms222.us?token=JGkaXTjU9611022259
https://sms222.us?token=CvkXP5uoyg11022259
https://sms222.us?token=boCDF3xJVu11022259
```

**Bước 3:** Click "Thuê số"

### 4. Kết quả mong đợi:

- Hệ thống sẽ xử lý từng link tuần tự
- Mỗi link sẽ xuất hiện một dòng trong bảng:
  - **STT**: Thứ tự
  - **Dịch vụ**: SMS222.us
  - **Số điện thoại**: Hiển thị 15 ký tự cuối của token (rút gọn)
  - **OTP**: Mã OTP được extract (có thể click để copy)
  - **Thời gian**: Thời gian xử lý
  - **Trạng thái**: Hoàn thành / Không tìm thấy OTP / Lỗi kết nối

### 5. Tính năng:

✅ **Copy OTP**: Click vào mã OTP để copy
✅ **Copy Link**: Click vào cột "Số điện thoại" để copy link đầy đủ
✅ **Batch processing**: Xử lý nhiều link cùng lúc
✅ **Thông báo**: Hiển thị số link thành công/thất bại
✅ **Delay**: Tự động delay 500ms giữa các request

### 6. Pattern OTP được hỗ trợ:

Backend tự động detect các pattern sau:
- `G-123456` (Google verification code)
- `123456` (6 chữ số bất kỳ)
- `verification code: 123456` (text + số 4-8 chữ số)

## Ví dụ Output:

```
STT | Dịch vụ      | Số điện thoại        | OTP    | Thời gian           | Trạng thái
1   | SMS222.us    | ...U9611022259       | 096682 | 05/11/2025 14:30:15 | Hoàn thành
2   | SMS222.us    | ...yg11022259        | 123456 | 05/11/2025 14:30:16 | Hoàn thành
3   | SMS222.us    | ...Vu11022259        | -      | 05/11/2025 14:30:17 | Không tìm thấy OTP
```

## Troubleshooting:

**Lỗi CORS**: Nếu SMS222.us block CORS, cần sử dụng proxy hoặc backend sẽ xử lý
**Link không hợp lệ**: Đảm bảo link chứa "sms222.us"
**Không tìm thấy OTP**: Có thể nội dung trang không có OTP hoặc format khác

