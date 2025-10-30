# Fix Applied - DailyOTP API Integration

## Problem
Lỗi kết nối API: "The selected app brand is invalid."

## Root Cause
Tham số `appBrand` được hardcode sai giá trị:
- ❌ Sai: `google_gmail_youtube`
- ✅ Đúng: `Google / Gmail / Youtube`

## Changes Made

### 1. Fixed `appBrand` Parameter (server.js line 44)
```javascript
// Before (Wrong):
appBrand: 'google_gmail_youtube',

// After (Correct):
appBrand: 'Google / Gmail / Youtube',
```

### 2. Fixed Response Field Names (server.js lines 53-59)
DailyOTP API response structure khác so với dự đoán ban đầu:

```javascript
// API trả về:
{
  "message": "Success",  // not "success: true"
  "data": {
    "transId": "...",      // not "id" or "order_id"
    "phoneNumber": "...",  // not "phone_number"
    "cost": 0.198         // not "price"
  }
}

// Fixed mapping:
requestId: response.data.data.transId,
phone: response.data.data.phoneNumber,
price: response.data.data.cost,
```

### 3. Fixed Check Messages Logic (server.js lines 149-215)
DailyOTP check messages cũng có cấu trúc khác:

```javascript
// API trả về:
{
  "message": "Success",
  "data": {
    "orderStatus": "Waiting message" | "Completed" | "Expired",
    "sms": "Your OTP code..."  // only when Completed
  }
}

// Updated logic:
- Check `orderStatus` instead of array of messages
- Use `transId` parameter instead of `order_id`
- Extract OTP from `orderData.sms` field
```

## How to Verify Fix

### Option 1: Use Web Interface
1. Open http://localhost:3000
2. Select "DailyOTP - Gmail/Google/YouTube (Bangladesh Server 5)"
3. Click "Thuê số"
4. Wait for OTP to appear automatically

### Option 2: Use Test Script
```bash
node test_dailyotp.js
```

### Option 3: Manual API Test
```bash
# Test rent number
curl "http://localhost:3000/api/request" \
  -H "Content-Type: application/json" \
  -d '{"serviceId":"gmail","provider":"dailyotp"}'

# Test check OTP (use transId from above)
curl "http://localhost:3000/api/check?requestId=YOUR_TRANS_ID&provider=dailyotp"
```

## API Documentation Reference

### Available Services in Bangladesh Server 5
```javascript
{
  "serviceId": 3177,
  "appBrand": "Google / Gmail / Youtube",
  "code": "go",
  "country": "Bangladesh",
  "serverName": "Server 5",
  "price": "0.20"
}
```

### Other Available Services
- WhatsApp: "WhatsApp"
- Facebook: "Facebook"
- Instagram: "Instagram"
- Microsoft: "Microsoft / Outlook / Hotmail"
- Discord: "Discord"
- TikTok: "TikTok"
- And more...

## Success Indicators

✅ **Fixed**:
- Server starts without errors
- API request returns valid phone number
- OTP checking works with polling
- Correct status updates (pending → completed)

❌ **Before Fix**:
- Error: "The selected app brand is invalid"
- No phone numbers received
- Unable to check OTP

## Notes

1. **appBrand is case-sensitive** and must include spaces and slashes exactly
2. **transId vs order_id**: DailyOTP uses `transId`, not `order_id`
3. **Session duration**: 20 minutes (from session_start to session_end)
4. **Cost**: Approximately $0.20 per number

## Next Steps

If you want to add more services from DailyOTP:
1. Get available services: `GET /api/services`
2. Find the exact `appBrand` value
3. Add to frontend dropdown
4. Update server.js to pass correct `appBrand`

## Related Files
- `server.js` - Backend API integration
- `public/index.html` - Frontend UI
- `DAILYOTP_INTEGRATION.md` - Full documentation
- `test_dailyotp.js` - Test script

