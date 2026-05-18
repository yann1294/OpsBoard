import { Controller, Get } from '@nestjs/common';
import { GitHubIntegrationService } from './github-integration.service';
import { SimplifiedWorkflowRun } from './github-integration.types';

@Controller('integrations/github')
export class GitHubIntegrationController {
  constructor(
    private readonly gitHubIntegrationService: GitHubIntegrationService,
  ) {}

  @Get('actions')
  getRecentActionsRuns(): Promise<SimplifiedWorkflowRun[]> {
    return this.gitHubIntegrationService.getRecentWorkflowRuns();
  }
}
