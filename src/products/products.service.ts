import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ShopifyService } from 'src/shopify/shopify.service';
import { UpsertProductDTO } from './dto/upsert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Between, Repository } from 'typeorm';
import { diffInDays, toYYYYMMDD } from 'src/common/date';
import { CrawlCreateDTO } from './dto/crawl-create.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductsService {
  constructor(
    private shopifyService: ShopifyService,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private httpService: HttpService,
  ) {}

  async upsert(upsertDto: UpsertProductDTO) {
    let { begin, end } = upsertDto;
    const newBegin = new Date(begin);
    const newEnd = new Date(end);
    newEnd.setDate(newEnd.getDate() + 1);
    const diffDays = diffInDays(begin, end);
    let limit = 50;
    let page = 0;
    let since_id = 0;
    // count records
    const { count } = await this.shopifyService.getCountProductBetweenDate(
      newBegin,
      newEnd,
    );

    // pagination
    page = Math.ceil(count / limit);
    for (let i = 0; i < page; i++) {
      const { products } = await this.shopifyService.getProductBetweenDate(
        newBegin,
        newEnd,
        since_id,
        limit,
      );
      for (const product of products) {
        await this.productsRepository.upsert(
          {
            id: product.id,
            title: product.title,
            createdDate: product.created_at,
            productType: product.product_type,
            imageUrl: product.image ? product.image.src : '',
          },
          ['id'],
        );
      }
      // last id
      since_id = products[products.length - 1].id;
    }

    const response = Array();
    for (let i = 0; i <= diffDays; i++) {
      const beginDate = new Date(begin);
      beginDate.setDate(beginDate.getDate() + i);
      const endDate = new Date(beginDate);
      endDate.setDate(endDate.getDate() + 1);

      // Find records in a day
      const result = await this.productsRepository
        .createQueryBuilder('product')
        .where('product.created_date > :beginDate', {
          beginDate,
        })
        .andWhere('product.created_date < :endDate', {
          endDate,
        })
        .getMany();
      response.push({
        date: toYYYYMMDD(beginDate.toISOString()),
        numOfProducts: result.length,
        productIds: result.map((element) => {
          return element.id;
        }),
      });
    }
    return response;
  }

  async crawlCreate(data: CrawlCreateDTO) {
    const response = await firstValueFrom(this.httpService.get(data.link));
    const resultCrawl = response.data;
    delete resultCrawl.product.variants;
    delete resultCrawl.product.images;
    delete resultCrawl.product.image;
    delete resultCrawl.product.options;
    const resultCreate = await this.shopifyService.createProduct(resultCrawl);
    await this.productsRepository.upsert(
      {
        id: resultCreate.product.id,
        title: resultCreate.product.title,
        productType: resultCreate.product.product_type,
        createdDate: resultCreate.product.created_at,
        imageUrl: '',
      },
      ['id'],
    );
    return { productId: resultCreate.product.id };
  }
}
