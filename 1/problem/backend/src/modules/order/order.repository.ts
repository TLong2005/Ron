import { Injectable, MessageEvent } from "@nestjs/common";
import { Order } from "./order.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";


const BATCH_SIZE = 10000;

@Injectable()
export class orderRepository {

    constructor(
        @InjectRepository(Order)
        private readonly repo: Repository<Order>
    ) { }


    async *getAll(): AsyncGenerator<Order[], void, unknown> {
        const orderSize = await this.repo.count();

        for (let i: number = 0; i < orderSize; i += BATCH_SIZE) {

            const orders = await this.repo.find({
                skip: i,
                take: BATCH_SIZE,
                order: { id: "ASC" }
            });


            if (orders.length === 0) break;

            yield orders
        }
    }
}