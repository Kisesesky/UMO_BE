//src/modules/orders/entities/order.entity.ts
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
import { ORDER_STATUS, OrderStatus } from '../constants/order-status';

@Entity('orders')
export class Order extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'product_id' })
  productId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'varchar', length: 20, default: ORDER_STATUS.PENDING })
  status: OrderStatus;

  @Column({ type: 'int', name: 'total_amount' })
  totalAmount: number; // 결제된 금액 (츄르 또는 현금)

  @Column({ type: 'timestamp', name: 'completed_at', nullable: true })
  completedAt: Date;
}
