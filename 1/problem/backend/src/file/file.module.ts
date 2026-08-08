import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { BullModule } from '@nestjs/bullmq';
import { QueueName } from './constants';
import { FileConsumer } from './file.consumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueName.FILE
    })
  ],
  controllers: [FileController],
  providers: [FileService, FileConsumer],
})
export class FileModule { }
