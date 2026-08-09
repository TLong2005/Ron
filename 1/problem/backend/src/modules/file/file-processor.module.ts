import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { OrderModule } from '../order/order.module';
import { QueueName } from './constants';
import { FileConsumer } from './file.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueName.FILE,
    }),
    OrderModule,
  ],
  providers: [FileConsumer],
})
export class FileProcessorModule {}
