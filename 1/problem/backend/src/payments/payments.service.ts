import { BadRequestException, Injectable } from '@nestjs/common';
import type { CreatePaymentBody } from './payments.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsService {

    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepo: Repository<Payment>
    ) { }


    async payments(body: CreatePaymentBody, idempotencyKey: string) {
        try {

            const existPayment = await this.paymentRepo.findOne({
                where: {
                    idempotencyKey: idempotencyKey
                }
            });

            if (existPayment) {
                throw new BadRequestException()
            }

            const newPayment = this.paymentRepo.create({
                ...body,
                idempotencyKey
            });

            console.log(newPayment)

            await this.paymentRepo.save(newPayment);

            return {
                ok: true,
                message:"Thanh toán thành công"
            }

        } catch (error) {
            console.log(error)
            return {
                ok: false,
                message:"Thanh toán thất bại"
            }
        }
    }
}

