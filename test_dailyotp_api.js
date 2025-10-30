require('dotenv').config();
const axios = require('axios');

const DAILYOTP_API_KEY = process.env.DAILYOTP_API_KEY;
const DAILYOTP_BASE_URL = 'https://dailyotp.com/api';

console.log('='.repeat(60));
console.log('🧪 DailyOTP API Test Script');
console.log('='.repeat(60));
console.log();

if (!DAILYOTP_API_KEY) {
  console.error('❌ DAILYOTP_API_KEY not found in .env file');
  console.error('💡 Copy config.example.env to .env and add your API key');
  process.exit(1);
}

console.log(`📌 API Key: ${DAILYOTP_API_KEY.slice(0, 10)}...${DAILYOTP_API_KEY.slice(-5)}`);
console.log(`📌 Base URL: ${DAILYOTP_BASE_URL}`);
console.log();

async function testBalance() {
  console.log('📊 Test 1: Get Balance');
  console.log('-'.repeat(60));
  
  try {
    const response = await axios.get(`${DAILYOTP_BASE_URL}/me`, {
      params: { api_key: DAILYOTP_API_KEY },
      timeout: 10000
    });
    
    console.log(`✅ Status: ${response.status}`);
    console.log('📦 Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data && response.data.data) {
      console.log(`💰 Balance: $${response.data.data.balance}`);
      console.log(`🔒 Limit: ${response.data.data.limit}`);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    if (error.response) {
      console.error(`📦 Status: ${error.response.status}`);
      console.error(`📦 Response:`, JSON.stringify(error.response.data, null, 2));
    }
    return false;
  }
}

async function testRentNumber() {
  console.log();
  console.log('📞 Test 2: Rent Number');
  console.log('-'.repeat(60));
  
  try {
    const response = await axios.get(`${DAILYOTP_BASE_URL}/rent-number`, {
      params: {
        appBrand: 'Google / Gmail / Youtube',
        countryCode: 'BD',
        serverName: 'Server 5',
        api_key: DAILYOTP_API_KEY
      },
      timeout: 15000
    });
    
    console.log(`✅ Status: ${response.status}`);
    console.log('📦 Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data && response.data.data) {
      const transId = response.data.data.transId;
      const phoneNumber = response.data.data.phoneNumber;
      const cost = response.data.data.cost;
      
      console.log(`📱 Phone: ${phoneNumber}`);
      console.log(`🆔 Trans ID: ${transId}`);
      console.log(`💵 Cost: $${cost}`);
      
      return transId;
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    if (error.response) {
      console.error(`📦 Status: ${error.response.status}`);
      console.error(`📦 Response:`, JSON.stringify(error.response.data, null, 2));
    }
    return null;
  }
}

async function testGetMessages(transId) {
  console.log();
  console.log('💬 Test 3: Get Messages');
  console.log('-'.repeat(60));
  
  if (!transId) {
    console.log('⚠️ Skipping test (no transId from previous test)');
    return;
  }
  
  try {
    const response = await axios.get(`${DAILYOTP_BASE_URL}/get-messages`, {
      params: {
        transId: transId,
        api_key: DAILYOTP_API_KEY
      },
      timeout: 10000
    });
    
    console.log(`✅ Status: ${response.status}`);
    console.log('📦 Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data && response.data.data) {
      const orderStatus = response.data.data.orderStatus;
      const code = response.data.data.code;
      
      console.log(`📊 Order Status: ${orderStatus}`);
      if (code) {
        console.log(`🔑 OTP Code: ${code}`);
      } else {
        console.log(`⏳ No OTP yet (status: ${orderStatus})`);
      }
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    if (error.response) {
      console.error(`📦 Status: ${error.response.status}`);
      console.error(`📦 Response:`, JSON.stringify(error.response.data, null, 2));
    }
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting tests...');
  console.log();
  
  // Test 1: Balance
  const balanceOk = await testBalance();
  
  if (!balanceOk) {
    console.log();
    console.log('❌ Balance test failed. Check your API key.');
    console.log('💡 Make sure your API key is correct in .env file');
    process.exit(1);
  }
  
  // Test 2: Rent Number
  console.log();
  console.log('⚠️ Test 2 will RENT a real number and charge your account!');
  console.log('💡 Press Ctrl+C to cancel within 5 seconds...');
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const transId = await testRentNumber();
  
  // Test 3: Get Messages (only if we got a transId)
  if (transId) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    await testGetMessages(transId);
  }
  
  console.log();
  console.log('='.repeat(60));
  console.log('✅ All tests completed!');
  console.log('='.repeat(60));
}

runTests().catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});

