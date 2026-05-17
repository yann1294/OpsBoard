import { Controller, Get, UseGuards } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { SprintService } from './sprint.service';
import type { SprintMockData } from './sprint.service';

@Controller('sprint')
export class SprintController {
  constructor(
    private readonly sprintService: SprintService,
    private readonly aiService: AiService,
  ) {}

  @Get('mock')
  getMockSprintData(): SprintMockData {
    return this.sprintService.getMockSprintData();
  }

  @Get('summary')
  @UseGuards(ClerkAuthGuard)
  async getSprintSummary(): Promise<{
    summary: string;
    source: SprintMockData;
    generatedAt: string;
  }> {
    const source = this.sprintService.getMockSprintData();
    const summary = await this.aiService.summarizeSprint(source);

    return {
      summary,
      source,
      generatedAt: new Date().toISOString(),
    };
  }
}
