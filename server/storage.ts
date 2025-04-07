import { users, licenses, type User, type InsertUser, type License, type InsertLicense, type LicenseVerifyRequest } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // License methods
  createLicense(license: InsertLicense): Promise<License>;
  getLicense(id: number): Promise<License | undefined>;
  getLicenseByKey(licenseKey: string): Promise<License | undefined>;
  verifyLicense(verifyData: LicenseVerifyRequest): Promise<{ 
    valid: boolean; 
    message: string; 
    licenseData?: License;
  }>;
  getAllActiveLicenses(): Promise<License[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private licenses: Map<number, License>;
  userCurrentId: number;
  licenseCurrentId: number;
  
  // Some demo license keys for testing
  private demoLicenseKeys: Record<string, { gameType: 'wingo' | 'trx', timeOptions: string[] }> = {
    'VIP2025': { gameType: 'wingo', timeOptions: ['30 SEC', '1 MIN', '3 MIN'] },
    'VIP25': { gameType: 'trx', timeOptions: ['30 SEC', '1 MIN', '3 MIN'] },
    'VIPPRO': { gameType: 'wingo', timeOptions: ['1 MIN', '3 MIN', '5 MIN'] }
  };

  constructor() {
    this.users = new Map();
    this.licenses = new Map();
    this.userCurrentId = 1;
    this.licenseCurrentId = 1;
    
    // Initialize with some demo licenses
    const now = new Date();
    const oneYearLater = new Date(now);
    oneYearLater.setFullYear(now.getFullYear() + 1);
    
    // Create demo licenses
    Object.entries(this.demoLicenseKeys).forEach(([key, info], index) => {
      const license: License = {
        id: this.licenseCurrentId++,
        licenseKey: key,
        userId: null,
        gameType: info.gameType,
        timeOption: info.timeOptions.join(','),
        createdAt: now,
        expiresAt: oneYearLater,
        isActive: true
      };
      
      this.licenses.set(license.id, license);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async createLicense(insertLicense: InsertLicense): Promise<License> {
    const id = this.licenseCurrentId++;
    const now = new Date();
    const license: License = { 
      id,
      licenseKey: insertLicense.licenseKey,
      userId: insertLicense.userId === undefined ? null : insertLicense.userId,
      gameType: insertLicense.gameType,
      timeOption: insertLicense.timeOption,
      expiresAt: insertLicense.expiresAt,
      isActive: insertLicense.isActive ?? true,
      createdAt: now
    };
    this.licenses.set(id, license);
    return license;
  }
  
  async getLicense(id: number): Promise<License | undefined> {
    return this.licenses.get(id);
  }
  
  async getLicenseByKey(licenseKey: string): Promise<License | undefined> {
    return Array.from(this.licenses.values()).find(
      (license) => license.licenseKey === licenseKey,
    );
  }
  
  async verifyLicense(verifyData: LicenseVerifyRequest): Promise<{ 
    valid: boolean; 
    message: string; 
    licenseData?: License;
  }> {
    const { licenseKey, gameType, timeOption } = verifyData;
    
    // Find the license by key
    const license = await this.getLicenseByKey(licenseKey);
    
    // If license doesn't exist
    if (!license) {
      return { 
        valid: false, 
        message: 'Invalid license key' 
      };
    }
    
    // Check if license is active
    if (!license.isActive) {
      return { 
        valid: false, 
        message: 'License is inactive or has been revoked' 
      };
    }
    
    // Check if license has expired
    const now = new Date();
    if (license.expiresAt < now) {
      return { 
        valid: false, 
        message: 'License has expired' 
      };
    }
    
    // Check if game type matches
    if (license.gameType !== gameType) {
      return { 
        valid: false, 
        message: `This license is for ${license.gameType.toUpperCase()} game, not for ${gameType.toUpperCase()}` 
      };
    }
    
    // Check if time option is valid for this license
    const timeOptions = license.timeOption.split(',');
    if (!timeOptions.includes(timeOption)) {
      return { 
        valid: false, 
        message: `This license doesn't support the ${timeOption} time option` 
      };
    }
    
    // All checks passed
    return { 
      valid: true, 
      message: 'License verified successfully', 
      licenseData: license 
    };
  }
  
  async getAllActiveLicenses(): Promise<License[]> {
    const now = new Date();
    return Array.from(this.licenses.values()).filter(
      (license) => license.isActive && license.expiresAt > now
    );
  }
}

export const storage = new MemStorage();
