import { sql } from 'drizzle-orm';
import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const accounts = pgTable('account', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
});

export const sessions = pgTable('session', {
  id: uuid().primaryKey().defaultRandom(),
  accountId: integer('account_id')
    .notNull()
    .references(() => accounts.id),
  expiresAt: timestamp('expires_at', { withTimezone: true })
    .notNull()
    .default(sql`now() + interval '7 day'`),
});

export const otps = pgTable('otp', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull(),
  code: varchar({ length: 6 }).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true })
    .notNull()
    .default(sql`now() + interval '3 hour'`),
});

export const projects = pgTable('project', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  fullName: varchar({ length: 255 }).notNull().unique(),
  ownerId: integer('owner_id')
    .notNull()
    .references(() => accounts.id),
  name: varchar({ length: 255 }).notNull(),
  url: varchar({ length: 255 }).notNull(),
  stars: integer().notNull(),
  forks: integer().notNull(),
  issues: integer().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});
