import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { OrderModule } from '../order/order.module';
import { QueueName } from './constants';
import { FileConsumer } from './file.consumer';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueName.FILE,
    }),
    OrderModule,
  ],
  controllers: [FileController],
  providers: [FileService, FileConsumer],
})
export class FileModule {}
