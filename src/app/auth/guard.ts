import { InferSelectModel } from 'drizzle-orm';
import type { Context } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { accounts, sessions } from '../../db/schema.js';
import { accountRepo } from '../../domain/accounts/account.repository.js';

const ACCOUNT_KEY = '__AUTH_ACCOUNT_KEY__';

// Звичайна реалізація на основі сесій без рефрешу
export function authGuard() {
  return createMiddleware(async (c, next) => {
    if (c.get(ACCOUNT_KEY)) {
      return next();
    }

    const token =
      getCookie(c, 'authorization') || c.req.header('authorization');

    if (!token) return c.body('Unauthorized', 401);

    const account = await accountRepo.findBySession(token);

    if (!account) return c.body('Unauthorized', 401);

    c.set(ACCOUNT_KEY, account);

    return next();
  });
}

export function applySession(
  c: Context,
  session: InferSelectModel<typeof sessions>
) {
  c.set(ACCOUNT_KEY, session);
  setCookie(c, 'authorization', session.id);
}

export function getAccount(c: Context): typeof accounts.$inferSelect {
  return c.get(ACCOUNT_KEY);
}
