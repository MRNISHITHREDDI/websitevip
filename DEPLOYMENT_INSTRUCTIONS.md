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
2. Check that `isConfigured` and `isPolling` are both `true`
3. Confirm your admin chat ID appears in the `adminIds` array

Example successful response:
```json
{
  "success": true,
  "data": {
    "isConfigured": true,
    "isPolling": true,
    "adminIds": [123456789],
    "timestamp": "2025-04-10T16:00:00.000Z",
    "environment": "production"
  }
}
```

### Troubleshooting

If the bot is not working after deployment:

1. Check the bot status using `/api/bot-status` to see detailed information
2. If environment variables are properly set but the bot is not polling, try restarting it: 
   ```
   POST /api/restart-bot
   ```
3. Verify you've started a conversation with your bot by sending `/start` to it
4. Check your deployment platform for any logs related to the Telegram API

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

- Keep your Telegram bot token secure
- Only add trusted admins to the `ADMIN_CHAT_IDS` list
- The Telegram bot uses multiple fallback mechanisms for maximum reliability
- All admin actions are logged with the admin's name for accountability