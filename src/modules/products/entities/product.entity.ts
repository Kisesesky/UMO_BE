//src/modules/products/entities/product.entity.ts
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PRODUCT_TYPE, ProductType } from '../types/product-types';
import { CURRENCY_TYPE, CurrencyType } from '../types/currency-types';


@Entity('products')
export class Product extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'varchar', length: 20, name: 'product_type' })
  productType: ProductType;

  @Column({ type: 'varchar', length: 20, name: 'currency_type' })
  currencyType: CurrencyType;

  @Column({ type: 'int', nullable: true, name: 'duration_days' })
  durationDays: number; // 이용권 기간 (일)

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'image_url' })
  imageUrl: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;
}
