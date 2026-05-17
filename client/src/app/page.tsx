export default function Home() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Frontend shell ready
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
        This is the base App Router layout for OpsBoard. Next steps will add
        Clerk auth, pipeline realtime cards, and sprint summary actions.
      </p>
    </div>
  );
}
