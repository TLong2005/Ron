import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'order_code', type: 'varchar', length: 32 })
  orderCode: string;

  @Column({ name: 'customer_name', type: 'varchar', length: 120 })
  customerName: string;

  @Column({ name: 'product_name', type: 'varchar', length: 120 })
  productName: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ name: 'unit_price', type: 'numeric', precision: 12, scale: 2 })
  unitPrice: string;

  @Column({ name: 'total_amount', type: 'numeric', precision: 14, scale: 2 })
  totalAmount: string;

  @Column({ type: 'varchar', length: 20 })
  status: string;

  @Column({ name: 'ordered_at', type: 'timestamptz' })
  orderedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
