"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

type GitHubWorkflowRun = {
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

function getRunBadgeClass(status: string, conclusion: string | null): string {
  if (conclusion === "success") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (conclusion === "failure") {
    return "bg-red-100 text-red-700";
  }

  if (status === "in_progress" || status === "queued") {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-slate-200 text-slate-700";
}

export function GitHubActionsCard() {
  const workflowRunsQuery = useQuery({
    queryKey: ["github-actions-runs"],
    queryFn: () => apiFetch<GitHubWorkflowRun[]>("/integrations/github/actions"),
  });

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          Recent GitHub Workflow Runs
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Optional production-style integration for repository Actions runs.
        </p>
      </div>

      {workflowRunsQuery.isLoading ? (
        <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Loading workflow runs...
        </p>
      ) : null}

      {workflowRunsQuery.isError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Could not load workflow runs. Check GitHub integration environment
          variables.
        </p>
      ) : null}

      {workflowRunsQuery.isSuccess ? (
        workflowRunsQuery.data.length > 0 ? (
          <div className="space-y-3">
            {workflowRunsQuery.data.map((run) => (
              <article
                key={run.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-900">{run.name}</p>
                    <p className="text-xs text-slate-600">
                      {run.branch} · {run.commitSha.slice(0, 7)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getRunBadgeClass(
                      run.status,
                      run.conclusion,
                    )}`}
                  >
                    {run.conclusion ?? run.status}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    Updated {new Date(run.updatedAt).toLocaleString()}
                  </p>
                  <a
                    href={run.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-slate-700 hover:text-slate-900"
                  >
                    View run
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-500">
            No workflow runs available. Set `GITHUB_OWNER` and `GITHUB_REPO` to
            enable this card.
          </p>
        )
      ) : null}
    </section>
  );
}
