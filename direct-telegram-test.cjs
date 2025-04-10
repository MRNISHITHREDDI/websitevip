// Direct Telegram Bot test using CommonJS
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Log environment variables (without revealing the actual token)
console.log('TELEGRAM_BOT_TOKEN exists:', !!process.env.TELEGRAM_BOT_TOKEN);
console.log('ADMIN_CHAT_IDS:', process.env.ADMIN_CHAT_IDS);

// Parse the admin chat IDs
const adminChatIds = process.env.ADMIN_CHAT_IDS
  ? process.env.ADMIN_CHAT_IDS.split(',').map(id => parseInt(id.trim(), 10))
  : [];

console.log('Parsed admin chat IDs:', adminChatIds);

if (!process.env.TELEGRAM_BOT_TOKEN) {
  console.error('No TELEGRAM_BOT_TOKEN found in environment variables');
  process.exit(1);
}

if (adminChatIds.length === 0) {
  console.error('No admin chat IDs found in environment variables');
  process.exit(1);
}

// Create a new bot instance
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

// Create a test message
const testMessage = `🧪 *Test Message*\n\nThis is a direct test message sent at ${new Date().toISOString()}`;

// Send a message to each admin
console.log('Sending direct test messages...');

for (const chatId of adminChatIds) {
  console.log(`Sending to chat ID: ${chatId}`);
  
  bot.sendMessage(chatId, testMessage, { parse_mode: 'Markdown' })
    .then(msg => {
      console.log(`✓ Message sent successfully to ${chatId}`, msg.message_id);
    })
    .catch(err => {
      console.error(`✗ Failed to send message to ${chatId}:`, err.message);
      console.error('Error details:', JSON.stringify(err, null, 2));
    });
}

console.log('Test messages initiated. Check your Telegram!');