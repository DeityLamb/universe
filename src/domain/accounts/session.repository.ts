import { InferSelectModel, sql } from 'drizzle-orm';
import { sessions } from '../../db/schema.js';
import { db } from '../../infra/db.js';

async function issue(
  accountId: number
): Promise<InferSelectModel<typeof sessions>> {
  return db
    .insert(sessions)
    .values({
      accountId,
      expiresAt: sql`(now() + interval '7 day')::timestamp`,
    })
    .returning()
    .then((v) => v.at(0)!);
}

export const sessionRepo = {
  issue,
};
