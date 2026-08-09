import { Injectable } from '@nestjs/common';
import { orderRepository } from './order.repository';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: orderRepository
  ) { }

  getAll(): AsyncGenerator<Order[], void, unknown> {
    return this.orderRepository.getAll();
  }
}
