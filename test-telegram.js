// Test Telegram Notification
import { notifyNewVerification } from './server/telegram-bot.js';

// Create a test verification
const testVerification = {
  id: 999,
  jalwaUserId: 'TEST_USER_ID_' + Date.now(),
  status: 'pending',
  notes: 'Test notification',
  createdAt: new Date(),
  updatedAt: new Date()
};

console.log('Sending test notification to Telegram...');
console.log('Test verification:', testVerification);

// Send notification
notifyNewVerification(testVerification);

console.log('Notification process initiated. Check your Telegram bot!');