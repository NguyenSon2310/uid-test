import { IsDateString } from 'class-validator';

export class UpsertProductDTO {
  @IsDateString()
  begin: string;

  @IsDateString()
  end: string;
}
