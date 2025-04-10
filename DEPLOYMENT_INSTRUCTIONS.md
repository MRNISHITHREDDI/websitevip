# Deployment Instructions for Jalwa Verification System

## Telegram Bot Configuration

The Jalwa Verification System uses a Telegram bot for admin notifications and user verification management. Follow these steps to ensure the bot works properly in a deployed environment.

### Environment Variables

When deploying, make sure to configure the following environment variables:

1. `TELEGRAM_BOT_TOKEN` - Your Telegram bot token obtained from BotFather
2. `ADMIN_CHAT_IDS` - Comma-separated list of Telegram chat IDs for administrators 

Example:
```
TELEGRAM_BOT_TOKEN=1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789
ADMIN_CHAT_IDS=123456789,987654321
```

### Bot Setup

1. Create a new bot using [BotFather](https://t.me/botfather) on Telegram
2. Get the bot token and set it as the `TELEGRAM_BOT_TOKEN` environment variable
3. Get your Telegram user ID (you can use the [@userinfobot](https://t.me/userinfobot)) and add it to `ADMIN_CHAT_IDS`
4. Start a conversation with your bot by sending the `/start` command

### Verifying Bot Status After Deployment

After deploying, verify the bot is working properly:

1. Access the bot status endpoint: `/api/bot-status`
2. Check that `isConfigured` is `true` and the bot status is operational
3. Confirm your admin chat ID appears in the `adminIds` array

Example successful response:
```json
{
  "success": true,
  "data": {
    "isConfigured": true,
    "adminIds": [123456789],
    "timestamp": "2025-04-10T16:00:00.000Z",
    "environment": "production"
  }
}
```

### Troubleshooting

If the bot is not working after deployment:

1. Check the bot status using `/api/bot-status` to see detailed information
2. If the bot shows configuration issues, verify your environment variables are correctly set
3. Try restarting the bot integration using:
   ```
   POST /api/restart-bot
   ```
4. Verify the API response and check if any errors are reported
5. The new implementation uses direct HTTPS calls to Telegram's API for maximum reliability
6. Check your deployment platform for any logs related to the Telegram API
7. Test notification delivery with a verification request

## Testing User Verification

To test the verification system:

1. Submit a verification request:
   ```
   POST /api/verify-account
   Content-Type: application/json
   
   {
     "jalwaUserId": "test_user_123"
   }
   ```

2. Check that a notification is sent to the configured admin in Telegram
3. Try approving/rejecting the verification using the inline buttons in Telegram

## Security Notes

- Keep your Telegram bot token secure as it provides full access to your bot
- Only add trusted admins to the `ADMIN_CHAT_IDS` list
- The new simplified implementation eliminates polling for improved reliability
- Each notification attempts multiple delivery methods with built-in fallbacks:
  - Direct HTTPS calls to Telegram API (most reliable in production)
  - Standard bot instance method (backup)
- In-Telegram approval/rejection buttons that work directly within the chat
- All verification changes are logged for accountability

## New Implementation Benefits

- Non-polling design eliminates webhook issues and bot conflicts
- No file-based storage means better performance in serverless environments
- Direct HTTPS requests bypass network/library issues in certain deployment environments
- Simplified code reduces potential points of failure
- Built-in multiple fallback mechanisms ensure notification delivery

## Standalone Verification Tool

A standalone direct Telegram test script is included to verify your bot token and chat IDs:

```bash
# Run this on your local machine or server to test Telegram connectivity
node direct-telegram-test.cjs YOUR_BOT_TOKEN ADMIN_CHAT_ID
```

This script uses direct HTTPS calls without any dependencies, making it useful for verifying your Telegram configuration in any environment, even if other aspects of the application aren't working properly.