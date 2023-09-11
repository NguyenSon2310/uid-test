import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryColumn('varchar')
  id: string;

  @Column()
  title: string;

  @Column({ name: 'product_type' })
  productType: string;

  @Column({ name: 'created_date' })
  createdDate: string;

  @Column({ name: 'image_url' })
  imageUrl: string;
}
