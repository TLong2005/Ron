import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueName } from './constants';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueName.FILE,
    }),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
