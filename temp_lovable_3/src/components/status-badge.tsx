import { cn } from "@/lib/utils";
import type { IssueStatus } from "@/lib/issues";

const statusClasses: Record<IssueStatus, string> = {
  Reported: "border-reported/30 bg-reported-soft text-reported",
  "In Progress": "border-progress/30 bg-progress-soft text-progress",
  Resolved: "border-resolved/30 bg-resolved-soft text-resolved",
};

export function StatusBadge({ status }: { status: IssueStatus }) {
  return (
    <span className={cn("inline-flex min-h-7 items-center rounded-md border px-2.5 text-xs font-semibold transition-colors duration-300", statusClasses[status])}>
      {status}
    </span>
  );
}
