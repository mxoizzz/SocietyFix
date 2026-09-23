export function IssueSkeletons() {
  return (
    <div className="space-y-4" aria-label="Loading issues">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="rounded-lg border border-border bg-card p-5">
          <div className="flex gap-2"><div className="h-7 w-20 animate-pulse rounded-md bg-muted" /><div className="h-7 w-24 animate-pulse rounded-md bg-muted" /></div>
          <div className="mt-4 h-6 w-3/4 animate-pulse rounded-md bg-muted" />
          <div className="mt-3 h-4 w-full animate-pulse rounded-md bg-muted" />
          <div className="mt-2 h-4 w-2/3 animate-pulse rounded-md bg-muted" />
        </div>
      ))}
    </div>
  );
}
