export type PipelineStatus = "success" | "failed" | "running" | "queued";

export type PipelineRun = {
  id: string;
  service: string;
  branch: string;
  commit: string;
  status: PipelineStatus;
  durationSeconds: number;
  triggeredBy: string;
  createdAt: string;
};
