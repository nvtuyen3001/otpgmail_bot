# Debug Guide - DailyOTP OTP Not Showing

## Issue
Mã OTP đã gửi về backend nhưng không hiển thị trên web interface.

## Debug Steps

### 1. Check Browser Console
1. Mở web tại `http://localhost:3000`
2. Nhấn `F12` để mở Developer Tools
3. Chuyển sang tab **Console**
4. Thuê số từ DailyOTP
5. Quan sát logs:

**Logs cần kiểm tra:**
```
[Frontend] Checking OTP for requestId: ...
[Frontend] Full response data: {...}
[Frontend] data.success: true/false
[Frontend] data.otp_code: "123456" or null
[Frontend] data.status: "pending"/"completed"/"expired"
```

### 2. Check Server Logs
Trong terminal chạy server, kiểm tra:
```
[CHECK OTP DAILYOTP] Response: {...}
[CHECK OTP DAILYOTP] ✅ OTP received: 123456
```

### 3. Manual Test Backend API

#### Test rent number:
```bash
curl -X POST http://localhost:3000/api/request \
  -H "Content-Type: application/json" \
  -d "{\"serviceId\":\"gmail\",\"provider\":\"dailyotp\"}"
```

Expected response:
```json
{
  "success": true,
  "requestId": "4353620943",
  "phone": "8801622334318",
  "price": 0.198,
  "provider": "dailyotp"
}
```

#### Test check OTP (replace TRANS_ID):
```bash
curl "http://localhost:3000/api/check?requestId=TRANS_ID&provider=dailyotp"
```

**When waiting:**
```json
{
  "success": true,
  "otp_code": null,
  "status": "pending"
}
```

**When OTP received:**
```json
{
  "success": true,
  "otp_code": "123456",
  "status": "completed",
  "message": "Your verification code is 123456"
}
```

### 4. Common Issues & Fixes

#### Issue 1: Backend returns OTP but frontend doesn't show
**Symptom:** Server log shows OTP but web doesn't update

**Check:**
- Browser console shows `[Frontend] ✅ OTP received: ...`?
- If yes but no display → Frontend update issue
- If no → Check API response format

**Fix:** Đã thêm debug logs và notification

#### Issue 2: `data.success` is undefined
**Symptom:** Console shows `data.success: undefined`

**Possible cause:** Backend error or wrong response format

**Check server response:**
```javascript
// Should be:
{ success: true, otp_code: "123456", status: "completed" }

// Not:
{ message: "Success", data: {...} }  // Wrong format!
```

#### Issue 3: OTP extraction failed
**Symptom:** Backend shows message but no OTP code

**Check:** Regex pattern in server.js line 166:
```javascript
const otpMatch = orderData.sms.match(/\b\d{4,8}\b/);
```

**Test message formats:**
```
"Your verification code is 123456" → ✅ Extracts: 123456
"G-123456 is your code" → ✅ Extracts: 123456
"Code: 12345678" → ✅ Extracts: 12345678
"Your code is one-two-three" → ❌ No match
```

### 5. Quick Fix Test

Reload the page (`Ctrl+F5`) to ensure new JavaScript is loaded with debug logs.

### 6. Direct API Test from Browser

Open browser console and run:
```javascript
// Test check API directly
fetch('http://localhost:3000/api/check?requestId=YOUR_TRANS_ID&provider=dailyotp')
  .then(r => r.json())
  .then(data => console.log('API Response:', data));
```

## Expected Flow

1. **User clicks "Thuê số"**
   - Frontend → POST `/api/request`
   - Backend → DailyOTP rent-number API
   - Response → transId + phone
   - Frontend → Start polling every 3s

2. **Frontend polls for OTP**
   - Frontend → GET `/api/check?requestId=...&provider=dailyotp`
   - Backend → DailyOTP get-messages API
   - Response → `{orderStatus: "Waiting message"}`
   - Frontend → Show "Đang chờ OTP"

3. **OTP arrives**
   - Frontend → GET `/api/check` (same polling)
   - Backend → DailyOTP get-messages API
   - Response → `{orderStatus: "Completed", sms: "Your code is 123456"}`
   - Backend → Extract OTP: `123456`
   - Backend → Return `{success: true, otp_code: "123456", status: "completed"}`
   - Frontend → Update table + Show notification

4. **Frontend displays OTP**
   - Table shows OTP in blue
   - Status: "Hoàn thành"
   - Green notification popup

## If Still Not Working

### Check these points:

1. **Server is running?**
   ```bash
   # Should see:
   🚀 Server đang chạy tại http://localhost:3000
   ```

2. **API key is correct?**
   - Check `.env` file has `DAILYOTP_API_KEY=...`

3. **Network errors?**
   - Browser Network tab → Check API calls return 200

4. **CORS issues?**
   - Should not happen (server has `cors()` middleware)

5. **Interval not running?**
   ```javascript
   // Check in console:
   console.log('Active intervals:', Object.keys(checkIntervals));
   ```

## What I Added

1. **Debug logs** in frontend (lines 388-392)
2. **Success notification** when OTP received (line 404)
3. **Unexpected response warning** (line 423)

These will help identify exactly where the issue is!

