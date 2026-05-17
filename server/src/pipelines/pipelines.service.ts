import { Injectable } from '@nestjs/common';
import { PipelineRun, PipelineStatus } from './pipeline-run.type';

const MAX_PIPELINE_RUNS = 20;

@Injectable()
export class PipelinesService {
  private readonly runs: PipelineRun[] = [
    {
      id: 'run_1001',
      service: 'api-server',
      branch: 'main',
      commit: 'a1b2c3d',
      status: 'success',
      durationSeconds: 184,
      triggeredBy: 'github-actions',
      createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    },
    {
      id: 'run_1000',
      service: 'web-client',
      branch: 'develop',
      commit: 'd4e5f6a',
      status: 'running',
      durationSeconds: 63,
      triggeredBy: 'mimison',
      createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    },
  ];

  getAllRuns(): PipelineRun[] {
    return this.runs;
  }

  createMockUpdate(): PipelineRun {
    const services = ['api-server', 'web-client', 'worker', 'docs-site'];
    const branches = ['main', 'develop', 'release/v1', 'feature/pipeline-cards'];
    const triggeredBy = ['github-actions', 'mimison', 'yann1294', 'renovate[bot]'];
    const statuses: PipelineStatus[] = ['success', 'failed', 'running', 'queued'];

    const randomStatus = statuses[this.getRandomIndex(statuses.length)];
    const newRun: PipelineRun = {
      id: `run_${Date.now()}`,
      service: services[this.getRandomIndex(services.length)],
      branch: branches[this.getRandomIndex(branches.length)],
      commit: this.randomCommitSha(),
      status: randomStatus,
      durationSeconds: this.randomDurationForStatus(randomStatus),
      triggeredBy: triggeredBy[this.getRandomIndex(triggeredBy.length)],
      createdAt: new Date().toISOString(),
    };

    this.runs.unshift(newRun);
    if (this.runs.length > MAX_PIPELINE_RUNS) {
      this.runs.length = MAX_PIPELINE_RUNS;
    }

    return newRun;
  }

  private getRandomIndex(max: number): number {
    return Math.floor(Math.random() * max);
  }

  private randomCommitSha(): string {
    return Math.random().toString(16).slice(2, 9);
  }

  private randomDurationForStatus(status: PipelineStatus): number {
    if (status === 'queued') {
      return 0;
    }

    if (status === 'running') {
      return this.randomIntBetween(20, 240);
    }

    return this.randomIntBetween(60, 900);
  }

  private randomIntBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
