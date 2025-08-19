import { compare, hash } from 'bcryptjs';
import { and, eq, getTableColumns, gte, sql } from 'drizzle-orm';
import { SALT_ROUNDS } from '../../constants.js';
import { accounts, sessions } from '../../db/schema.js';
import { db } from '../../infra/db.js';

async function findBySession(token: string) {
  return db
    .select(getTableColumns(accounts))
    .from(accounts)
    .leftJoin(sessions, eq(accounts.id, sessions.accountId))
    .where(and(eq(sessions.id, token), gte(sessions.expiresAt, sql`now()`)))
    .then((v) => v.at(0));
}

async function findByEmail(email: string) {
  return db
    .select(getTableColumns(accounts))
    .from(accounts)
    .where(eq(accounts.email, email))
    .then((v) => v.at(0));
}

async function findByPassword(email: string, rawPassword: string) {
  const account = await findByEmail(email);

  if (!account) return null;

  const isValid = await compare(rawPassword, account.password);

  return isValid ? account : null;
}

async function insert(email: string, rawPassword: string) {
  const password = await hash(rawPassword, SALT_ROUNDS);

  return await db
    .insert(accounts)
    .values({ email, password })
    .returning()
    .then((v) => v.at(0)!);
}

export const accountRepo = {
  findBySession,
  findByEmail,
  findByPassword,
  insert,
};
