import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { AuthModule } from '../auth/auth.module';
import { SprintController } from './sprint.controller';
import { SprintService } from './sprint.service';

@Module({
  imports: [AiModule, AuthModule],
  controllers: [SprintController],
  providers: [SprintService],
})
export class SprintModule {}
