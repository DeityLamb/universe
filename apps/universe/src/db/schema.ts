import { integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { createZodDto } from 'nestjs-zod';

export const productsTable = pgTable('product', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text().notNull(),
  price: integer().notNull(),
});

export const productsSelectSchema = createSelectSchema(productsTable);

export class ProductProjection extends createZodDto(productsSelectSchema) {}

export class InsertProductDto extends createZodDto(
  createInsertSchema(productsTable),
) {}
