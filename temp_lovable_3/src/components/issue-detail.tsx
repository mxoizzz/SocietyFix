import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { formatIssueDate, formatIssueTime, type Issue } from "@/lib/issues";
import { cn } from "@/lib/utils";

type IssueDetailProps = { issue: Issue | null; onClose: () => void };

export function IssueDetail({ issue, onClose }: IssueDetailProps) {
  const open = Boolean(issue);

  return (
    <div className={cn("fixed inset-0 z-50 transition", open ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!open}>
      <button type="button" aria-label="Close issue details" onClick={onClose} className={cn("absolute inset-0 bg-foreground/20 transition-opacity duration-300", open ? "opacity-100" : "opacity-0")} />
      <aside className={cn("absolute inset-y-0 right-0 flex w-full flex-col bg-card shadow-xl transition-transform duration-300 ease-out sm:max-w-xl", open ? "translate-x-0" : "translate-x-full")}>
        {issue && (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="border-b border-border px-5 py-5 sm:px-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">{issue.category}</span>
                    <StatusBadge status={issue.status} />
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold leading-tight text-foreground">{issue.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{issue.id} · Reported {formatIssueDate(issue.reportedAt)}</p>
                </div>
                <Button type="button" variant="secondary" size="compact" onClick={onClose}>Close</Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Description</h3>
                <p className="mt-3 text-base leading-7 text-foreground">{issue.description}</p>
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-border bg-background p-3"><p className="text-muted-foreground">Reported from</p><p className="mt-1 font-semibold">{issue.flat}</p></div>
                  <div className="rounded-lg border border-border bg-background p-3"><p className="text-muted-foreground">Community votes</p><p className="mt-1 font-semibold">{issue.upvotes}</p></div>
                </div>
              </section>

              <section className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Timeline</h3>
                <div className="mt-4 space-y-4 border-l border-border pl-4">
                  {issue.timeline.map((event) => (
                    <div key={`${event.label}-${event.timestamp}`} className="relative">
                      <span className="absolute -left-[21px] top-1.5 h-3 w-3 rounded-full border-2 border-card bg-primary" />
                      <p className="font-semibold text-foreground">{event.label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{formatIssueTime(event.timestamp)}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-8">
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">Secretary notes</h3>
                {issue.notes.length ? (
                  <div className="mt-4 space-y-3">
                    {issue.notes.map((note) => (
                      <div key={`${note.timestamp}-${note.text}`} className="rounded-lg border border-border bg-background p-4">
                        <p className="leading-6 text-foreground">{note.text}</p>
                        <p className="mt-2 text-xs font-medium text-muted-foreground">{formatIssueTime(note.timestamp)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 rounded-lg border border-border bg-background p-4 text-sm leading-6 text-muted-foreground">No secretary notes have been added yet. Updates will appear here when the team records progress.</p>
                )}
              </section>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
