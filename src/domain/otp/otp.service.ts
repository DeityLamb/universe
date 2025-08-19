import { and, eq, gte, sql } from 'drizzle-orm';
import { otps } from '../../db/schema.js';
import { db } from '../../infra/db.js';

const isFresh = gte(otps.expiresAt, sql`now()`);

async function gen(email: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  return db
    .insert(otps)
    .values({
      email,
      code,
    })
    .returning()
    .then((v) => v.at(0)!);
}

async function has(email: string) {
  return db
    .select({ id: otps.id })
    .from(otps)
    .where(and(eq(otps.email, email), isFresh))
    .then((v) => v.length > 0);
}

async function use(email: string, code: string): Promise<boolean> {
  const result = await db
    .delete(otps)
    .where(and(eq(otps.email, email), eq(otps.code, code), isFresh))
    .returning();

  return result.length > 0;
}

export const otpService = {
  gen,
  use,
  has,
};
