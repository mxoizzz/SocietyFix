import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { formatIssueDate, type Issue } from "@/lib/issues";
import { cn } from "@/lib/utils";

type IssueCardProps = {
  issue: Issue;
  onVote?: (id: string) => void;
  onOpen?: (issue: Issue) => void;
  compact?: boolean;
};

export function IssueCard({ issue, onVote, onOpen, compact = false }: IssueCardProps) {
  const [pulse, setPulse] = useState(false);

  const handleVote = () => {
    onVote?.(issue.id);
    setPulse(true);
    window.setTimeout(() => setPulse(false), 260);
  };

  return (
    <article className="rounded-lg border border-border bg-card p-4 shadow-sm transition-all duration-300 ease-out hover:border-primary/25 hover:shadow-md sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <button type="button" onClick={() => onOpen?.(issue)} className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">{issue.category}</span>
            <StatusBadge status={issue.status} />
          </div>
          <h2 className="mt-3 text-lg font-semibold leading-snug text-foreground sm:text-xl">{issue.title}</h2>
          {!compact && <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{issue.description}</p>}
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-muted-foreground">
            <span>{issue.flat}</span>
            <span>{formatIssueDate(issue.reportedAt)}</span>
            <span>{issue.id}</span>
          </div>
        </button>
        {onVote && (
          <Button
            type="button"
            variant={issue.voted ? "voted" : "vote"}
            size="compact"
            onClick={handleVote}
            aria-pressed={issue.voted}
            className={cn("shrink-0 transition-transform", pulse && "vote-pulse")}
          >
            {issue.voted ? "Voted" : "Upvote"} · {issue.upvotes}
          </Button>
        )}
      </div>
    </article>
  );
}
