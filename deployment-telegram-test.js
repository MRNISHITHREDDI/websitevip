/**
 * Deployment Telegram Bot Test Script
 * 
 * This script tests the telegram bot functionality in deployment environments.
 * It uses direct API calls to send messages and doesn't rely on the node-telegram-bot-api library.
 * 
 * Run with: node deployment-telegram-test.js
 */

require('dotenv').config();
const https = require('https');

// Get environment variables
const token = process.env.TELEGRAM_BOT_TOKEN;
const adminChatIdsStr = process.env.ADMIN_CHAT_IDS || '';
const adminChatIds = adminChatIdsStr.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));

if (!token) {
  console.error('❌ TELEGRAM_BOT_TOKEN is not set. Please set it in your environment variables.');
  process.exit(1);
}

if (adminChatIds.length === 0) {
  console.error('❌ ADMIN_CHAT_IDS is not set or invalid. Please set it in your environment variables.');
  process.exit(1);
}

console.log('📋 Configuration:');
console.log(`Token: ${token.substring(0, 5)}...${token.substring(token.length - 5)}`);
console.log(`Admin Chat IDs: ${adminChatIds.join(', ')}`);

/**
 * Send a message using direct HTTPS request to Telegram API
 */
async function sendDirectApiMessage(chatId, text, options = {}) {
  return new Promise((resolve) => {
    try {
      console.log(`\n📤 Sending message to ${chatId}:`);
      console.log(text);
      console.log('Options:', JSON.stringify(options, null, 2));
      
      // Prepare the request body
      const requestBody = JSON.stringify({
        chat_id: chatId,
        text: text,
        ...options
      });
      
      // Set up the request options
      const requestOptions = {
        hostname: 'api.telegram.org',
        port: 443,
        path: `/bot${token}/sendMessage`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBody)
        }
      };
      
      console.log(`📡 API Endpoint: https://api.telegram.org/bot${token.substring(0, 5)}...${token.substring(token.length - 5)}/sendMessage`);
      
      // Make the request
      const req = https.request(requestOptions, (res) => {
        console.log(`📊 Response Status: ${res.statusCode}`);
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            console.log(`📥 Raw Response: ${data}`);
            const response = JSON.parse(data);
            if (response.ok) {
              console.log('✅ Message sent successfully!');
              console.log(`📱 Message ID: ${response.result.message_id}`);
              resolve(true);
            } else {
              console.error(`❌ Telegram API error: ${response.description}`);
              resolve(false);
            }
          } catch (error) {
            console.error('❌ Error parsing Telegram response:', error);
            resolve(false);
          }
        });
      });
      
      req.on('error', (error) => {
        console.error('❌ HTTPS request error:', error);
        resolve(false);
      });
      
      // Send the request
      req.write(requestBody);
      req.end();
      
    } catch (error) {
      console.error('❌ Exception in direct API method:', error);
      resolve(false);
    }
  });
}

// Test 1: Simple plain text message
async function testPlainMessage() {
  console.log('\n🧪 TEST 1: Simple Plain Text Message');
  for (const chatId of adminChatIds) {
    await sendDirectApiMessage(
      chatId,
      `🤖 Test message from deployment-telegram-test.js\n\nThis is a simple plain text message without any formatting or buttons.\n\nTimestamp: ${new Date().toISOString()}`
    );
  }
}

// Test 2: Message with Markdown formatting
async function testMarkdownMessage() {
  console.log('\n🧪 TEST 2: Message with Markdown Formatting');
  for (const chatId of adminChatIds) {
    await sendDirectApiMessage(
      chatId,
      `*Bold Text* _Italic Text_ [Link](https://example.com) \`Code\`\n\nThis is a test of Markdown formatting.\n\nTimestamp: ${new Date().toISOString()}`,
      { parse_mode: 'Markdown' }
    );
  }
}

// Test 3: Message with inline keyboard (buttons)
async function testInlineKeyboard() {
  console.log('\n🧪 TEST 3: Message with Inline Keyboard (Buttons)');
  
  const inlineKeyboard = {
    inline_keyboard: [
      [
        {
          text: "✅ Test Button 1",
          callback_data: "test_button_1"
        }
      ],
      [
        {
          text: "❌ Test Button 2",
          callback_data: "test_button_2"
        }
      ]
    ]
  };
  
  for (const chatId of adminChatIds) {
    await sendDirectApiMessage(
      chatId,
      `This message has inline buttons.\n\nThese buttons use callback_data which should trigger a callback when clicked.\n\nTimestamp: ${new Date().toISOString()}`,
      { reply_markup: inlineKeyboard }
    );
  }
}

// Test 4: Message simulating a notification with buttons (realistic scenario)
async function testVerificationNotification() {
  console.log('\n🧪 TEST 4: Verification Notification with Buttons');
  
  const safeUserId = "test_user_123".replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
  
  const message = `🚨 NEW VERIFICATION REQUEST 🚨

ID: 9999
User: ${safeUserId}
Status: pending
Time: ${new Date().toLocaleString()}

Instructions:
- Review the user ID
- Use the buttons below for approval/rejection`;
  
  const inlineKeyboard = {
    inline_keyboard: [
      [
        {
          text: "✅ Approve",
          callback_data: "approve_9999"
        }
      ],
      [
        {
          text: "❌ Reject",
          callback_data: "reject_9999"
        }
      ]
    ]
  };
  
  for (const chatId of adminChatIds) {
    await sendDirectApiMessage(
      chatId,
      message,
      { 
        parse_mode: 'Markdown',
        reply_markup: inlineKeyboard
      }
    );
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Telegram API Tests...');
  
  await testPlainMessage();
  await testMarkdownMessage();
  await testInlineKeyboard();
  await testVerificationNotification();
  
  console.log('\n✅ All tests completed! Check your Telegram for messages.');
}

// Start the tests
runAllTests();