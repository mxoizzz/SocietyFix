import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { IssueCard } from "@/components/issue-card";
import { IssueDetail } from "@/components/issue-detail";
import { Button } from "@/components/ui/button";
import { useResident } from "@/components/resident-provider";
import type { Issue } from "@/lib/issues";

export const Route = createFileRoute("/my-issues")({
  head: () => ({ meta: [
    { title: "My Issues — SocietyFix" },
    { name: "description", content: "Review your submitted issue reports, timelines, and secretary updates." },
    { property: "og:title", content: "My Issues — SocietyFix" },
    { property: "og:description", content: "Review your submitted issue reports, timelines, and secretary updates." },
  ] }),
  component: MyIssues,
});

function MyIssues() {
  const { issues, resident } = useResident();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const myIssues = useMemo(() => issues.filter((issue) => issue.residentId === resident.id).sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()), [issues, resident.id]);

  return (
    <section>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">My Issues</p>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">Reports from {resident.flat}</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">Open any report to see the full description, timeline, notes, and community votes.</p>
        </div>
        <Button asChild><Link to="/report">Report an Issue</Link></Button>
      </div>
      <div className="mt-8 space-y-4">
        {myIssues.length ? myIssues.map((issue) => <IssueCard key={issue.id} issue={issue} onOpen={setSelectedIssue} compact />) : <div className="rounded-lg border border-border bg-card p-8 text-center"><h2 className="text-xl font-semibold">You haven't reported any issues yet.</h2><p className="mt-2 text-sm text-muted-foreground">When something needs attention, your reports will appear here with clear updates.</p></div>}
      </div>
      <IssueDetail issue={selectedIssue} onClose={() => setSelectedIssue(null)} />
    </section>
  );
}

