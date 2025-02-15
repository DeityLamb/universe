import { Module } from '@nestjs/common';
import { NoticsController } from './notics.controller';

@Module({
  controllers: [NoticsController],
  providers: [NoticsController],
})
export class AppModule {}
