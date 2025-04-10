import TelegramBot from 'node-telegram-bot-api';
import { storage } from './storage';
import dotenv from 'dotenv';
import * as https from 'https';

// Load environment variables
dotenv.config();

// Initialize the bot with the token from environment variables
const token = process.env.TELEGRAM_BOT_TOKEN;
let bot: TelegramBot | null = null;

// List of authorized admin chat IDs (for security)
let AUTHORIZED_CHAT_IDS = process.env.ADMIN_CHAT_IDS 
  ? process.env.ADMIN_CHAT_IDS.split(',').map(id => parseInt(id.trim(), 10))
  : [];

// Check if a chat is authorized
function isAuthorized(chatId: number): boolean {
  return AUTHORIZED_CHAT_IDS.includes(chatId);
}

// Safe wrapper for bot.sendMessage that checks if bot exists
function safeSendMessage(chatId: number, message: string, options?: any): void {
  if (!bot) {
    console.error('Cannot send message: bot is null');
    return;
  }
  
  bot.sendMessage(chatId, message, options)
    .catch(err => console.error(`Error sending message to ${chatId}:`, err));
}

// Handle errors in a friendly way
function handleError(chatId: number, error: any): void {
  console.error('Telegram bot error:', error);
  safeSendMessage(
    chatId,
    '❌ An error occurred while processing your request. Please try again later.'
  );
}

// Format an account verification for display
function formatVerification(verification: any): string {
  const statusEmojiMap: Record<string, string> = {
    pending: '⏳',
    approved: '✅',
    rejected: '❌'
  };
  const statusEmoji = statusEmojiMap[verification.status] || '❓';
  
  const createdDate = new Date(verification.createdAt).toLocaleString();
  const updatedDate = new Date(verification.updatedAt).toLocaleString();
  
  return `${statusEmoji} *User ID:* ${verification.jalwaUserId}
*Status:* ${verification.status.toUpperCase()}
*Created:* ${createdDate}
*Updated:* ${updatedDate}
${verification.notes ? `*Notes:* ${verification.notes}` : ''}
*ID:* ${verification.id}`;
}

// Initialize the bot with commands
export function initBot(): void {
  // Don't initialize if the token is missing
  if (!token) {
    console.warn('TELEGRAM_BOT_TOKEN is not set. Telegram bot will not be started.');
    return;
  }
  
  console.log('Starting Telegram bot...');
  console.log('Admin chat IDs configured:', AUTHORIZED_CHAT_IDS);
  console.log('ADMIN_CHAT_IDS env value:', process.env.ADMIN_CHAT_IDS);
  
  try {
    // Create a bot instance
    bot = new TelegramBot(token, { polling: true });
    
    // Register error event handler
    bot.on('polling_error', (error) => {
      console.error('Telegram polling error:', error);
    });
    
    bot.on('error', (error) => {
      console.error('Telegram general error:', error);
    });
    
    // Set up command handlers
    setupCommandHandlers();
    
    console.log('Telegram bot initialization successful!');
    console.log('Bot is polling:', bot.isPolling());
    
    // Send test messages to admins
    for (const chatId of AUTHORIZED_CHAT_IDS) {
      try {
        console.log(`Sending test message to admin ${chatId}...`);
        safeSendMessage(chatId, '🤖 Jalwa Admin Bot started successfully!');
        console.log(`Test message initiated for admin ${chatId}`);
      } catch (error) {
        console.error(`Error sending test message to admin ${chatId}:`, error);
      }
    }
    
    console.log('Telegram bot started!');
  } catch (error) {
    console.error('Failed to initialize Telegram bot:', error);
    bot = null;
  }
}

