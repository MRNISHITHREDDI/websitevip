# Deployment Instructions

This document contains instructions for deploying and configuring the Jalwa Admin system with Telegram bot integration.

## Required Environment Variables

The following environment variables must be set for the system to function properly:

- `TELEGRAM_BOT_TOKEN`: The token for your Telegram bot, obtained from BotFather
- `ADMIN_CHAT_IDS`: Comma-separated list of Telegram chat IDs for admins who should receive notifications and have access to admin commands
- `BASE_URL`: The base URL of your deployed application (e.g., https://yourapp.replit.app)

### Optional Environment Variables

- `USE_TELEGRAM_WEBHOOKS`: Set to "true" to use webhook mode instead of polling (recommended for production deployments)
- `TELEGRAM_WEBHOOK_URL`: URL where Telegram should send webhook updates (use `https://[your-domain]/api/telegram-webhook`)
- `PORT`: Server port to use (defaults to 5000)

## Setting Up the Telegram Bot

1. Create a new bot through the [BotFather](https://t.me/BotFather) on Telegram
2. Copy the bot token and set it as the `TELEGRAM_BOT_TOKEN` environment variable
3. Start a conversation with your bot by searching for it in Telegram and clicking the "Start" button
4. Determine your Telegram chat ID by using the `/start` command with [@userinfobot](https://t.me/userinfobot) or other similar bots
5. Add your chat ID to the `ADMIN_CHAT_IDS` environment variable

## Callback Buttons in Telegram

This system uses Telegram's callback buttons for one-click approval and rejection of user verifications. When a new verification is submitted, the admin will receive a notification with buttons directly in Telegram:

- ✅ Approve button: Automatically approves the user ID
- ❌ Reject button: Automatically rejects the user ID

This eliminates the need to open a web browser or visit any external pages to process verifications.

## Choosing Between Webhook and Polling Mode

### Polling Mode (Default)

Polling mode is enabled by default and works in most environments. The bot continuously polls Telegram's servers for updates.

### Webhook Mode (Recommended for Production)

For production deployments with public HTTPS URLs, webhook mode is recommended for better performance:

1. Set `USE_TELEGRAM_WEBHOOKS` to "true"
2. Set `TELEGRAM_WEBHOOK_URL` to `https://[your-domain]/api/telegram-webhook`
3. Make sure your server has a valid SSL certificate

## Testing Your Configuration

Once deployed, you can test your configuration using the provided test script:

```bash
node deployment-telegram-test.js
```

This script will:
1. Verify your environment variables
2. Send test messages to your admin chat IDs
3. Test the callback button functionality

Alternatively, you can manually test by:

1. Submitting a test verification from the app
2. Checking if you receive a notification in Telegram with approval/rejection buttons
3. Clicking the buttons to see if the verification status updates correctly

## Troubleshooting

If you encounter issues with the Telegram bot:

- Check that your bot token is correct
- Ensure you've started a conversation with the bot
- Verify your chat ID is correctly added to the admin list
- Check the application logs for any error messages
- Try restarting the bot using the `/api/restart-bot` endpoint

### Common Issues

1. **Buttons not working:** Make sure polling mode is enabled correctly or webhooks are set up properly
2. **No notifications received:** Verify your admin chat ID is correct and you've started a conversation with the bot
3. **"Forbidden" errors:** The bot may not have permission to send messages; restart the conversation with the bot
4. **"Not Found" errors for webhook URLs:** Ensure the URL is publicly accessible and has a valid SSL certificate

For additional assistance, please contact support.