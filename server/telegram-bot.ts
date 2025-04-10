import TelegramBot from 'node-telegram-bot-api';
import { storage } from './storage';
import dotenv from 'dotenv';
import * as https from 'https';

// Load environment variables
dotenv.config();

// Initialize the bot with the token from environment variables
let token: string | undefined = process.env.TELEGRAM_BOT_TOKEN;
let bot: TelegramBot | null = null;

// List of authorized admin chat IDs (for security)
let AUTHORIZED_CHAT_IDS: number[] = [];

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
  // First, stop any existing bot to prevent multiple polling instances
  if (bot && bot.isPolling()) {
    console.log('Stopping existing bot before reinitialization...');
    try {
      bot.stopPolling();
    } catch (error) {
      console.error('Error stopping existing bot:', error);
    }
    // Small delay to ensure the connection is properly closed
    setTimeout(() => {
      bot = null;
      initBotInternal();
    }, 1000);
    return;
  }
  
  // If no existing bot, initialize immediately
  initBotInternal();
}

// Internal function for bot initialization
function initBotInternal(): void {
  // Reload token and chat IDs from environment variables (important for deployment)
  token = process.env.TELEGRAM_BOT_TOKEN;
  
  // Reload admin chat IDs from environment
  if (process.env.ADMIN_CHAT_IDS) {
    AUTHORIZED_CHAT_IDS = process.env.ADMIN_CHAT_IDS
      .split(',')
      .map(id => parseInt(id.trim(), 10))
      .filter(id => !isNaN(id));
  }
  
  // Don't initialize if the token is missing
  if (!token) {
    console.warn('TELEGRAM_BOT_TOKEN is not set. Telegram bot will not be started.');
    return;
  }
  
  console.log('Starting Telegram bot...');
  console.log('Admin chat IDs configured:', AUTHORIZED_CHAT_IDS);
  console.log('ADMIN_CHAT_IDS env value:', process.env.ADMIN_CHAT_IDS);
  
  try {
    // Create a bot instance with clean session
    bot = new TelegramBot(token, { 
      polling: true,
      // Add these options to avoid conflicts with other instances
      filepath: false, // Disable file storage to prevent file locks
      baseApiUrl: "https://api.telegram.org", // Use direct API URL
      onlyFirstMatch: true, // Only handle first match to reduce processing
      request: { // Add request timeout
        timeout: 30000
      }
    });
    
    // Register error event handler
    bot.on('polling_error', (error) => {
      // Handle conflict errors specially (409 errors)
      if (error.message && error.message.includes('409')) {
        console.error('Telegram conflict error (409). Stopping and reinitializing bot...');
        stopBot();
        // Wait a moment and try to restart with new session
        setTimeout(() => {
          initBotInternal();
        }, 2000);
        return;
      }
      
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
    if (AUTHORIZED_CHAT_IDS.length > 0) {
      for (const chatId of AUTHORIZED_CHAT_IDS) {
        try {
          console.log(`Sending test message to admin ${chatId}...`);
          safeSendMessage(chatId, '🤖 Jalwa Admin Bot started successfully!');
          console.log(`Test message initiated for admin ${chatId}`);
        } catch (error) {
          console.error(`Error sending test message to admin ${chatId}:`, error);
        }
      }
    } else {
      console.warn('No admin chat IDs configured. Test messages will not be sent.');
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
    if (!bot) return; // Early return if bot is null
    
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

// Check if the Telegram bot is properly configured and working
export function checkBotStatus(): {
  isConfigured: boolean;
  isPolling: boolean;
  adminIds: number[];
  error?: string;
} {
  // Check if token is available
  const tokenAvailable = !!process.env.TELEGRAM_BOT_TOKEN;
  
  // Check if admin chat IDs are available
  const adminsAvailable = !!process.env.ADMIN_CHAT_IDS && 
    process.env.ADMIN_CHAT_IDS.split(',').filter(id => !!id).length > 0;
  
  // Get current admin IDs
  const currentAdminIds = AUTHORIZED_CHAT_IDS.length > 0 ? 
    AUTHORIZED_CHAT_IDS : 
    (process.env.ADMIN_CHAT_IDS ? 
      process.env.ADMIN_CHAT_IDS.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id)) 
      : []);
  
  // Check if bot is polling
  const isPolling = !!bot && bot.isPolling();
  
  // Generate error message if any component is missing
  let error: string | undefined;
  
  if (!tokenAvailable) {
    error = 'Telegram Bot Token not configured. Set TELEGRAM_BOT_TOKEN in environment variables.';
  } else if (!adminsAvailable) {
    error = 'Admin Chat IDs not configured. Set ADMIN_CHAT_IDS in environment variables.';
  } else if (!isPolling && tokenAvailable && adminsAvailable) {
    error = 'Bot is configured but not polling. Try restarting the application.';
  }
  
  return {
    isConfigured: tokenAvailable && adminsAvailable,
    isPolling,
    adminIds: currentAdminIds,
    error
  };
}

// Send notification to admins about a new verification with inline buttons for approve/reject
export function notifyNewVerification(verification: any): void {
  console.log('🚨 NEW VERIFICATION ALERT: Received ID:', verification.id);
  
  // Always reload token from environment - this ensures deployed environment variables are used
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.error('⛔ NOTIFICATION ERROR: Missing Telegram bot token');
    return;
  }
  
  // Use global admin chat IDs if available (for deployed environment)
  let adminChatIds: number[] = [];
  
  // If global admin IDs are loaded, use them
  if (AUTHORIZED_CHAT_IDS && AUTHORIZED_CHAT_IDS.length > 0) {
    adminChatIds = AUTHORIZED_CHAT_IDS;
    console.log('📨 Using globally loaded admin chat IDs:', adminChatIds.join(', '));
  } else {
    // Fallback to loading from environment (for fresh deployments)
    const adminChatIdsStr = process.env.ADMIN_CHAT_IDS;
    if (!adminChatIdsStr) {
      console.error('⛔ NOTIFICATION ERROR: Missing admin chat IDs in environment');
      return;
    }
    
    adminChatIds = adminChatIdsStr
      .split(',')
      .map(id => parseInt(id.trim(), 10))
      .filter(id => !isNaN(id));
      
    console.log('📨 Using freshly loaded admin chat IDs:', adminChatIds.join(', '));
  }
  
  if (adminChatIds.length === 0) {
    console.error('⛔ NOTIFICATION ERROR: No valid admin chat IDs found');
    return;
  }
  
  console.log('📨 SENDING NOTIFICATIONS: Admin IDs:', adminChatIds.join(', '));
  
  // Format in plain text (no special formatting that could cause issues)
  const message = `🚨 NEW VERIFICATION REQUEST 🚨
ID: ${verification.id}
User: ${verification.jalwaUserId}
Status: ${verification.status}
Created: ${new Date().toLocaleString()}`;

  // First try using the global bot instance if available
  if (bot && bot.isPolling()) {
    console.log('📨 Using global bot instance for notifications');
    
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
    
    // Try sending to all admins using global bot instance
    let globalBotFailed = false;
    
    for (const adminId of adminChatIds) {
      bot.sendMessage(adminId, message, options)
        .then(() => {
          console.log(`✅ NOTIFICATION: Message sent to ${adminId} via global bot`);
        })
        .catch(error => {
          console.error(`❌ GLOBAL BOT ERROR for ${adminId}:`, error.message);
          globalBotFailed = true;
          
          // If global bot fails, immediately use fallback
          console.log(`⚠️ Trying fallback notification for ${adminId}...`);
          sendFallbackNotification(botToken, adminId, message, verification.id);
        });
    }
    
    // If global bot worked, return
    if (!globalBotFailed) {
      return;
    }
  }
  
  // If global bot isn't available or failed, try a new non-polling bot instance
  try {
    console.log('📨 Creating one-time bot instance for notifications');
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
      notificationBot.sendMessage(adminId, message, options)
        .then(() => {
          console.log(`✅ NOTIFICATION: Message sent to ${adminId} via one-time bot`);
        })
        .catch(error => {
          console.error(`❌ NOTIFICATION ERROR for ${adminId}:`, error.message);
          
          // If library method fails, try using fetch API as fallback
          console.log(`⚠️ Trying direct API fallback for ${adminId}...`);
          sendFallbackNotification(botToken, adminId, message, verification.id);
        });
    }
  } catch (error) {
    console.error('❌ NOTIFICATION SYSTEM ERROR:', error);
    
    // If all other methods fail, try the direct API approach for all admins
    console.log('⚠️ Trying direct API fallback for all admins...');
    for (const adminId of adminChatIds) {
      sendFallbackNotification(botToken, adminId, message, verification.id);
    }
  }
}

// Fallback notification using direct HTTP API (for maximum reliability in deployed envs)
async function sendFallbackNotification(
  botToken: string, 
  chatId: number, 
  message: string, 
  verificationId: number
): Promise<void> {
  try {
    console.log(`🔄 ATTEMPTING DIRECT API FALLBACK for admin ${chatId}...`);
    
    // Create inline keyboard with approve/reject buttons
    const inlineKeyboard = {
      inline_keyboard: [
        [
          {
            text: "✅ Approve",
            callback_data: `approve_${verificationId}`
          },
          {
            text: "❌ Reject",
            callback_data: `reject_${verificationId}`
          }
        ]
      ]
    };
    
    // First try with fetch API
    try {
      // Use fetch to make the direct HTTP request
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          reply_markup: inlineKeyboard
        }),
      });
      
      const data = await response.json();
      if (data.ok) {
        console.log(`✅ FALLBACK FETCH: Message sent to ${chatId}`);
        return; // Success! Exit the function
      } else {
        console.error(`❌ FALLBACK FETCH ERROR: ${data.description}`);
        // Continue to next fallback method
      }
    } catch (fetchError) {
      console.error(`❌ FETCH API ERROR for ${chatId}:`, fetchError);
      // Continue to next fallback method
    }
    
    // If fetch fails, try with native HTTPS module (works in all Node.js environments)
    try {
      // Prepare request data
      const requestData = JSON.stringify({
        chat_id: chatId,
        text: message,
        reply_markup: inlineKeyboard
      });
      
      // Create a promise to handle the HTTPS request
      const httpsRequest = new Promise<void>((resolve, reject) => {
        const options = {
          hostname: 'api.telegram.org',
          port: 443,
          path: `/bot${botToken}/sendMessage`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestData)
          }
        };
        
        const req = https.request(options, (res) => {
          let responseData = '';
          
          res.on('data', (chunk) => {
            responseData += chunk;
          });
          
          res.on('end', () => {
            try {
              const parsedData = JSON.parse(responseData);
              if (parsedData.ok) {
                console.log(`✅ FALLBACK HTTPS: Message sent to ${chatId}`);
                resolve();
              } else {
                console.error(`❌ FALLBACK HTTPS ERROR: ${parsedData.description}`);
                reject(new Error(`Telegram API error: ${parsedData.description}`));
              }
            } catch (parseError) {
              console.error(`❌ FALLBACK HTTPS PARSE ERROR:`, parseError);
              reject(parseError);
            }
          });
        });
        
        req.on('error', (error) => {
          console.error(`❌ FALLBACK HTTPS REQUEST ERROR:`, error);
          reject(error);
        });
        
        // Write and end the request
        req.write(requestData);
        req.end();
      });
      
      // Wait for the HTTPS request to complete
      await httpsRequest;
      
    } catch (httpsError) {
      console.error(`❌ FALLBACK HTTPS ERROR for ${chatId}:`, httpsError);
      console.log(`⚠️ ALL FALLBACK METHODS FAILED for admin ${chatId}`);
    }
  } catch (error) {
    console.error(`❌ CRITICAL FALLBACK ERROR for ${chatId}:`, error);
  }
}