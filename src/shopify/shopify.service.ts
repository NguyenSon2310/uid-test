import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ShopifyService {
  private SHOPIFY_ENDPOINT: string;
  private SHOPIFY_APP_TOKEN: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.SHOPIFY_ENDPOINT = configService.get<string>('SHOPIFY_ENDPOINT');
    this.SHOPIFY_APP_TOKEN = configService.get<string>('SHOPIFY_APP_TOKEN');
  }

  private getRestAuth() {
    const restUrl = this.SHOPIFY_ENDPOINT;
    const request = {
      headers: {
        'X-Shopify-Access-Token': this.SHOPIFY_APP_TOKEN,
        'Content-Type': 'application/json',
      },
    };
    return {
      restUrl,
      req: request,
    };
  }

  private async callAdminApi(requestOptions, requestUrL) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(requestUrL, { headers: requestOptions.headers }),
      );
      return response.data;
    } catch (error) {
      throw new InternalServerErrorException(`Error when call shopify`);
    }
  }

  private async callAdminCreateApi(requestOptions, requestUrL, params) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          requestUrL,
          { ...params },
          { headers: requestOptions.headers },
        ),
      );
      return response.data;
    } catch (error) {
      throw new InternalServerErrorException(`Error when call shopify`);
    }
  }

  async getProductBetweenDate(begin, end, since_id: number, limit: number) {
    const shopify = this.getRestAuth();
    let reqUrl = `${shopify.restUrl}/products.json?&created_at_min=${begin}&created_at_max=${end}&since_id=${since_id}&limit=${limit}&fields=id,title,product_type,image,created_at`;
    const requestOptions = shopify.req;

    return await this.callAdminApi(requestOptions, reqUrl);
  }

  async getCountProductBetweenDate(begin, end) {
    const shopify = this.getRestAuth();
    let reqUrl = `${shopify.restUrl}/products/count.json?created_at_min=${begin}&created_at_max=${end}&fields=id,created_at`;
    const requestOptions = shopify.req;

    return await this.callAdminApi(requestOptions, reqUrl);
  }

  async createProduct(params) {
    const shopify = this.getRestAuth();
    let reqUrl = `${shopify.restUrl}/products.json`;
    const requestOptions = shopify.req;
    return await this.callAdminCreateApi(requestOptions, reqUrl, params);
  }
}
