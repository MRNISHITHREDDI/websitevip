# Deployment Instructions

This document contains instructions for deploying and configuring the Jalwa Admin system with web-based admin panel.

## Required Environment Variables

The following environment variables must be set for the system to function properly:

- `TELEGRAM_BOT_TOKEN`: The token for your Telegram bot, obtained from BotFather (used for admin notifications only)
- `ADMIN_CHAT_IDS`: Comma-separated list of Telegram chat IDs for admins who should receive notifications
- `BASE_URL`: The base URL of your deployed application (e.g., https://yourapp.replit.app)

## Accessing the Admin Panel

The admin panel is available at the `/admin` route of your application. To access it:

1. Navigate to `https://[your-domain]/admin`
2. Enter the admin password: `jalwa-admin-2023`
3. The admin session will be stored in local storage for 24 hours

### Admin Panel Features

- View all account verifications
- Filter verifications by status (pending, approved, rejected)
- Approve or reject verifications directly from the web interface
- Add notes to verifications
- Mobile-optimized view for managing verifications on the go

## Automatic Verification System

The system now features automatic verification:

- User ID verification requests are automatically approved after 2 seconds
- Auto-approved verifications are marked with appropriate status messages
- Detailed logging tracks the auto-approval process

## Demo Features

The application includes demo functionality to showcase VIP predictions:

- Demo buttons are positioned next to VIP Prediction buttons in the Features Section
- Clicking a demo button opens the Demo VIP Prediction modal
- Demo modal displays sample prediction images with tabs for Current Prediction, Prediction History, and Results History
- Left/right arrow navigation allows cycling through the demo tabs
- Mobile responsive design optimizes the experience on smaller screens

## Mobile Responsiveness

The application is fully responsive and optimized for mobile devices:

- Admin panel adapts to a card-based layout on mobile
- Demo modal uses shorter tab labels and optimized spacing on mobile
- UI elements are appropriately sized for touch interaction on smaller screens

## Testing the Application

To test the application functionality:

1. Visit the main page to see the updated interface
2. Try the demo buttons to view the sample VIP predictions
3. Test account verification by clicking on a VIP Prediction button
4. Enter a Jalwa User ID to see the auto-verification process
5. Access the admin panel to verify the record was created and approved

## Troubleshooting

If you encounter issues:

- Check the browser console for any JavaScript errors
- Verify that all required environment variables are set correctly
- Clear browser cache and reload if UI elements appear incorrectly
- Check the server logs for any backend errors

For additional assistance, please contact support.