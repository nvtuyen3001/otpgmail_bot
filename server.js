require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Admin credentials
const ADMIN_USERNAME = 'nvt3001';
const ADMIN_PASSWORD = 'neyuT@2003';

// Database file path
const DB_FILE = path.join(__dirname, 'phone_data.json');

// Load phone database from file
let phoneDatabase = [];

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      phoneDatabase = JSON.parse(data);
      console.log(`Loaded ${phoneDatabase.length} phone numbers from database`);
    } else {
      phoneDatabase = [];
      console.log('No existing database found, starting fresh');
    }
  } catch (error) {
    console.error('Error loading database:', error.message);
    phoneDatabase = [];
  }
}

function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(phoneDatabase, null, 2), 'utf8');
    console.log(`Saved ${phoneDatabase.length} phone numbers to database`);
  } catch (error) {
    console.error('Error saving database:', error.message);
  }
}

// Load database on startup
loadDatabase();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

console.log('Server started');

// Route: Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({
      success: true,
      message: 'Login successful'
    });
  } else {
    res.json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Route: Get all phone numbers
app.get('/api/admin/phones', (req, res) => {
  res.json({
    success: true,
    phones: phoneDatabase
  });
});

// Route: Add phone number
app.post('/api/admin/phones', (req, res) => {
  const { phone, url } = req.body;
  
  if (!phone || !url) {
    return res.json({
      success: false,
      message: 'Phone and URL required'
    });
  }
  
  const existing = phoneDatabase.find(p => p.phone === phone);
  if (existing) {
    return res.json({
      success: false,
      message: 'Phone number already exists'
    });
  }
  
  const newPhone = {
    id: Date.now().toString(),
    phone,
    url,
    createdAt: new Date().toISOString()
  };
  
  phoneDatabase.push(newPhone);
  saveDatabase();
  
  res.json({
    success: true,
    phone: newPhone
  });
});

// Route: Update phone number
app.put('/api/admin/phones/:id', (req, res) => {
  const { id } = req.params;
  const { phone, url } = req.body;
  
  const index = phoneDatabase.findIndex(p => p.id === id);
  if (index === -1) {
    return res.json({
      success: false,
      message: 'Phone not found'
    });
  }
  
  if (phone) phoneDatabase[index].phone = phone;
  if (url) phoneDatabase[index].url = url;
  phoneDatabase[index].updatedAt = new Date().toISOString();
  saveDatabase();
  
  res.json({
    success: true,
    phone: phoneDatabase[index]
  });
});

// Route: Delete phone number
app.delete('/api/admin/phones/:id', (req, res) => {
  const { id } = req.params;
  
  const index = phoneDatabase.findIndex(p => p.id === id);
  if (index === -1) {
    return res.json({
      success: false,
      message: 'Phone not found'
    });
  }
  
  phoneDatabase.splice(index, 1);
  saveDatabase();
  
  res.json({
    success: true,
    message: 'Phone deleted'
  });
});

// Route: Bulk add phone numbers
app.post('/api/admin/phones/bulk', (req, res) => {
  const { data } = req.body;
  
  if (!data || !Array.isArray(data)) {
    return res.json({
      success: false,
      message: 'Invalid data format'
    });
  }
  
  const added = [];
  const errors = [];
  
  data.forEach(item => {
    const parts = item.split('-');
    if (parts.length < 2) {
      errors.push({ item, error: 'Invalid format' });
      return;
    }
    
    const phone = parts[0].trim();
    const url = parts.slice(1).join('-').trim();
    
    if (!phone || !url) {
      errors.push({ item, error: 'Missing phone or URL' });
      return;
    }
    
    const existing = phoneDatabase.find(p => p.phone === phone);
    if (existing) {
      errors.push({ item, error: 'Phone already exists' });
      return;
    }
    
    const newPhone = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      phone,
      url,
      createdAt: new Date().toISOString()
    };
    
    phoneDatabase.push(newPhone);
    added.push(newPhone);
  });
  
  saveDatabase();
  
  res.json({
    success: true,
    added: added.length,
    errors: errors.length,
    details: { added, errors }
  });
});

// Route: Get OTP from NeyuT by phone number
app.post('/api/fetch-otp', async (req, res) => {
  try {
    const { phones } = req.body;
    
    if (!phones || !Array.isArray(phones) || phones.length === 0) {
      return res.json({
        success: false,
        message: 'Phone numbers required'
      });
    }
    
    const results = [];
    
    for (const phone of phones) {
      const phoneEntry = phoneDatabase.find(p => p.phone === phone);
      
      if (!phoneEntry) {
        results.push({
          phone,
          success: false,
          message: 'Phone not found in database'
        });
        continue;
      }
      
      try {
        const response = await axios.get(phoneEntry.url, {
          timeout: 15000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        const htmlContent = response.data;
        
        // Extract OTP patterns
        const googlePattern = /G-(\d{6})/i;
        let match = htmlContent.match(googlePattern);
        
        if (match && match[1]) {
          results.push({
            phone,
            success: true,
            otp: match[1],
            url: phoneEntry.url
          });
          continue;
        }
        
        const generalPattern = /\b(\d{6})\b/;
        match = htmlContent.match(generalPattern);
        
        if (match && match[1]) {
          results.push({
            phone,
            success: true,
            otp: match[1],
            url: phoneEntry.url
          });
          continue;
        }
        
        const verifyPattern = /(?:verification code|verify code|code|otp)[\s:]*(\d{4,8})/i;
        match = htmlContent.match(verifyPattern);
        
        if (match && match[1]) {
          results.push({
            phone,
            success: true,
            otp: match[1],
            url: phoneEntry.url
          });
          continue;
        }
        
        results.push({
          phone,
          success: false,
          message: 'No OTP found'
        });
        
      } catch (error) {
        results.push({
          phone,
          success: false,
          message: error.message
        });
      }
    }
    
    res.json({
      success: true,
      results
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});

