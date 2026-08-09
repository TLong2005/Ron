import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './infra/database.module';
import { QueueModule } from './infra/queue.module';
import { FileProcessorModule } from './modules/file/file-processor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    QueueModule,
    FileProcessorModule,
  ],
})
export class WorkerModule {}
