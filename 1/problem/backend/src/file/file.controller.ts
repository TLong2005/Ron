import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) { }



  @Get("export")
  exportFile(
    @Query("type") type: string
  ) {
    return this.fileService.exportFile(type)
  }
}
