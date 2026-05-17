import { Injectable } from '@nestjs/common';

export type SprintMockData = {
  sprintName: string;
  period: string;
  completedItems: string[];
  inProgressItems: string[];
  blockers: string[];
  metrics: {
    velocityPoints: number;
    completedCount: number;
    inProgressCount: number;
    blockerCount: number;
    deploymentSuccessRate: string;
  };
};

@Injectable()
export class SprintService {
  getMockSprintData(): SprintMockData {
    const completedItems = [
      'Implemented realtime pipeline updates via Socket.IO gateway',
      'Added pipelines REST endpoint and in-memory mock run generator',
      'Configured global validation and environment-based CORS in Nest bootstrap',
    ];

    const inProgressItems = [
      'Build dashboard pipeline cards in client app',
      'Wire sprint summary button to backend endpoint',
    ];

    const blockers = [
      'Awaiting final Clerk production key for staging environment',
      'Pending Render environment variable setup confirmation',
    ];

    return {
      sprintName: 'Sprint 12 - OpsBoard MVP',
      period: '2026-05-11 to 2026-05-24',
      completedItems,
      inProgressItems,
      blockers,
      metrics: {
        velocityPoints: 21,
        completedCount: completedItems.length,
        inProgressCount: inProgressItems.length,
        blockerCount: blockers.length,
        deploymentSuccessRate: '94%',
      },
    };
  }
}
