import { Body, Controller, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { UpsertProductDTO } from './dto/upsert.dto';
import { CrawlCreateDTO } from './dto/crawl-create.dto';

@Controller('/api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('upsert')
  async upsert(@Body() data: UpsertProductDTO) {
    return this.productsService.upsert(data);
  }

  @Post('crawl-create')
  async crawlCreate(@Body() data: CrawlCreateDTO) {
    return this.productsService.crawlCreate(data);
  }
}
