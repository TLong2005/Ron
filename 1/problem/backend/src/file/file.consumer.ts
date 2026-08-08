import { Processor, WorkerHost } from "@nestjs/bullmq";
import { QueueName } from "./constants";
import { Job } from "bullmq";



@Processor(QueueName.FILE)
export class FileConsumer extends WorkerHost{


    async process(job: Job, token?: string): Promise<any> {
        console.log(job);
        return {};
    }
}