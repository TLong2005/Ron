import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { createReadStream, existsSync } from 'fs';
import { basename } from 'path';
import { QueueName } from './constants';

@Injectable()
export class FileService {
  constructor(
    @InjectQueue(QueueName.FILE)
    private readonly fileQueue: Queue,
  ) {}

  async exportFile(type: string) {
    const job = await this.fileQueue.add(
      'export-file',
      {
        type: type,
      },
      {
        attempts: 3,
        backoff: 1000,
      },
    );

    return {
      status: 200,
      jobId: job.id,
    };
  }

  async getStatusExport(jobId: string) {
    const job = await this.fileQueue.getJob(jobId);

    if (!job) {
      return {
        jobId,
        state: 'not_found',
        progress: 0,
      };
    }

    const state = await job.getState();
    const progress = typeof job.progress === 'number' ? job.progress : 0;

    return {
      jobId: job.id,
      state,
      progress,
      failedReason: job.failedReason ?? null,
      returnvalue: job.returnvalue ?? null,
    };
  }

  async getExportDownload(jobId: string) {
    const job = await this.fileQueue.getJob(jobId);

    if (!job) {
      throw new NotFoundException(`Job ${jobId} không tồn tại`);
    }

    const state = await job.getState();
    if (state !== 'completed') {
      throw new BadRequestException(
        `Job chưa xong (state=${state}), không thể tải file`,
      );
    }

    const filePath = job.returnvalue?.filePath as string | undefined;
    if (!filePath || !existsSync(filePath)) {
      throw new NotFoundException('File export không tồn tại');
    }

    return {
      stream: createReadStream(filePath),
      filename: basename(filePath),
    };
  }
}
