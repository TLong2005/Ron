import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { orderRepository } from './order.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [OrderService,orderRepository],
  exports: [OrderService, TypeOrmModule],
})
export class OrderModule {}
