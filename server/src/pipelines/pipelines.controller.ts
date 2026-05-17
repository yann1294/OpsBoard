import { Controller, Get } from '@nestjs/common';
import { PipelineRun } from './pipeline-run.type';
import { PipelinesService } from './pipelines.service';

@Controller('pipelines')
export class PipelinesController {
  constructor(private readonly pipelinesService: PipelinesService) {}

  @Get()
  getAllPipelines(): PipelineRun[] {
    return this.pipelinesService.getAllRuns();
  }
}
