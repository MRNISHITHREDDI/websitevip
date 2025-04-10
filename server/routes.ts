import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z, ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { accountVerificationResponseSchema } from "@shared/schema";
import { notifyNewVerification, getBotStatus, initBot } from "./telegram-bot-new";

export async function registerRoutes(app: Express): Promise<Server> {
  // Validate Jalwa User ID endpoint
  app.post('/api/verify-account', async (req: Request, res: Response) => {
    try {
      // Validate request body
      const schema = z.object({
        jalwaUserId: z.string().min(1).max(50),
      });
      
      const { jalwaUserId } = schema.parse(req.body);
      
      // Check if the user ID is verified
      const result = await storage.verifyJalwaAccount(jalwaUserId);
      
      // Always send notifications for new pending verifications
      if (result.success && result.status === 'pending') {
        console.log('🔔 New verification request received for User ID:', jalwaUserId);
        
        // Send notification to admins via Telegram with a longer delay to ensure DB transaction is complete
        setTimeout(async () => {
          try {
            // Get fresh verification record
            const verification = await storage.getAccountVerificationByUserId(jalwaUserId);
            
            if (verification) {
              console.log('📣 SENDING NOTIFICATION: For verification ID:', verification.id);
              notifyNewVerification(verification);
            } else {
              console.error('⚠️ NOTIFICATION ERROR: Could not find verification record for:', jalwaUserId);
            }
          } catch (error) {
            console.error('⚠️ NOTIFICATION ERROR:', error);
          }
        }, 1000); // Longer delay (1 second) to ensure DB transaction completes
      } else {
        console.log('ℹ️ Not sending notification for status:', result.status);
      }
      
      // Return the verification result
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      // Handle zod validation errors
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          success: false,
          message: validationError.message,
          isVerified: false
        });
      }
      
      // Handle other errors
      console.error('Account verification error:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred during account verification',
        isVerified: false
      });
    }
  });
  
  // Get Jalwa registration link
  app.get('/api/registration-link', (_req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      message: 'Use this link to register a new Jalwa account',
      data: {
        registrationUrl: 'https://www.jalwa.vip/#/register?invitationCode=327361287589',
        telegramSupport: '@Bongjayanta2'
      }
    });
  });
  
  // Get all account verifications (admin only)
  app.get('/api/admin/account-verifications', async (_req: Request, res: Response) => {
    try {
      const verifications = await storage.getAllAccountVerifications();
      return res.status(200).json({
        success: true,
        data: verifications
      });
    } catch (error) {
      console.error('Failed to get account verifications:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get account verifications'
      });
    }
  });
  
  // Get account verifications by status (admin only)
  app.get('/api/admin/account-verifications/status/:status', async (req: Request, res: Response) => {
    try {
      const { status } = req.params;
      
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be one of: pending, approved, rejected'
        });
      }
      
      const verifications = await storage.getAccountVerificationsByStatus(status);
      return res.status(200).json({
        success: true,
        data: verifications
      });
    } catch (error) {
      console.error(`Failed to get ${req.params.status} account verifications:`, error);
      return res.status(500).json({
        success: false,
        message: `Failed to get ${req.params.status} account verifications`
      });
    }
  });
  
  // Common handler function for both GET and POST requests
  const handleVerificationUpdate = async (req: Request, res: Response) => {
    try {
      // Handle both JSON body and query parameters (for Telegram links)
      // Check if this is a Telegram link click
      const isTelegramRequest = req.query.source === 'telegram';
      let status, notes;
      
      if (isTelegramRequest) {
        // This is a click from Telegram inline button
        // Use query parameters
        status = req.query.action === 'approve' ? 'approved' : 
                req.query.action === 'reject' ? 'rejected' : null;
                
        if (!status) {
          return res.status(400).send('<h1>Error: Invalid action</h1><p>Action must be either approve or reject</p>');
        }
        
        notes = `${status === 'approved' ? 'Approved' : 'Rejected'} via Telegram link click`;
        
        console.log(`📱 Telegram admin action: ${status} for ID ${req.params.id}`);
      } else {
        // Regular API call - validate request body
        const schema = z.object({
          status: z.enum(['pending', 'approved', 'rejected']),
          notes: z.string().optional()
        });
        
        const validatedData = schema.parse(req.body);
        status = validatedData.status;
        notes = validatedData.notes;
      }
      
      const { id } = req.params;
      
      const updated = await storage.updateAccountVerificationStatus(
        parseInt(id, 10),
        status,
        notes
      );
      
      if (!updated) {
        if (isTelegramRequest) {
          return res.status(404).send('<h1>Error: Verification not found</h1><p>The requested verification ID does not exist.</p>');
        }
        
        return res.status(404).json({
          success: false,
          message: 'Account verification not found'
        });
      }
      
      if (isTelegramRequest) {
        // Return HTML response for browser viewing
        return res.status(200).send(`
          <html>
            <head>
              <title>Verification ${status}</title>
              <style>
                body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 2rem; line-height: 1.5; }
                .container { border: 1px solid #ddd; border-radius: 8px; padding: 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                h1 { color: ${status === 'approved' ? '#10b981' : '#ef4444'}; margin-top: 0; }
                .details { background: #f9fafb; padding: 1rem; border-radius: 6px; margin: 1rem 0; }
                .footer { color: #6b7280; font-size: 0.875rem; margin-top: 2rem; text-align: center; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>${status === 'approved' ? '✅ Approved' : '❌ Rejected'} Successfully</h1>
                <p>The verification request has been <strong>${status}</strong>.</p>
                <div class="details">
                  <p><strong>User ID:</strong> ${updated.jalwaUserId}</p>
                  <p><strong>Verification ID:</strong> ${updated.id}</p>
                  <p><strong>Status:</strong> ${updated.status}</p>
                  <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                </div>
                <p>You can now close this window and return to Telegram.</p>
                <div class="footer">Jalwa Admin Verification System</div>
              </div>
            </body>
          </html>
        `);
      }
      
      return res.status(200).json({
        success: true,
        message: `Account verification ${status}`,
        data: updated
      });
    } catch (error) {
      // Handle zod validation errors
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          success: false,
          message: validationError.message
        });
      }
      
      console.error('Failed to update account verification:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update account verification'
      });
    }
  };
  
  // Register the handler for both POST and GET requests to support Telegram link clicks
  app.post('/api/admin/account-verifications/:id', handleVerificationUpdate);
  app.get('/api/admin/account-verifications/:id', handleVerificationUpdate);
  
  // API endpoint to check Telegram bot status (useful for deployment troubleshooting)
  app.get('/api/bot-status', (_req: Request, res: Response) => {
    try {
      const status = getBotStatus();
      
      return res.status(200).json({
        success: true,
        data: {
          ...status,
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development'
        }
      });
    } catch (error) {
      console.error('Failed to check bot status:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to check bot status',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // API endpoint to restart the bot (useful for recovery in deployed environments)
  // API endpoint for Telegram webhook
  app.post('/api/telegram-webhook', (req: Request, res: Response) => {
    try {
      // Just respond OK to Telegram
      console.log('📩 Webhook received from Telegram:', JSON.stringify(req.body).substring(0, 200) + '...');
      return res.status(200).send('OK');
    } catch (error) {
      console.error('❌ Error processing webhook:', error);
      return res.status(200).send('Error processed');
    }
  });

  app.post('/api/restart-bot', async (_req: Request, res: Response) => {
    try {
      // Check current status
      const beforeStatus = getBotStatus();
      
      // Only try to restart if there's a configuration
      if (!beforeStatus.isConfigured) {
        return res.status(400).json({
          success: false,
          message: 'Cannot restart bot: missing configuration',
          data: beforeStatus
        });
      }
      
      // Attempt to restart the bot
      const botInstance = await initBot();
      
      // Check new status after restart
      const afterStatus = getBotStatus();
      
      return res.status(200).json({
        success: !!botInstance,
        message: botInstance 
          ? 'Bot successfully restarted' 
          : 'Bot restart attempted but failed',
        data: {
          before: beforeStatus,
          after: afterStatus,
          botInitialized: !!botInstance,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Failed to restart bot:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to restart bot',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}