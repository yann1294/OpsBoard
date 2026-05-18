import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SimplifiedWorkflowRun } from './github-integration.types';

type GitHubWorkflowRunsResponse = {
  workflow_runs?: Array<{
    id: number;
    name: string;
    status: string;
    conclusion: string | null;
    head_branch: string;
    head_sha: string;
    html_url: string;
    created_at: string;
    updated_at: string;
  }>;
  message?: string;
};

@Injectable()
export class GitHubIntegrationService {
  constructor(private readonly configService: ConfigService) {}

  async getRecentWorkflowRuns(): Promise<SimplifiedWorkflowRun[]> {
    const owner = this.configService.get<string>('GITHUB_OWNER');
    const repo = this.configService.get<string>('GITHUB_REPO');
    const token = this.configService.get<string>('GITHUB_TOKEN');

    if (!owner || !repo) {
      return [];
    }

    const endpoint = `https://api.github.com/repos/${owner}/${repo}/actions/runs?per_page=8`;

    const response = await fetch(endpoint, {
      headers: {
        Accept: 'application/vnd.github+json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      const responseText = await response.text();
      throw new InternalServerErrorException(
        `GitHub API request failed (${response.status}): ${responseText}`,
      );
    }

    const payload = (await response.json()) as GitHubWorkflowRunsResponse;
    const workflowRuns = payload.workflow_runs ?? [];

    return workflowRuns.map((run) => ({
      id: run.id,
      name: run.name,
      status: run.status,
      conclusion: run.conclusion,
      branch: run.head_branch,
      commitSha: run.head_sha,
      htmlUrl: run.html_url,
      createdAt: run.created_at,
      updatedAt: run.updated_at,
    }));
  }
}
