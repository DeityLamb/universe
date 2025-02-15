import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ProductProjection } from '../../db/schema';

@Injectable()
export class NoticsClient {
  public static CLIENT_NAME = Symbol('__NOTICS_SERVICE__');

  constructor(
    @Inject(NoticsClient.CLIENT_NAME)
    private readonly client: ClientProxy,
  ) {}

  public async emitCreate(product: ProductProjection) {
    await lastValueFrom(this.client.emit('product.create', product.name));
  }

  public async emitDelete(product: ProductProjection) {
    await lastValueFrom(this.client.emit('product.delete', product.name));
  }
}
