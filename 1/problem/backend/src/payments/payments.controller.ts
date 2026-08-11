import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import type { CreatePaymentBody } from './payments.interface';
import type { FastifyRequest, FastifyReply } from 'fastify';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }



  @Post()
  payments(
    @Body() body: CreatePaymentBody,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const idempotencyKey = (req.headers as any)["idempotency-key"];
    return this.paymentsService.payments(body,idempotencyKey);
  }
}
