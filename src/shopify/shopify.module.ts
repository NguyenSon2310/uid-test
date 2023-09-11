import { Module } from '@nestjs/common';
import { ShopifyService } from './shopify.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  providers: [ShopifyService],
  exports: [ShopifyService],
})
export class ShopifyModule {}
