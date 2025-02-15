import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { productsSelectSchema } from '../db/schema';

function numeric(v) {
  if (typeof v === 'string') {
    return Number.parseInt(v, 10);
  }

  if (typeof v === 'number') {
    return v;
  }

  return undefined;
}

const paginationSchema = z.object({
  page: z
    .preprocess(numeric, z.number().min(1).optional().default(1))
    .transform(Number),
  limit: z
    .preprocess(numeric, z.number().min(1).max(100).optional().default(10))
    .transform(Number),
});

export class PaginationDto extends createZodDto(paginationSchema) {}

export const paginatedSchema = (schema: z.ZodTypeAny) =>
  z
    .object({
      data: z.array(schema),
      total: z.preprocess(numeric, z.number().min(0)),
    })
    .merge(paginationSchema);

export type Paginated<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

export class PaginatedProducts extends createZodDto(
  paginatedSchema(productsSelectSchema),
) {}
