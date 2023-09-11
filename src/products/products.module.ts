import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ShopifyModule } from 'src/shopify/shopify.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ShopifyModule, TypeOrmModule.forFeature([Product]), HttpModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
