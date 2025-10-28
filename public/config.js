// Configuration cho Frontend
// Thay đổi API_BASE_URL tùy theo môi trường deploy
// Updated: Toast notifications + continuous rent feature

const CONFIG = {
  // Development (local)
  // API_BASE_URL: 'http://localhost:3000',
  
  // Production (Render.com backend)
  API_BASE_URL: 'https://otpgmail-bot.onrender.com',
  
  // Production (VPS - nếu dùng)
  // API_BASE_URL: 'https://api.yourdomain.com',
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}