function setupCommandHandlers(): void {
  if (!bot) return;
  
  // Handle callback queries from inline buttons
  bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message?.chat.id;
    
    if (!chatId || !isAuthorized(chatId)) {
      return;
    }
    
    const callbackData = callbackQuery.data;
    
    if (!callbackData) {
      return;
    }
    
    // The callback data is in the format: action_id (e.g., approve_123, reject_456)
    const [action, idStr] = callbackData.split('_');
    const id = parseInt(idStr, 10);
    
    if (isNaN(id)) {
      bot.answerCallbackQuery(callbackQuery.id, { text: '❌ Invalid verification ID' });
      return;
    }
    
    try {
      // Get the verification first to check if it exists
      const verification = await storage.getAccountVerification(id);
      
      if (!verification) {
        bot.answerCallbackQuery(callbackQuery.id, { text: `❌ Verification ID ${id} not found` });
        return;
      }
      
      let status: string;
      let notes: string;
      let responseText: string;
      
      if (action === 'approve') {
        status = 'approved';
        notes = 'Approved via Telegram bot inline button';
        responseText = `✅ Approved User ${verification.jalwaUserId}`;
      } else if (action === 'reject') {
        status = 'rejected';
        notes = 'Rejected via Telegram bot inline button';
        responseText = `❌ Rejected User ${verification.jalwaUserId}`;
      } else {
        bot.answerCallbackQuery(callbackQuery.id, { text: '❌ Invalid action' });
        return;
      }
      
      // Update the verification status
      const updated = await storage.updateAccountVerificationStatus(id, status, notes);
      
      if (!updated) {
        bot.answerCallbackQuery(callbackQuery.id, { 
          text: `❌ Failed to ${action} verification ID ${id}`,
          show_alert: true
        });
        return;
      }
      
      // Answer the callback query
      bot.answerCallbackQuery(callbackQuery.id, {
        text: `✅ Successfully ${status} verification ID ${id}`,
        show_alert: true
      });
      
      // Update original message to show it's been processed
      const messageId = callbackQuery.message?.message_id;
      if (messageId) {
        const originalText = callbackQuery.message?.text || '';
        const newText = `${originalText}\n\n✅ PROCESSED: ${status.toUpperCase()} by ${callbackQuery.from.first_name || 'Admin'}`;
        
        bot.editMessageText(newText, {
          chat_id: chatId,
          message_id: messageId
        });
      }
      
      // Send a confirmation message
      safeSendMessage(
        chatId,
        `${responseText}\n\nUser ID: ${updated.jalwaUserId}\nStatus: ${updated.status.toUpperCase()}\nProcessed by: ${callbackQuery.from.first_name || 'Admin'}`
      );
      
    } catch (error) {
      console.error('Error handling callback query:', error);
      bot.answerCallbackQuery(callbackQuery.id, {
        text: 'An error occurred while processing your request.',
        show_alert: true
      });
    }
  });
  
  // Start command - introduction and authorization check
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    
    if (!isAuthorized(chatId)) {
      safeSendMessage(
        chatId,
        '🔒 You are not authorized to use this bot. Please contact the administrator.'
      );
      return;
    }
    
    safeSendMessage(
      chatId,
      '👋 *Welcome to the Jalwa Account Admin Bot!*\n\nUse this bot to manage user verifications.\n\n*Available commands:*\n/list - List all verifications\n/pending - Show pending verifications\n/approved - Show approved verifications\n/rejected - Show rejected verifications\n/approve [id] - Approve a verification\n/reject [id] - Reject a verification\n/info [id] - Show details about a verification\n/stats - Show verification statistics\n/addadmin [chat_id] - Add a new admin chat ID\n/admins - List all admin chat IDs\n/help - Show this help message',
      { parse_mode: 'Markdown' }
    );
  });
  
  // Help command
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    
    if (!isAuthorized(chatId)) return;
    
    safeSendMessage(
      chatId,
      '*Available commands:*\n\n/list - List all verifications\n/pending - Show pending verifications\n/approved - Show approved verifications\n/rejected - Show rejected verifications\n/approve [id] - Approve a verification\n/reject [id] [reason] - Reject a verification\n/info [id] - Show details about a verification\n/stats - Show verification statistics\n/addadmin [chat_id] - Add a new admin chat ID\n/admins - List all admin chat IDs\n/help - Show this help message',
      { parse_mode: 'Markdown' }
    );
  });
  
  // List all verifications
  bot.onText(/\/list/, async (msg) => {
    const chatId = msg.chat.id;
    
    if (!isAuthorized(chatId)) return;
    if (!bot) return;
    
    try {
      const verifications = await storage.getAllAccountVerifications();
      
      if (verifications.length === 0) {
        safeSendMessage(chatId, 'No account verifications found.');
        return;
      }
      
      const message = `📋 *All Account Verifications (${verifications.length})*\n\n` +
        verifications.map(v => {
          const statusEmoji = {
            pending: '⏳',
            approved: '✅',
            rejected: '❌'
          }[v.status] || '❓';
          
          return `${statusEmoji} ID ${v.id}: ${v.jalwaUserId} (${v.status})`;
        }).join('\n');
      
      safeSendMessage(chatId, message, { parse_mode: 'Markdown' });
    } catch (error) {
      handleError(chatId, error);
    }
  });
  
  // List pending verifications
  bot.onText(/\/pending/, async (msg) => {
    const chatId = msg.chat.id;
    
    if (!isAuthorized(chatId)) return;
    if (!bot) return;
    
    try {
      const verifications = await storage.getAccountVerificationsByStatus('pending');
      
      if (verifications.length === 0) {
        safeSendMessage(chatId, '✅ No pending verifications.');
        return;
      }
      
      const message = `⏳ *Pending Verifications (${verifications.length})*\n\n` +
        verifications.map(v => `ID ${v.id}: ${v.jalwaUserId}`).join('\n');
      
      safeSendMessage(chatId, message, { parse_mode: 'Markdown' });
    } catch (error) {
      handleError(chatId, error);
    }
  });
  
  // List approved verifications
  bot.onText(/\/approved/, async (msg) => {
    const chatId = msg.chat.id;
    
    if (!isAuthorized(chatId)) return;
    if (!bot) return;
    
    try {
      const verifications = await storage.getAccountVerificationsByStatus('approved');
      
      if (verifications.length === 0) {
        safeSendMessage(chatId, 'No approved verifications.');
        return;
      }
      
      const message = `✅ *Approved Verifications (${verifications.length})*\n\n` +
        verifications.map(v => `ID ${v.id}: ${v.jalwaUserId}`).join('\n');
      
      safeSendMessage(chatId, message, { parse_mode: 'Markdown' });
    } catch (error) {
      handleError(chatId, error);
    }
  });
  
  // List rejected verifications
  bot.onText(/\/rejected/, async (msg) => {
    const chatId = msg.chat.id;
    
    if (!isAuthorized(chatId)) return;
    if (!bot) return;
    
    try {
      const verifications = await storage.getAccountVerificationsByStatus('rejected');
      
      if (verifications.length === 0) {
        safeSendMessage(chatId, 'No rejected verifications.');
        return;
      }
      
      const message = `❌ *Rejected Verifications (${verifications.length})*\n\n` +
        verifications.map(v => `ID ${v.id}: ${v.jalwaUserId}`).join('\n');
      
      safeSendMessage(chatId, message, { parse_mode: 'Markdown' });
    } catch (error) {
      handleError(chatId, error);
    }
  });
  
  // Approve a verification
  bot.onText(/\/approve\s+(\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    
    if (!isAuthorized(chatId)) return;
    if (!bot) return;
    
    if (!match || !match[1]) {
      safeSendMessage(chatId, 'Please provide a verification ID: /approve [id]');
      return;
    }
    
    const id = parseInt(match[1], 10);
    
    try {
      // Get the verification first to check if it exists
      const verification = await storage.getAccountVerification(id);
      
      if (!verification) {
        safeSendMessage(chatId, `❌ Verification with ID ${id} not found.`);
        return;
      }
      
      // Update the verification status
      const updated = await storage.updateAccountVerificationStatus(
        id,
        'approved',
        'Approved via Telegram bot'
      );
      
      if (!updated) {
        safeSendMessage(chatId, `❌ Failed to approve verification with ID ${id}.`);
        return;
      }
      
      safeSendMessage(
        chatId,
        `✅ Successfully approved User ID: ${updated.jalwaUserId}`,
        { parse_mode: 'Markdown' }
      );
    } catch (error) {
      handleError(chatId, error);
    }
  });
  
  // Reject a verification
  bot.onText(/\/reject\s+(\d+)(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    
    if (!isAuthorized(chatId)) return;
    if (!bot) return;
    
    if (!match || !match[1]) {
      safeSendMessage(chatId, 'Please provide a verification ID: /reject [id] [reason]');
      return;
    }
    
    const id = parseInt(match[1], 10);
    const reason = match[2] ? match[2].trim() : 'Rejected via Telegram bot';
    
    try {
      // Get the verification first to check if it exists
      const verification = await storage.getAccountVerification(id);
      
      if (!verification) {
        safeSendMessage(chatId, `❌ Verification with ID ${id} not found.`);
        return;
      }
      
      // Update the verification status
      const updated = await storage.updateAccountVerificationStatus(
        id,
        'rejected',
        reason
      );
      
      if (!updated) {
        safeSendMessage(chatId, `❌ Failed to reject verification with ID ${id}.`);
        return;
      }
      
      safeSendMessage(
        chatId,
        `❌ Rejected User ID: ${updated.jalwaUserId}\nReason: ${reason}`,
        { parse_mode: 'Markdown' }
      );
    } catch (error) {
      handleError(chatId, error);
    }
  });
  
  // Get information about a verification
  bot.onText(/\/info\s+(\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    
    if (!isAuthorized(chatId)) return;
    if (!bot) return;
    
    if (!match || !match[1]) {
      safeSendMessage(chatId, 'Please provide a verification ID: /info [id]');
      return;
    }
    
    const id = parseInt(match[1], 10);
    
    try {
      const verification = await storage.getAccountVerification(id);
      
      if (!verification) {
        safeSendMessage(chatId, `❌ Verification with ID ${id} not found.`);
        return;
      }
      
      safeSendMessage(
        chatId,
        `ℹ️ *Verification Details*\n\n${formatVerification(verification)}`,
        { parse_mode: 'Markdown' }
      );
    } catch (error) {
      handleError(chatId, error);
    }
  });
  
  // Get verification statistics
  bot.onText(/\/stats/, async (msg) => {
    const chatId = msg.chat.id;
    
    if (!isAuthorized(chatId)) return;
    
    try {
      const all = await storage.getAllAccountVerifications();
      const pending = await storage.getAccountVerificationsByStatus('pending');
      const approved = await storage.getAccountVerificationsByStatus('approved');
      const rejected = await storage.getAccountVerificationsByStatus('rejected');
      
      safeSendMessage(
        chatId,
        `📊 *Verification Statistics*\n\n` +
        `Total: ${all.length}\n` +
        `⏳ Pending: ${pending.length}\n` +
        `✅ Approved: ${approved.length}\n` +
        `❌ Rejected: ${rejected.length}`,
        { parse_mode: 'Markdown' }
      );
    } catch (error) {
      handleError(chatId, error);
    }
  });
  
  // Add a new admin chat ID
  bot.onText(/\/addadmin\s+(\d+)/, (msg, match) => {
    const chatId = msg.chat.id;
    
    if (!isAuthorized(chatId)) return;
    
    if (!match || !match[1]) {
      safeSendMessage(chatId, 'Please provide a chat ID: /addadmin [chat_id]');
      return;
    }
    
    try {
      const newAdminChatId = parseInt(match[1], 10);
      
      // Check if the chat ID is already an admin
      if (AUTHORIZED_CHAT_IDS.includes(newAdminChatId)) {
        safeSendMessage(chatId, `❌ Chat ID ${newAdminChatId} is already an admin.`);
        return;
      }
      
      // Add the new admin chat ID to the list
      AUTHORIZED_CHAT_IDS.push(newAdminChatId);
      
      // Notify the current admin
      safeSendMessage(
        chatId,
        `✅ Successfully added Chat ID ${newAdminChatId} as an admin.`,
        { parse_mode: 'Markdown' }
      );
      
      // Notify the new admin
      safeSendMessage(
        newAdminChatId,
        `🔔 *Welcome Admin!*\n\nYou have been added as an admin by Chat ID ${chatId}. Use /help to see available commands.`,
        { parse_mode: 'Markdown' }
      );
      
      console.log(`Added new admin with chat ID: ${newAdminChatId}`);
    } catch (error) {
      handleError(chatId, error);
    }
  });
  
  // List all admin chat IDs
  bot.onText(/\/admins/, (msg) => {
    const chatId = msg.chat.id;
    
    if (!isAuthorized(chatId)) return;
    
    try {
      const message = `👑 *Admin Chat IDs (${AUTHORIZED_CHAT_IDS.length})*\n\n` +
        AUTHORIZED_CHAT_IDS.map((id, index) => `${index + 1}. ${id}`).join('\n');
      
      safeSendMessage(chatId, message, { parse_mode: 'Markdown' });
    } catch (error) {
      handleError(chatId, error);
    }
  });
  
  // Handle new verifications - send notifications for new pending verifications
  bot.on('new_verification', async (verification: any) => {
    if (!bot) return;
    
    // Send notification to all authorized admins
    for (const chatId of AUTHORIZED_CHAT_IDS) {
      safeSendMessage(
        chatId,
        `🔔 *New Verification Request*\n\n${formatVerification(verification)}\n\nUse /approve ${verification.id} to approve or /reject ${verification.id} to reject.`,
        { parse_mode: 'Markdown' }
      );
    }
  });
}

