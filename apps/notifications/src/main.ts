import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import 'dotenv/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL!],
      queue: 'notics_queue',
      queueOptions: {
        durable: true,
      },
    },
  });
  await app.listen();
}
bootstrap();
