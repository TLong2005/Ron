import { Controller, Get, Param, Query, StreamableFile } from '@nestjs/common';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('export')
  exportFile(@Query('type') type: string) {
    return this.fileService.exportFile(type);
  }

  @Get('export/:jobId/status')
  getStatus(@Param('jobId') jobId: string) {
    return this.fileService.getStatusExport(jobId);
  }

  @Get('export/:jobId/download')
  async download(@Param('jobId') jobId: string) {
    const { stream, filename } = await this.fileService.getExportDownload(jobId);

    return new StreamableFile(stream, {
      type: 'text/csv',
      disposition: `attachment; filename="${filename}"`,
    });
  }
}
