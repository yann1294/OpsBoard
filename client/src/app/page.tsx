import { Show, SignInButton } from "@clerk/nextjs";
import { PipelineFeed } from "@/features/pipelines/pipeline-feed";
import { SprintSummaryCard } from "@/features/sprint-summary/sprint-summary-card";

export default function Home() {
  return (
    <>
      <Show when="signed-out">
        <section className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Welcome to OpsBoard
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Sign in to access the dashboard workspace for pipeline monitoring
            and sprint reporting.
          </p>
          <div className="mt-6">
            <SignInButton mode="modal">
              <button
                type="button"
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                Sign in to continue
              </button>
            </SignInButton>
          </div>
        </section>
      </Show>
      <Show when="signed-in">
        <div className="space-y-6">
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-8 text-white">
              <h1 className="text-3xl font-semibold tracking-tight">
                Engineering Operations Dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
                Track CI/CD execution in real time and generate concise AI
                sprint summaries to keep delivery status clear for the team.
              </p>
            </div>
            <div className="border-t border-slate-200 bg-slate-50 px-8 py-4">
              <p className="text-sm text-slate-700">
                <span className="font-semibold">Demo flow:</span> sign in, watch
                live pipeline updates on the left, then generate an AI sprint
                summary on the right.
              </p>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Pipeline Success Rate
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-emerald-600">
                82%
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Avg Build Time
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                2m 18s
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Open PRs
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-blue-600">
                4
              </p>
            </article>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Live Pipeline Feed
              </h2>
              <PipelineFeed />
            </div>
            <div className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                AI Sprint Summary
              </h2>
              <SprintSummaryCard />
            </div>
          </section>
        </div>
      </Show>
    </>
  );
}
