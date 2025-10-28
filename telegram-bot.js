require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// ========== CẤU HÌNH ==========
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const VIOTP_TOKEN = process.env.VIOTP_TOKEN;
const VIOTP_BASE_URL = 'https://api.viotp.com';

// Kiểm tra token có tồn tại không
if (!TELEGRAM_BOT_TOKEN || !VIOTP_TOKEN) {
  console.error('❌ Lỗi: Thiếu tokens! Vui lòng tạo file .env và thêm tokens.');
  console.error('💡 Copy file config.example.env thành .env và điền token thật.');
  process.exit(1);
}

// Thời gian kiểm tra (mỗi 30 giây)
const CHECK_INTERVAL = 30000;

// Chat IDs được phép (thêm chat_id của bạn vào đây)
const ALLOWED_CHAT_IDS = []; // Để trống = cho phép tất cả

// ========== BOT TELEGRAM ==========
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Danh sách người đăng ký nhận thông báo
let subscribers = new Set();

console.log('🤖 Telegram Bot đã khởi động!');

// ========== COMMANDS ==========

// /start - Bắt đầu
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `
🤖 *Bot Thông Báo VIOTP Gmail*

Xin chào! Tôi sẽ thông báo khi VIOTP có số Gmail (Vinaphone) sẵn sàng.

📋 *Các lệnh:*
/subscribe - Đăng ký nhận thông báo
/unsubscribe - Hủy đăng ký
/check - Kiểm tra ngay
/status - Xem trạng thái
/balance - Xem số dư VIOTP
/help - Trợ giúp
  `;
  
  bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
});

// /help - Trợ giúp
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpMessage = `
📚 *Hướng dẫn sử dụng*

/subscribe - Đăng ký nhận thông báo tự động
/unsubscribe - Hủy đăng ký thông báo
/check - Kiểm tra số Gmail có sẵn ngay
/status - Xem trạng thái bot và số người đăng ký
/balance - Xem số dư tài khoản VIOTP
/help - Hiển thị menu này

Bot sẽ tự động kiểm tra mỗi 30 giây và thông báo cho các thành viên đã đăng ký khi có số Gmail (Vinaphone) sẵn sàng.
  `;
  
  bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
});

// /subscribe - Đăng ký nhận thông báo
bot.onText(/\/subscribe/, (msg) => {
  const chatId = msg.chat.id;
  
  if (ALLOWED_CHAT_IDS.length > 0 && !ALLOWED_CHAT_IDS.includes(chatId)) {
    bot.sendMessage(chatId, '❌ Bạn không có quyền sử dụng bot này.');
    return;
  }
  
  subscribers.add(chatId);
  bot.sendMessage(chatId, '✅ Đã đăng ký! Bạn sẽ nhận thông báo khi có số Gmail sẵn sàng.', {
    reply_markup: {
      keyboard: [['/check', '/unsubscribe'], ['/status', '/balance']],
      resize_keyboard: true
    }
  });
  
  console.log(`✅ New subscriber: ${chatId} (Total: ${subscribers.size})`);
});

// /unsubscribe - Hủy đăng ký
bot.onText(/\/unsubscribe/, (msg) => {
  const chatId = msg.chat.id;
  
  if (subscribers.has(chatId)) {
    subscribers.delete(chatId);
    bot.sendMessage(chatId, '❌ Đã hủy đăng ký. Bạn sẽ không còn nhận thông báo.', {
      reply_markup: {
        remove_keyboard: true
      }
    });
    console.log(`❌ Unsubscribed: ${chatId} (Total: ${subscribers.size})`);
  } else {
    bot.sendMessage(chatId, '⚠️ Bạn chưa đăng ký.');
  }
});

// /check - Kiểm tra thủ công
bot.onText(/\/check/, async (msg) => {
  const chatId = msg.chat.id;
  
  bot.sendMessage(chatId, '🔍 Đang kiểm tra...');
  
  const available = await checkGmailAvailability();
  
  if (available) {
    bot.sendMessage(chatId, '✅ *Có số Gmail sẵn sàng!*\n\nVào web để thuê ngay: http://localhost:3000', {
      parse_mode: 'Markdown'
    });
  } else {
    bot.sendMessage(chatId, '⏳ Hiện tại chưa có số Gmail. Bot sẽ tự động thông báo khi có.');
  }
});

// /status - Trạng thái
bot.onText(/\/status/, (msg) => {
  const chatId = msg.chat.id;
  
  const statusMessage = `
📊 *Trạng thái Bot*

🤖 Bot: Đang hoạt động
👥 Người đăng ký: ${subscribers.size}
⏱ Kiểm tra mỗi: 30 giây
🌐 Service: VIOTP Gmail (Vinaphone)
  `;
  
  bot.sendMessage(chatId, statusMessage, { parse_mode: 'Markdown' });
});

// /balance - Kiểm tra số dư
bot.onText(/\/balance/, async (msg) => {
  const chatId = msg.chat.id;
  
  try {
    const response = await axios.get(`${VIOTP_BASE_URL}/users/balance`, {
      params: { token: VIOTP_TOKEN }
    });
    
    if (response.data && response.data.status_code === 200) {
      const balance = response.data.data.balance;
      bot.sendMessage(chatId, `💰 *Số dư VIOTP:* ${balance.toLocaleString('vi-VN')} VNĐ`, {
        parse_mode: 'Markdown'
      });
    } else {
      bot.sendMessage(chatId, '❌ Không thể lấy số dư.');
    }
  } catch (error) {
    bot.sendMessage(chatId, '❌ Lỗi khi lấy số dư: ' + error.message);
  }
});

// ========== HÀM KIỂM TRA ==========

async function checkGmailAvailability() {
  try {
    // Thử request số Gmail
    const response = await axios.get(`${VIOTP_BASE_URL}/request/getv2`, {
      params: {
        token: VIOTP_TOKEN,
        serviceId: 3, // Gmail
        network: 'VINAPHONE'
      }
    });
    
    console.log(`[CHECK] Response status: ${response.data.status_code}`);
    
    // Nếu status_code = 200 nghĩa là có số
    if (response.data && response.data.status_code === 200) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('[CHECK] Error:', error.response?.data?.message || error.message);
    return false;
  }
}

// ========== AUTO CHECK ==========

let lastAvailableState = false;

async function autoCheck() {
  console.log(`[AUTO CHECK] Checking... (Subscribers: ${subscribers.size})`);
  
  const available = await checkGmailAvailability();
  
  // Nếu trước đó không có, bây giờ có → gửi thông báo
  if (available && !lastAvailableState && subscribers.size > 0) {
    console.log('🎉 Gmail available! Notifying subscribers...');
    
    const message = `
🎉 *VIOTP CÓ SỐ GMAIL!*

Số Vinaphone sẵn sàng để thuê Gmail/Google.

👉 Vào web ngay: http://localhost:3000
⚡️ Nhanh tay kẻo hết!
    `;
    
    // Gửi cho tất cả subscribers
    for (const chatId of subscribers) {
      try {
        await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
      } catch (error) {
        console.error(`Failed to send to ${chatId}:`, error.message);
      }
    }
  }
  
  lastAvailableState = available;
}

// Chạy auto check mỗi 30 giây
setInterval(autoCheck, CHECK_INTERVAL);

// Check ngay khi khởi động
setTimeout(autoCheck, 5000);

console.log('✅ Bot đã sẵn sàng! Kiểm tra mỗi 30 giây...');
console.log('💡 Gửi /start cho bot để bắt đầu.');

