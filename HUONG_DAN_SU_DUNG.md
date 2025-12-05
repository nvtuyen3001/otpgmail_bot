# Hướng dẫn sử dụng SMS222 OTP

## Tính năng chính

Ứng dụng giúp bạn lấy mã OTP từ SMS222.us một cách nhanh chóng bằng cách:
1. Lưu danh sách số điện thoại với link tương ứng
2. Chỉ cần nhập số điện thoại để lấy OTP (không cần nhập link đầy đủ)

## Cách sử dụng

### Bước 1: Thêm danh sách số

1. Trong ô **"Quản lý danh sách số"**, nhập danh sách số theo định dạng:
   ```
   6159096093-https://sms222.us?token=Tr5MFk7K7g11211748
   5077789082-https://sms222.us?token=XzpleMEz5Z11211748
   ```

2. Mỗi dòng có định dạng: `số_điện_thoại-link_đầy_đủ`

3. Nhấn nút **"Lưu danh sách"** để lưu vào bộ nhớ trình duyệt

### Bước 2: Lấy OTP

1. Trong ô **"Nhập số điện thoại"**, nhập số cần lấy OTP (ví dụ: `6159096093`)

2. Nhấn nút **"Lấy OTP"**

3. Ứng dụng sẽ tự động:
   - Tìm link tương ứng với số điện thoại
   - Truy cập link và lấy mã OTP
   - Hiển thị kết quả trong bảng

### Bước 3: Copy OTP

- Click vào mã OTP trong bảng để copy
- Click vào số điện thoại để copy số

## Quản lý danh sách

- **Lưu danh sách**: Lưu số vào bộ nhớ trình duyệt (localStorage)
- **Xóa danh sách**: Xóa toàn bộ danh sách đã lưu
- Danh sách được tự động load khi mở trang

## Lưu ý

- Danh sách số được lưu trong trình duyệt, không bị mất khi tắt tab
- Định dạng phải chính xác: `số-link` (có dấu `-` giữa số và link)
- Link phải chứa `sms222.us`
- Số điện thoại phải có trong danh sách mới lấy được OTP

## Ví dụ

```
6159096093-https://sms222.us?token=Tr5MFk7K7g11211748
5077789082-https://sms222.us?token=XzpleMEz5Z11211748
4155551234-https://sms222.us?token=AbCdEfGh12345678
```

Sau khi lưu, chỉ cần nhập `6159096093` và nhấn "Lấy OTP" là xong!

