import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class NoticsController {
  private readonly logger = new Logger(NoticsController.name);

  @MessagePattern('product.create')
  public handleCreate(name: string) {
    this.logger.log('Product "' + name + '" created');
  }

  @MessagePattern('product.delete')
  public handleDelete(name: string) {
    this.logger.log('Product "' + name + '" deleted');
  }
}
