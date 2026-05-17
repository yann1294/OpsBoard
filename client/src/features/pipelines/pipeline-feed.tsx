"use client";

import { useEffect, useMemo, useState } from "react";
import { createSocket } from "@/lib/socket";
import type { PipelineRun, PipelineStatus } from "@/types/pipeline";

const MAX_RUNS = 8;

const statusStyles: Record<PipelineStatus, string> = {
  success: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
  running: "bg-blue-100 text-blue-700",
  queued: "bg-amber-100 text-amber-700",
};

export function PipelineFeed() {
  const [isLive, setIsLive] = useState(false);
  const [runs, setRuns] = useState<PipelineRun[]>([]);

  useEffect(() => {
    const socket = createSocket();

    socket.on("connect", () => setIsLive(true));
    socket.on("disconnect", () => setIsLive(false));
    socket.on("connect_error", () => setIsLive(false));

    socket.on("pipeline:snapshot", (snapshot: PipelineRun[]) => {
      setRuns(snapshot.slice(0, MAX_RUNS));
    });

    socket.on("pipeline:update", (update: PipelineRun) => {
      setRuns((currentRuns) => [update, ...currentRuns].slice(0, MAX_RUNS));
    });

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  const liveLabel = useMemo(() => (isLive ? "Live" : "Offline"), [isLive]);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          Pipeline Feed
        </h2>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            isLive
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-200 text-slate-700"
          }`}
        >
          {liveLabel}
        </span>
      </div>

      <div className="space-y-3">
        {runs.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-500">
            Waiting for pipeline events...
          </p>
        ) : (
          runs.map((run) => (
            <article
              key={run.id}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900">{run.service}</p>
                  <p className="text-xs text-slate-600">
                    {run.branch} · {run.commit}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusStyles[run.status]}`}
                >
                  {run.status}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Duration: {run.durationSeconds}s
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
