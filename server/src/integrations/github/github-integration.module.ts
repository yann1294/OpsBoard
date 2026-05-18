import { Module } from '@nestjs/common';
import { GitHubIntegrationController } from './github-integration.controller';
import { GitHubIntegrationService } from './github-integration.service';

@Module({
  controllers: [GitHubIntegrationController],
  providers: [GitHubIntegrationService],
})
export class GitHubIntegrationModule {}
