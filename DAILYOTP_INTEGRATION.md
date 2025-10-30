# DailyOTP Integration Guide

## Overview
This document describes the integration of DailyOTP API for renting virtual phone numbers from Bangladesh (Server 5) for Google/Gmail/YouTube services.

## API Configuration

### Environment Variable
Add to your `.env` file:
```
DAILYOTP_API_KEY=52f771c0efb2d91c54263723a9ef131fVneDkBm14veGlmzS8BOV
```

### API Endpoints Used

#### 1. Rent Number
- **Endpoint**: `GET https://dailyotp.com/api/rent-number`
- **Parameters**:
  - `appBrand`: `Google / Gmail / Youtube` (exact string with spaces)
  - `countryCode`: `BD` (Bangladesh)
  - `serverName`: `Server 5`
  - `api_key`: Your API key

- **Response Structure**:
```json
{
  "message": "Success",
  "data": {
    "transId": "4353620943",
    "phoneNumber": "8801622334318",
    "country": "Bangladesh",
    "session_start": "2025-10-30 16:16:16",
    "session_end": "2025-10-30 16:36:16",
    "cost": 0.198
  }
}
```

#### 2. Check Messages / Get OTP
- **Endpoint**: `GET https://dailyotp.com/api/get-messages`
- **Parameters**:
  - `transId`: The transaction ID from rent-number response
  - `api_key`: Your API key

- **Response Structure (Waiting)**:
```json
{
  "message": "Success",
  "data": {
    "orderStatus": "Waiting message"
  }
}
```

- **Response Structure (Completed)**:
```json
{
  "message": "Success",
  "data": {
    "code": "425164",
    "message": "G-425164 is your Google verification code. Don't share your code with anyone.",
    "orderStatus": "Success"
  }
}
```

**Important:** 
- `orderStatus` is `"Success"` when OTP received (not "Completed")
- `code` field contains the OTP directly
- `message` field contains the full SMS text

## Implementation Details

### Backend (server.js)

1. **Rent Number Flow**:
   - Client requests with `provider: 'dailyotp'`
   - Server calls DailyOTP rent-number API
   - Returns order ID and phone number to client

2. **Check OTP Flow**:
   - Client polls every 3 seconds
   - Server fetches messages from DailyOTP
   - Extracts OTP code using regex pattern `\b\d{4,8}\b`
   - Returns OTP when found

### Frontend (index.html)

- Service option: `DailyOTP - Gmail/Google/YouTube (Bangladesh Server 5)`
- Service value: `dailyotp-gmail`
- Auto-polling for OTP every 3 seconds
- 10 minute timeout for expired orders

## Features

- ✅ Bangladesh virtual numbers (Server 5)
- ✅ Google/Gmail/YouTube service support
- ✅ Automatic OTP extraction from messages
- ✅ Real-time status updates
- ✅ 10-minute timeout handling

## Usage

1. Select "DailyOTP - Gmail/Google/YouTube (Bangladesh Server 5)" from dropdown
2. Click "Thuê số" (Rent Number)
3. System automatically checks for OTP every 3 seconds
4. OTP displays in table when received

## Notes

- Service is configured for Bangladesh numbers only
- Fixed to Server 5
- App brand fixed to `google_gmail_youtube`
- OTP detection supports 4-8 digit codes
- Messages are checked in chronological order (latest message used)

