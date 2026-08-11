import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QueueModule } from './infra/queue.module';
import { FileModule } from './modules/file/file.module';
import { PaymentsModule } from './payments/payments.module';
import { DatabaseModule } from './infra/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    QueueModule,
    FileModule,
    DatabaseModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class ApiModule {}