// Stop the bot
export function stopBot(): void {
  if (bot) {
    bot.stopPolling();
    bot = null;
    console.log('Telegram bot stopped.');
  }
}

// Export the bot for external notifications
export function getBot(): TelegramBot | null {
  return bot;
}

// Send notification to admins about a new verification with inline buttons for approve/reject
export function notifyNewVerification(verification: any): void {
  console.log('🚨 NEW VERIFICATION ALERT: Received ID:', verification.id);
  
  // Get token from environment 
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.error('⛔ NOTIFICATION ERROR: Missing Telegram bot token');
    return;
  }
  
  // Get admin chat IDs directly from environment variable
  const adminChatIdsStr = process.env.ADMIN_CHAT_IDS;
  if (!adminChatIdsStr) {
    console.error('⛔ NOTIFICATION ERROR: Missing admin chat IDs');
    return;
  }
  
  const adminChatIds = adminChatIdsStr
    .split(',')
    .map(id => parseInt(id.trim(), 10))
    .filter(id => !isNaN(id));
  
  if (adminChatIds.length === 0) {
    console.error('⛔ NOTIFICATION ERROR: No valid admin chat IDs found in:', adminChatIdsStr);
    return;
  }
  
  console.log('📨 SENDING NOTIFICATIONS: Admin IDs:', adminChatIds.join(', '));
  
  // Format in plain text (no special formatting that could cause issues)
  const message = `🚨 NEW VERIFICATION REQUEST 🚨
ID: ${verification.id}
User: ${verification.jalwaUserId}
Status: ${verification.status}
Created: ${new Date().toLocaleString()}`;

  // 1. Use fetch API with inline keyboard buttons for direct Telegram API access
  const sendDirectNotifications = async () => {
    for (const chatId of adminChatIds) {
      try {
        // Construct the Telegram API URL
        const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        
        // Create inline keyboard with approve/reject buttons
        const inlineKeyboard = {
          inline_keyboard: [
            [
              {
                text: "✅ Approve",
                callback_data: `approve_${verification.id}`
              },
              {
                text: "❌ Reject",
                callback_data: `reject_${verification.id}`
              }
            ]
          ]
        };
        
        // Use fetch to make the HTTP request with inline keyboard
        const response = await fetch(telegramApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            reply_markup: inlineKeyboard,
            disable_notification: false
          }),
        });
        
        const data = await response.json();
        
        if (data.ok) {
          console.log(`✅ DIRECT API: Message with buttons sent to ${chatId}`);
        } else {
          console.error(`❌ DIRECT API ERROR: ${data.description}`);
        }
      } catch (error) {
        console.error(`❌ FETCH ERROR for ${chatId}:`, error);
      }
    }
  };
  
  // Execute the direct notifications
  sendDirectNotifications()
    .then(() => console.log('✅ DIRECT NOTIFICATIONS COMPLETED'))
    .catch(err => console.error('❌ DIRECT NOTIFICATION FAILED:', err));
  
  // 2. Also try library approach with inline keyboard as backup
  try {
    // Create a non-polling bot instance just for this message
    const notificationBot = new TelegramBot(botToken, { polling: false });
    
    // Create options with inline keyboard markup
    const options = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "✅ Approve",
              callback_data: `approve_${verification.id}`
            },
            {
              text: "❌ Reject", 
              callback_data: `reject_${verification.id}`
            }
          ]
        ]
      }
    };
    
    // Send to each admin with inline keyboard buttons
    for (const adminId of adminChatIds) {
      setTimeout(() => {
        notificationBot.sendMessage(
          adminId, 
          `🔔 NEW VERIFICATION: ID:${verification.id}, USER:${verification.jalwaUserId}`,
          options
        )
        .then(() => {
          console.log(`✅ LIBRARY: Message with buttons sent to ${adminId}`);
        })
        .catch(error => {
          console.error(`❌ LIBRARY ERROR for ${adminId}:`, error.message);
        });
      }, 1000); // Longer delay for library calls
    }
  } catch (error) {
    console.error('❌ LIBRARY SYSTEM ERROR:', error);
  }
  
  console.log('📩 ALL NOTIFICATION ATTEMPTS INITIATED');
}