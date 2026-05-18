"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { apiFetch } from "@/lib/api";

type SprintSummaryResponse = {
  summary: string;
  generatedAt: string;
};

function getFriendlyErrorMessage(error: Error): string {
  if (error.message.includes("401")) {
    return "Your session expired or is invalid. Please sign in again and retry.";
  }

  if (error.message.includes("403")) {
    return "You are not authorized to generate this summary.";
  }

  if (error.message.includes("500")) {
    return "The backend is misconfigured or unavailable. Check server environment variables.";
  }

  if (error.message.includes("502") || error.message.includes("503")) {
    return "AI summary service is currently unavailable. Please retry shortly.";
  }

  return error.message;
}

export function SprintSummaryCard() {
  const { getToken } = useAuth();

  const summaryMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) {
        throw new Error("You must be signed in to generate a summary.");
      }

      return apiFetch<SprintSummaryResponse>("/sprint/summary", { token });
    },
  });

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          AI Sprint Summary
        </h2>
        <button
          type="button"
          onClick={() => summaryMutation.mutate()}
          disabled={summaryMutation.isPending}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {summaryMutation.isPending ? "Generating..." : "Generate Summary"}
        </button>
      </div>

      {summaryMutation.isError ? (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {getFriendlyErrorMessage(summaryMutation.error)}
        </p>
      ) : null}

      {summaryMutation.isPending ? (
        <div className="space-y-3">
          <p className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
            Generating sprint summary from current mock sprint context...
          </p>
          <div className="h-28 animate-pulse rounded-lg border border-slate-200 bg-slate-100" />
        </div>
      ) : null}

      {summaryMutation.isSuccess ? (
        <div className="space-y-3">
          <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 whitespace-pre-wrap text-slate-700">
            {summaryMutation.data.summary}
          </p>
          <p className="text-xs text-slate-500">
            Generated at{" "}
            {new Date(summaryMutation.data.generatedAt).toLocaleString()}
          </p>
        </div>
      ) : !summaryMutation.isPending ? (
        <p className="text-sm text-slate-500">
          Generate a concise sprint update with executive summary, completed
          work, blockers, and next actions.
        </p>
      ) : null}
    </section>
  );
}
