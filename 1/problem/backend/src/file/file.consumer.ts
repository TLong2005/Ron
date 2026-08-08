import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { OrderService } from '../order/order.service';
import { QueueName } from './constants';

@Processor(QueueName.FILE)
export class FileConsumer extends WorkerHost {
  constructor(private readonly orderService: OrderService) {
    super();
  }

  async process(job: Job, token?: string): Promise<any> {
    const { type } = job.data;

    switch (type) {
      case 'csv':
        return this.exportCSV();
      case 'xlsx':
        return this.exportXlsx();
      default:
        return this.exportJson();
    }
  }

  private async exportCSV() {
    console.log('ok');
  }

  private async exportXlsx() {}

  private async exportJson() {}
}
