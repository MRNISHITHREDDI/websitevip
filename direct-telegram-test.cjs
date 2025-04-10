/**
 * Direct Telegram API Test Script
 * 
 * This script is used to verify your Telegram bot token and admin chat IDs
 * without using the node-telegram-bot-api library. It makes direct HTTPS
 * requests to the Telegram API, which is helpful for diagnosing issues
 * in various deployment environments.
 * 
 * Usage:
 * 1. node direct-telegram-test.cjs <BOT_TOKEN> <CHAT_ID>
 * 
 * For example:
 * node direct-telegram-test.cjs 1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZ 123456789
 */

const https = require('https');

// Get command line arguments
const botToken = process.argv[2];
const chatId = process.argv[3];

if (!botToken || !chatId) {
  console.error('❌ Error: Missing required arguments');
  console.log('Usage: node direct-telegram-test.cjs <BOT_TOKEN> <CHAT_ID>');
  process.exit(1);
}

console.log('🔍 Testing Telegram API with:');
console.log(`🤖 Bot Token: ${botToken.substring(0, 5)}...${botToken.substring(botToken.length - 5)}`);
console.log(`👤 Chat ID: ${chatId}`);
console.log('\n📡 Sending test message...');

// Create test message with timestamp
const message = `🧪 Test message from direct API test script\n\nTimestamp: ${new Date().toISOString()}\n\nIf you're seeing this message, your Telegram bot token and chat ID are correctly configured!`;

// Prepare the request body
const requestBody = JSON.stringify({
  chat_id: chatId,
  text: message,
  parse_mode: 'Markdown'
});

// Set up the request options
const requestOptions = {
  hostname: 'api.telegram.org',
  port: 443,
  path: `/bot${botToken}/sendMessage`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(requestBody)
  }
};

// Make the request
const req = https.request(requestOptions, (res) => {
  console.log(`\n📊 Status Code: ${res.statusCode}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('\n📄 Response:');
      console.log(JSON.stringify(response, null, 2));
      
      if (response.ok) {
        console.log('\n✅ SUCCESS: Message sent successfully!');
        console.log('📱 Check your Telegram app to confirm you received the message.');
      } else {
        console.error('\n❌ ERROR: Failed to send message');
        console.error(`📝 Reason: ${response.description}`);
        
        // Common error handling
        if (response.description.includes('bot was blocked')) {
          console.log('\n💡 TIP: Make sure you have started a conversation with the bot using /start');
        } else if (response.description.includes('chat not found')) {
          console.log('\n💡 TIP: Check that the chat ID is correct');
        } else if (response.description.includes('Unauthorized')) {
          console.log('\n💡 TIP: Check that the bot token is correct');
        }
      }
    } catch (error) {
      console.error('\n❌ Error parsing Telegram response:', error);
    }
  });
});

req.on('error', (error) => {
  console.error('\n❌ HTTPS request error:', error);
});

// Send the request
req.write(requestBody);
req.end();

console.log('⏳ Waiting for response...');