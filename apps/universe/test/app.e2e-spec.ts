import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import 'dotenv/config';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
describe('Products Endpoints (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  let productId: string;

  it('POST /products - should create a product', async () => {
    const response = await request(app.getHttpServer())
      .post('/products')
      .send({
        name: 'Some Test Product',
        description: 'Some Test Description',
        price: 100,
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Some Test Product');
    expect(response.body.price).toBe(100);
    productId = response.body.id;
  });

  it('GET /products?page=3 - should return paginated products', async () => {
    const response = await request(app.getHttpServer())
      .get('/products?page=3')
      .expect(200);

    expect(response.body).toHaveProperty('total');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('DELETE /products/:id - should delete a product', async () => {
    await request(app.getHttpServer())
      .delete(`/products/${productId}`)
      .expect(200);
  });
});
