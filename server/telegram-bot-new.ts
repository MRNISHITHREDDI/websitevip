import TelegramBot from 'node-telegram-bot-api';
import { storage } from './storage';
import * as https from 'https';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Singleton bot instance
let botInstance: TelegramBot | null = null;

// Admin chat IDs from environment
let adminChatIds: number[] = [];

/**
 * Initialize the Telegram bot
 * @returns The bot instance or null if initialization failed
 */
export function initBot(): TelegramBot | null {
  console.log('🤖 Starting Telegram bot...');
  
  // Always load fresh environment variables
  const token = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!token) {
    console.error('❌ TELEGRAM_BOT_TOKEN not set. Bot cannot start.');
    return null;
  }
  
  // Parse admin chat IDs from environment
  try {
    if (process.env.ADMIN_CHAT_IDS) {
      adminChatIds = process.env.ADMIN_CHAT_IDS
        .split(',')
        .map(id => parseInt(id.trim(), 10))
        .filter(id => !isNaN(id));
      
      console.log('👥 Admin chat IDs:', adminChatIds);
    } else {
      console.warn('⚠️ No ADMIN_CHAT_IDS configured.');
      adminChatIds = [];
    }
  } catch (error) {
    console.error('❌ Error parsing ADMIN_CHAT_IDS:', error);
    adminChatIds = [];
  }

  // Clean up existing bot if it exists
  if (botInstance) {
    try {
      console.log('🧹 Cleaning up existing bot instance...');
      botInstance.stopPolling();
      botInstance = null;
    } catch (error) {
      console.error('❌ Error stopping existing bot:', error);
    }
  }
  
  // Create a new bot instance with optimized options
  try {
    // Use a simple non-polling bot for maximum reliability
    botInstance = new TelegramBot(token, { 
      polling: false,
      filepath: false, // Don't store files locally
    });
    
    console.log('✅ Bot instance created successfully');
    
    // Send test message to all admins to confirm setup
    for (const chatId of adminChatIds) {
      sendMessage(chatId, '🤖 Jalwa Admin Bot initialized and ready!');
    }
    
    return botInstance;
  } catch (error) {
    console.error('❌ Failed to create bot instance:', error);
    return null;
  }
}

/**
 * Send a message to a Telegram chat
 * @param chatId The chat ID to send the message to
 * @param text The message text
 * @param options Optional Telegram message options
 * @returns Promise that resolves when the message is sent
 */
export async function sendMessage(
  chatId: number, 
  text: string, 
  options?: any
): Promise<boolean> {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error('❌ TELEGRAM_BOT_TOKEN not set. Cannot send message.');
    return false;
  }
  
  // Always try direct HTTP method first (most reliable)
  try {
    console.log(`📨 Sending message to ${chatId}...`);
    const success = await sendDirectApiMessage(
      process.env.TELEGRAM_BOT_TOKEN,
      chatId,
      text,
      options
    );
    
    if (success) {
      console.log(`✅ Message sent to ${chatId} via direct API`);
      return true;
    }
  } catch (error) {
    console.error(`❌ Direct API message failed to ${chatId}:`, error);
  }
  
  // Fall back to bot instance if available
  if (botInstance) {
    try {
      await botInstance.sendMessage(chatId, text, options);
      console.log(`✅ Message sent to ${chatId} via bot instance`);
      return true;
    } catch (error) {
      console.error(`❌ Bot instance message failed to ${chatId}:`, error);
    }
  }
  
  console.error(`❌ All message methods failed for ${chatId}`);
  return false;
}

/**
 * Send message using direct HTTPS request to Telegram API
 * This is the most reliable method for deployed environments
 */
async function sendDirectApiMessage(
  token: string,
  chatId: number,
  text: string,
  options?: any
): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      // Prepare the request body
      const requestBody = JSON.stringify({
        chat_id: chatId,
        text: text,
        ...(options || {})
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
      
      // Make the request
      const req = https.request(requestOptions, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.ok) {
              resolve(true);
            } else {
              console.error('❌ Telegram API error:', response.description);
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

/**
 * Notify admins about a new verification request
 * @param verification The verification object
 */
export async function notifyNewVerification(verification: any): Promise<void> {
  if (adminChatIds.length === 0) {
    console.warn('⚠️ No admin chat IDs configured. Skipping notification.');
    return;
  }
  
  console.log(`🔔 Sending notification for verification ID ${verification.id}...`);
  
  const message = `🚨 *NEW VERIFICATION REQUEST* 🚨
  
ID: ${verification.id}
User: ${verification.jalwaUserId}
Status: ${verification.status}
Time: ${new Date().toLocaleString()}

*Instructions:*
- Review the user ID
- Use the approve or reject link below`;

  // Create approve/reject action URLs that point to our API
  // Determine base URL - try multiple environment variables for maximum compatibility with different hosting providers
  const baseUrl = process.env.BASE_URL || process.env.REPLIT_URL || process.env.VERCEL_URL || process.env.PUBLIC_URL || 'http://localhost:5000';
  
  // Ensure proper URL formatting with protocol
  const formattedBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;
  
  console.log(`🔗 Using base URL for notifications: ${formattedBaseUrl}`);
  
  const inlineKeyboard = {
    inline_keyboard: [
      [
        {
          text: "✅ Approve",
          url: `${formattedBaseUrl}/api/admin/account-verifications/${verification.id}?action=approve&source=telegram`
        }
      ],
      [
        {
          text: "❌ Reject",
          url: `${formattedBaseUrl}/api/admin/account-verifications/${verification.id}?action=reject&source=telegram`
        }
      ]
    ]
  };
  
  const options = {
    parse_mode: 'Markdown',
    reply_markup: inlineKeyboard
  };
  
  // Send to all admins
  for (const chatId of adminChatIds) {
    const success = await sendMessage(chatId, message, options);
    if (success) {
      console.log(`✅ Notification sent to admin ${chatId}`);
    } else {
      console.error(`❌ Failed to send notification to admin ${chatId}`);
    }
  }
}

/**
 * Get the current bot status
 */
export function getBotStatus(): {
  isConfigured: boolean;
  adminIds: number[];
  error?: string;
} {
  const tokenConfigured = !!process.env.TELEGRAM_BOT_TOKEN;
  const adminsConfigured = adminChatIds.length > 0;
  
  let error: string | undefined;
  
  if (!tokenConfigured) {
    error = 'TELEGRAM_BOT_TOKEN not set';
  } else if (!adminsConfigured) {
    error = 'No admin chat IDs configured';
  }
  
  return {
    isConfigured: tokenConfigured && adminsConfigured,
    adminIds: adminChatIds,
    error
  };
}