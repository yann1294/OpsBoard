import { Show, SignInButton } from "@clerk/nextjs";
import { PipelineFeed } from "@/features/pipelines/pipeline-feed";

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
          <section className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Live pipelines are shown below. Additional dashboard modules will
              be added next.
            </p>
          </section>
          <PipelineFeed />
        </div>
      </Show>
    </>
  );
}
