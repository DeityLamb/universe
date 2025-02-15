import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { patchNestJsSwagger } from 'nestjs-zod';
import { ProductsModule } from './app/products.module';
import { db } from './db';

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule);

  const config = new DocumentBuilder()
    .setTitle('Products')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  patchNestJsSwagger();
  SwaggerModule.setup('docs', app, documentFactory);

  await migrate(db, {
    migrationsFolder: './drizzle',
  });
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
