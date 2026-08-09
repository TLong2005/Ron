import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { createWriteStream } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { finished } from 'stream/promises';
import { stringify } from 'csv-stringify';
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
        return this.exportCSV(job);
      case 'xlsx':
        return this.exportXlsx();
      default:
        return this.exportJson();
    }
  }

  private async exportCSV(job: Job) {
    const s = stringify({
      header: true,
      columns: [
        'id',
        'orderCode',
        'customerName',
        'productName',
        'quantity',
        'unitPrice',
        'totalAmount',
        'status',
        'orderedAt',
        'createdAt',
      ],
    });

    const filePath = join(tmpdir(), `orders-${job.id}.csv`);
    const out = createWriteStream(filePath);
    s.pipe(out);

    for await (const batch of this.orderService.getAll()) {
      for (const order of batch) {
        const canContinue = s.write(order);
        if (!canContinue) {
          await new Promise<void>((resolve, reject) => {
            s.once("drain", () => {
              resolve()
            })
          })
        }
      }
    }

    s.end();
    await finished(out);
    console.log(`CSV exported: ${filePath}`);
    return { filePath };
  }

  private async exportXlsx() { }

  private async exportJson() { }
}
