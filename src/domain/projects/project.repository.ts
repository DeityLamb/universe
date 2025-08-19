import { and, eq, InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { accounts, projects } from '../../db/schema.js';
import { db } from '../../infra/db.js';

async function findAllByOwner(
  account: Pick<InferSelectModel<typeof accounts>, 'id'>
) {
  return db
    .select()
    .from(projects)
    .orderBy(projects.id)
    .where(eq(projects.ownerId, account.id));
}

async function findById(id: number) {
  return db
    .select()
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1)
    .then((v) => v.at(0));
}

async function upsert(data: InferInsertModel<typeof projects>) {
  return db
    .insert(projects)
    .values(data)
    .returning()
    .onConflictDoUpdate({
      target: projects.fullName,
      set: data,
    })
    .then((v) => v.at(0)!);
}

async function deleteByOwnerAndId(
  account: Pick<InferSelectModel<typeof accounts>, 'id'>,
  id: number
) {
  await db
    .delete(projects)
    .where(and(eq(projects.id, id), eq(projects.ownerId, account.id)));
}

export const projectRepo = {
  findAllByOwner,
  deleteByOwnerAndId,
  findById,
  upsert,
};
