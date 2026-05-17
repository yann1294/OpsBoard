import { Module } from '@nestjs/common';
import { PipelinesController } from './pipelines.controller';
import { PipelinesGateway } from './pipelines.gateway';
import { PipelinesService } from './pipelines.service';

@Module({
  controllers: [PipelinesController],
  providers: [PipelinesService, PipelinesGateway],
  exports: [PipelinesService],
})
export class PipelinesModule {}
