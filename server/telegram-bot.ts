import TelegramBot from 'node-telegram-bot-api';
import { storage } from './storage';
import dotenv from 'dotenv';

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

// Send notification to admins about a new verification
export function notifyNewVerification(verification: any): void {
  console.log('📧 notifyNewVerification called with verification:', JSON.stringify(verification));
  console.log('Current AUTHORIZED_CHAT_IDS:', AUTHORIZED_CHAT_IDS);
  
  // Use existing bot if available, or create a non-polling bot for just sending messages
  if (!bot && token) {
    try {
      console.log('Creating non-polling Telegram bot instance for notification...');
      // Create a bot instance without polling to avoid conflicts
      bot = new TelegramBot(token, { polling: false });
      console.log('✅ Bot initialized successfully (non-polling mode)');
    } catch (error) {
      console.error('❌ Failed to initialize bot for notification:', error);
      return;
    }
  } else if (!token) {
    console.error('❌ Cannot initialize bot: TELEGRAM_BOT_TOKEN is missing');
    console.log('TELEGRAM_BOT_TOKEN env value exists?', !!process.env.TELEGRAM_BOT_TOKEN);
    return;
  } else {
    console.log('✅ Using existing bot instance for notification');
  }
  
  // Re-parse admin chat IDs directly from environment to ensure they're current
  if (process.env.ADMIN_CHAT_IDS) {
    AUTHORIZED_CHAT_IDS = process.env.ADMIN_CHAT_IDS
      .split(',')
      .map(id => parseInt(id.trim(), 10))
      .filter(id => !isNaN(id));
    
    console.log('Updated admin chat IDs:', AUTHORIZED_CHAT_IDS);
    
    if (AUTHORIZED_CHAT_IDS.length === 0) {
      console.error('❌ No valid admin chat IDs after parsing');
      console.log('Raw ADMIN_CHAT_IDS value:', process.env.ADMIN_CHAT_IDS);
      return;
    }
  } else {
    console.error('❌ Cannot send notification: ADMIN_CHAT_IDS is missing');
    return;
  }
  
  console.log('🚀 Sending notification for verification ID:', verification.id);
  console.log('Bot info:', { 
    isPolling: bot ? (typeof bot.isPolling === 'function' ? bot.isPolling() : 'unknown') : 'bot is null', 
    token: process.env.TELEGRAM_BOT_TOKEN ? 'exists' : 'missing',
    adminChatIds: AUTHORIZED_CHAT_IDS.join(', ')
  });
  
  // Using HTML format instead of Markdown for better reliability
  const message = `🔔 <b>New Verification Request</b>

<b>User ID:</b> ${verification.jalwaUserId}
<b>Status:</b> ${verification.status.toUpperCase()}
<b>Created:</b> ${new Date(verification.createdAt).toLocaleString()}
<b>ID:</b> ${verification.id}

▶️ Use /approve ${verification.id} to approve
❌ Use /reject ${verification.id} to reject`;

  // Send message to all admins (only use a single notification approach)
  for (const chatId of AUTHORIZED_CHAT_IDS) {
    console.log(`Sending notification to chat ID: ${chatId}`);
    // Use only the retry mechanism which is more reliable
    sendMessageWithRetry(chatId, message, 3);
  }
  
  console.log('✅ Notification process completed for verification ID:', verification.id);
}

// Helper function to send messages with retry
function sendMessageWithRetry(chatId: number, message: string, retries: number): void {
  if (!bot || retries <= 0) return;
  
  console.log(`📤 Attempting to send notification to admin ${chatId} (retries left: ${retries})`);
  
  bot.sendMessage(
    chatId,
    message,
    { parse_mode: 'HTML' }
  ).then(messageInfo => {
    console.log(`✅ Notification sent successfully to admin ${chatId}`, messageInfo.message_id);
  }).catch(err => {
    console.error(`❌ Error sending to admin ${chatId}:`, err);
    
    // Wait 1 second before retrying
    setTimeout(() => {
      console.log(`🔄 Retrying notification to admin ${chatId}...`);
      sendMessageWithRetry(chatId, message, retries - 1);
    }, 1000);
  });
}