import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { QueueName } from './constants';
import { Queue } from 'bullmq';


@Injectable()
export class FileService {


    constructor(
        @InjectQueue(QueueName.FILE)
        private readonly fileQueue: Queue
    ) { }


    async exportFile(type: string) {

        const job = await this.fileQueue.add(
            "export-file",
            {
                type: type
            },
            {
                attempts: 3, // retry
                backoff: 1000
            }
        );

        return {
            status: 200,
        }
    }
}
