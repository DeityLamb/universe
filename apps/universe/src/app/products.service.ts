import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { count, eq } from 'drizzle-orm';
import { Counter } from 'prom-client';
import { db } from '../db';
import {
  InsertProductDto,
  ProductProjection,
  productsTable,
} from '../db/schema';
import { NoticsClient } from '../infra/notifications/notics.service';
import { Paginated, PaginationDto } from './products.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly notics: NoticsClient,
    @InjectMetric('products_created_count')
    private readonly productsCreatedCounter: Counter,
    @InjectMetric('products_deleted_count')
    private readonly productsDeletedCounter: Counter,
  ) {}

  // we should abstract pagination logic
  async paginated(
    pagination: PaginationDto,
  ): Promise<Paginated<ProductProjection>> {
    const page = Math.max(0, pagination.page - 1);

    const products = await db
      .select()
      .from(productsTable)
      .limit(pagination.limit)
      .offset(page * pagination.limit);

    const [total] = await db.select({ count: count() }).from(productsTable);

    return {
      data: products,
      total: total.count,
      page: page + 1,
      limit: pagination.limit,
    };
  }

  async createProduct(
    @Body() body: InsertProductDto,
  ): Promise<ProductProjection | null> {
    const products = await db.insert(productsTable).values(body).returning();

    await this.notics.emitCreate(products[0]);
    this.productsCreatedCounter.inc();
    return products[0];
  }
  async deleteProduct(id: number): Promise<ProductProjection | null> {
    const products = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, id))
      .limit(1);

    if (!products[0]) {
      throw new NotFoundException('Product not found');
    }

    await db.delete(productsTable).where(eq(productsTable.id, id));

    this.productsDeletedCounter.inc();
    await this.notics.emitDelete(products[0]);

    return products[0];
  }
}
