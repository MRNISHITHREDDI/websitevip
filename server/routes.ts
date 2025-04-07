import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { licenseVerifySchema, type LicenseVerifyRequest } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // License verification endpoint
  app.post('/api/verify-license', async (req: Request, res: Response) => {
    try {
      // Validate the request body against our schema
      const verifyData = licenseVerifySchema.parse(req.body) as LicenseVerifyRequest;
      
      // Verify the license
      const result = await storage.verifyLicense(verifyData);
      
      if (result.valid) {
        // License is valid
        return res.status(200).json({
          success: true,
          message: result.message,
          data: {
            licenseKey: result.licenseData?.licenseKey,
            gameType: result.licenseData?.gameType,
            timeOption: result.licenseData?.timeOption,
            expiresAt: result.licenseData?.expiresAt
          }
        });
      } else {
        // License is invalid
        return res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      // Handle validation errors
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: validationError.message
        });
      }
      
      // Handle other errors
      console.error('License verification error:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred during license verification'
      });
    }
  });
  
  // Get all active licenses (for admin purposes)
  app.get('/api/licenses', async (_req: Request, res: Response) => {
    try {
      const licenses = await storage.getAllActiveLicenses();
      return res.status(200).json({
        success: true,
        data: licenses
      });
    } catch (error) {
      console.error('Error fetching licenses:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while fetching licenses'
      });
    }
  });
  
  // Demo licenses info (for testing purposes)
  app.get('/api/demo-licenses', (_req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      message: 'These are demo license keys for testing',
      data: [
        { licenseKey: 'DEMO123', gameType: 'wingo', timeOptions: ['30 SEC', '1 MIN', '3 MIN'] },
        { licenseKey: 'TRXDEMO456', gameType: 'trx', timeOptions: ['30 SEC', '1 MIN', '3 MIN'] },
        { licenseKey: 'WINGOVIP789', gameType: 'wingo', timeOptions: ['1 MIN', '3 MIN', '5 MIN'] }
      ]
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
