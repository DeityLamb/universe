import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InsertProductDto, ProductProjection } from '../db/schema';
import { PaginatedProducts, PaginationDto } from './products.dto';
import { ProductsService } from './products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get('/')
  @ApiQuery({ name: 'page', type: Number })
  @ApiQuery({ name: 'limit', type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Get products with pagination',
    type: PaginatedProducts,
  })
  getPaginated(@Query() body: PaginationDto) {
    return this.service.paginated(body);
  }

  @Post('/')
  @ApiResponse({
    status: 201,
    description: 'Create a new product',
    type: ProductProjection,
  })
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() body: InsertProductDto) {
    return this.service.createProduct(body);
  }

  @ApiResponse({
    status: 200,
    description: 'Delete a product by id',
    type: ProductProjection,
  })
  @Delete('/:id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteProduct(id);
  }
}
