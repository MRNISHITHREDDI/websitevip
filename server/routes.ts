import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z, ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { accountVerificationResponseSchema } from "@shared/schema";
import { notifyNewVerification } from "./telegram-bot";

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
      
      // For all verification requests, get the verification record
      try {
        console.log('🔔 New verification request received for User ID:', jalwaUserId);
        
        // Get the verification record to send with the notification
        const verification = await storage.getAccountVerificationByUserId(jalwaUserId);
        
        if (verification) {
          console.log('✅ Retrieved verification record with ID:', verification.id);
          
          // Check if we should notify for this verification
          if (verification.status === 'pending') {
            // Send notification to Telegram admins on a separate thread with immediate execution
            // to avoid blocking the API response while ensuring notification is sent
            setTimeout(() => {
              try {
                console.log('🚀 Sending Telegram notification for verification ID:', verification.id);
                notifyNewVerification(verification);
              } catch (notifyError) {
                console.error('❌ Error in notification thread:', notifyError);
              }
            }, 0);
            
            console.log('✅ Notification process initiated for verification ID:', verification.id);
          } else {
            console.log('ℹ️ Not sending notification - verification status:', verification.status);
          }
        } else {
          console.error('❌ Could not find verification record for user ID:', jalwaUserId);
          
          // Attempt to re-fetch the verification after a short delay
          // This handles race conditions where the record might not be immediately available
          setTimeout(async () => {
            try {
              const delayedVerification = await storage.getAccountVerificationByUserId(jalwaUserId);
              if (delayedVerification) {
                console.log('✅ Retrieved verification record after delay for ID:', delayedVerification.id);
                if (delayedVerification.status === 'pending') {
                  notifyNewVerification(delayedVerification);
                }
              } else {
                console.error('❌ Still could not find verification record for user ID:', jalwaUserId);
              }
            } catch (delayedError) {
              console.error('❌ Error in delayed verification fetch:', delayedError);
            }
          }, 500);
        }
      } catch (error) {
        console.error('❌ Failed to process Telegram notification:', error);
        // Continue with the response even if notification fails
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
  
  // Update account verification status (admin only)
  app.post('/api/admin/account-verifications/:id', async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        status: z.enum(['pending', 'approved', 'rejected']),
        notes: z.string().optional()
      });
      
      const { id } = req.params;
      const { status, notes } = schema.parse(req.body);
      
      const updated = await storage.updateAccountVerificationStatus(
        parseInt(id, 10),
        status,
        notes
      );
      
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Account verification not found'
        });
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
  });

  const httpServer = createServer(app);

  return httpServer;
}
