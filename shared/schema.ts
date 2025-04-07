import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const licenses = pgTable("licenses", {
  id: serial("id").primaryKey(),
  licenseKey: varchar("license_key", { length: 36 }).notNull().unique(),
  userId: integer("user_id"),
  gameType: varchar("game_type", { length: 10 }).notNull(), // 'wingo' or 'trx'
  timeOption: varchar("time_option", { length: 20 }).notNull(), // '30 SEC', '1 MIN', etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertLicenseSchema = createInsertSchema(licenses)
  .omit({ id: true, createdAt: true });

export const licenseVerifySchema = z.object({
  licenseKey: z.string().min(5).max(36),
  gameType: z.enum(['wingo', 'trx']),
  timeOption: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertLicense = z.infer<typeof insertLicenseSchema>;
export type License = typeof licenses.$inferSelect;

export type LicenseVerifyRequest = z.infer<typeof licenseVerifySchema>;
