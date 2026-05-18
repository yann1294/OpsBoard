export type SimplifiedWorkflowRun = {
  id: number;
  name: string;
  status: string;
  conclusion: string | null;
  branch: string;
  commitSha: string;
  htmlUrl: string;
  createdAt: string;
  updatedAt: string;
};
