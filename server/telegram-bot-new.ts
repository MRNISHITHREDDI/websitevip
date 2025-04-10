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
export async function initBot(): Promise<TelegramBot | null> {
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
  
  // Create a new bot instance with polling for callback processing
  try {
    // We need polling to handle button callbacks
    // Determine if we should use webhooks or polling
    const useWebhooks = process.env.USE_TELEGRAM_WEBHOOKS === 'true';
    const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;
    
    let options: any = {
      filepath: false // Don't store files locally
    };
    
    if (useWebhooks && webhookUrl) {
      console.log(`🌐 Using webhook mode with URL: ${webhookUrl}`);
      options.webHook = { 
        port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000 
      };
    } else {
      console.log('🔄 Using polling mode for callback processing');
      options.polling = {
        interval: 300,
        autoStart: true,
        params: {
          timeout: 10
        }
      };
    }
    
    botInstance = new TelegramBot(token, options);
    
    // Set up webhook if in webhook mode
    if (useWebhooks && webhookUrl) {
      try {
        await botInstance.setWebHook(webhookUrl);
        console.log(`✅ Webhook set to ${webhookUrl}`);
      } catch (error) {
        console.error('❌ Failed to set webhook:', error);
      }
    }
    
    // Set up callback query handler for approve/reject buttons
    botInstance.on('callback_query', async (callbackQuery) => {
      try {
        const message = callbackQuery.message;
        const chatId = message?.chat.id;
        const callbackData = callbackQuery.data || '';
        
        if (!chatId) return;
        
        console.log(`🔘 Received callback: ${callbackData} from ${chatId}`);
        
        // Check if admin is authorized
        if (!adminChatIds.includes(chatId)) {
          await botInstance?.answerCallbackQuery(callbackQuery.id, {
            text: 'Unauthorized: You are not registered as an admin.',
            show_alert: true
          });
          return;
        }
        
        // Extract action and verification ID
        const [action, verificationIdStr] = callbackData.split('_');
        
        // Handle test buttons specially
        if (action === 'test') {
          await botInstance?.answerCallbackQuery(callbackQuery.id, {
            text: `Test button "${verificationIdStr}" clicked successfully!`,
            show_alert: true
          });
          return;
        }
        
        const verificationId = parseInt(verificationIdStr);
        
        if (isNaN(verificationId)) {
          throw new Error('Invalid verification ID format');
        }
        
        // Process the action
        if (action === 'approve' || action === 'reject') {
          const newStatus = action === 'approve' ? 'approved' : 'rejected';
          const notes = `${newStatus === 'approved' ? 'Approved' : 'Rejected'} via Telegram by admin ${chatId}`;
          
          // Update verification status
          const result = await storage.updateAccountVerificationStatus(verificationId, newStatus, notes);
          
          if (!result) {
            throw new Error(`Verification #${verificationId} not found`);
          }
          
          // Answer the callback query to show notification
          await botInstance?.answerCallbackQuery(callbackQuery.id, {
            text: `${action === 'approve' ? '✅' : '❌'} Verification #${verificationId} ${newStatus}!`,
            show_alert: true
          });
          
          // Update the message to show it's been processed or send a new one if editing fails
          const emoji = action === 'approve' ? '✅' : '❌';
          const statusText = action === 'approve' ? 'APPROVED' : 'REJECTED';
          // Escape any special Markdown characters in the jalwaUserId
          const safeUserId = result.jalwaUserId.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
          const responseText = `🔔 VERIFICATION #${verificationId} ${statusText} ${emoji}\n\nUser: ${safeUserId}\nTime: ${new Date().toLocaleString()}`;
          
          try {
            // Try to edit the message first
            await botInstance?.editMessageText(responseText, {
              chat_id: chatId,
              message_id: message.message_id,
              parse_mode: 'Markdown'
            });
          } catch (err) {
            // If editing fails, send a new message
            console.log('Unable to edit original message, sending new confirmation');
            await botInstance?.sendMessage(chatId, responseText, {
              parse_mode: 'Markdown'
            });
          }
          
          console.log(`✅ Verification #${verificationId} ${newStatus} via Telegram by admin ${chatId}`);
        } else {
          throw new Error(`Unknown action: ${action}`);
        }
      } catch (err) {
        const error = err as Error;
        console.error('❌ Error processing callback query:', error);
        
        // Notify the admin about the error
        await botInstance?.answerCallbackQuery(callbackQuery.id, {
          text: `Error: ${error.message || 'Failed to process your request'}`,
          show_alert: true
        });
      }
    });
    
    console.log('✅ Bot instance created successfully with callback handlers');
    
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
  
  // Determine if we're in development environment
  const baseUrl = process.env.BASE_URL || process.env.REPLIT_URL || process.env.VERCEL_URL || process.env.PUBLIC_URL;
  const isDev = !baseUrl && process.env.NODE_ENV !== 'production';
  
  // Format message - same for both development and production
  // Escape any special Markdown characters in the jalwaUserId
  const safeUserId = verification.jalwaUserId.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
  
  const message = `🚨 NEW VERIFICATION REQUEST 🚨

ID: ${verification.id}
User: ${safeUserId}
Status: ${verification.status}
Time: ${new Date().toLocaleString()}

Instructions:
- Review the user ID
- Use the approve or reject buttons below`;

  // Format base URL for Telegram buttons
  let formattedBaseUrl: string;
  if (isDev) {
    // In development, we can't use localhost URLs with Telegram, so we'll use a placeholder
    formattedBaseUrl = 'https://example.com'; // Placeholder URL for development
    console.log('⚠️ Development environment detected. Using example.com as placeholder URL.');
    console.log('ℹ️ In production, set BASE_URL environment variable to your deployed domain.');
  } else {
    // In production with a proper URL
    formattedBaseUrl = baseUrl ? (baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`) : 'https://example.com';
  }
  
  console.log(`🔗 Using base URL for notifications: ${formattedBaseUrl}`);
  
  // Create keyboard with callback data instead of URLs
  const inlineKeyboard = {
    inline_keyboard: [
      [
        {
          text: "✅ Approve",
          callback_data: `approve_${verification.id}`
        }
      ],
      [
        {
          text: "❌ Reject",
          callback_data: `reject_${verification.id}`
        }
      ]
    ]
  };
  
  const options = {
    parse_mode: 'Markdown',
    reply_markup: inlineKeyboard
  };
  
  // Send notification to all admins
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