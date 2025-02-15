import { Module } from '@nestjs/common';
import {
  makeCounterProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';
import { NoticsModule } from '../infra';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [
    NoticsModule,
    NoticsModule,
    PrometheusModule.register({
      defaultMetrics: { enabled: false },
    }),
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    makeCounterProvider({
      name: 'products_created_count',
      help: 'Number of products created',
    }),
    makeCounterProvider({
      name: 'products_deleted_count',
      help: 'Number of products deleted',
    }),
  ],
})
export class ProductsModule {}
