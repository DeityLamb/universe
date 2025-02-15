import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NoticsClient } from './notics.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: NoticsClient.CLIENT_NAME,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL!],
          queue: 'notics_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  providers: [NoticsClient],
  exports: [NoticsClient],
})
export class NoticsModule {}
