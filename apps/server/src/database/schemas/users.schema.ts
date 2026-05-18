import { timestamp } from 'drizzle-orm/pg-core';
import { boolean } from 'drizzle-orm/pg-core';
import { integer } from 'drizzle-orm/pg-core';
import { varchar } from 'drizzle-orm/pg-core';
import { uuid } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  phone: varchar('phone', { length: 20 }).unique(),
  dateOfBirth: timestamp('date_of_birth').notNull(),
  passwordHash: varchar('password_hash', { length: 100 }).notNull(),
  otpHash: varchar('otp_hash', { length: 255 }),
  otpAttempts: integer('otp_attempts').default(0).notNull(),
  otpExpiresAt: timestamp('otp_expires_at'),
  isVerified: boolean('is_verified').default(false).notNull(),
  refreshToken: varchar('refresh_token', { length: 255 }),
  isActive: boolean('is_active').default(true).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
