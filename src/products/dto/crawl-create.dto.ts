import { IsString } from 'class-validator';

export class CrawlCreateDTO {
  @IsString()
  link: string;
}
