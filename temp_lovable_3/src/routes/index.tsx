import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { IssueCard } from "@/components/issue-card";
import { IssueSkeletons } from "@/components/skeletons";
import { Button } from "@/components/ui/button";
import { categories, statuses, type IssueCategory, type IssueStatus } from "@/lib/issues";
import { useResident } from "@/components/resident-provider";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Society Feed — SocietyFix Resident Dashboard" },
    { name: "description", content: "Track and support common-area issue reports across Palm Grove Residency." },
    { property: "og:title", content: "Society Feed — SocietyFix Resident Dashboard" },
    { property: "og:description", content: "Track and support common-area issue reports across Palm Grove Residency." },
  ] }),
  component: SocietyFeed,
});

function SocietyFeed() {
  const { issues, toggleVote } = useResident();
  const [status, setStatus] = useState<IssueStatus | "All">("All");
  const [category, setCategory] = useState<IssueCategory | "All">("All");
  const [search, setSearch] = useState("");
  const [sortByVotes, setSortByVotes] = useState(false);
  const [loading, setLoading] = useState(false);

  const filteredIssues = useMemo(() => {
    const query = search.trim().toLowerCase();
    const next = issues.filter((issue) => {
      const matchesStatus = status === "All" || issue.status === status;
      const matchesCategory = category === "All" || issue.category === category;
      const matchesSearch = !query || issue.title.toLowerCase().includes(query) || issue.flat.toLowerCase().includes(query);
      return matchesStatus && matchesCategory && matchesSearch;
    });
    return next.sort((a, b) => sortByVotes ? b.upvotes - a.upvotes : new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime());
  }, [category, issues, search, sortByVotes, status]);

  const changeWithLoading = (action: () => void) => {
    setLoading(true);
    action();
    window.setTimeout(() => setLoading(false), 220);
  };

  return (
    <div>
      <section className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Society Feed</p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">Common-area reports, visible to everyone.</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">See what neighbours have reported, add your vote, and follow what is moving.</p>
          </div>
          <Button type="button" variant={sortByVotes ? "primary" : "secondary"} onClick={() => changeWithLoading(() => setSortByVotes((value) => !value))}>
            {sortByVotes ? "Sorted by votes" : "Most Upvoted"}
          </Button>
        </div>
      </section>

      <section className="mb-6 grid gap-3 rounded-lg border border-border bg-card p-3 sm:grid-cols-[1fr_180px_180px] sm:p-4">
        <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Search</span><input value={search} onChange={(event) => changeWithLoading(() => setSearch(event.target.value))} placeholder="Title or flat number" className="h-12 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20" /></label>
        <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Status</span><select value={status} onChange={(event) => changeWithLoading(() => setStatus(event.target.value as IssueStatus | "All"))} className="h-12 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"><option>All</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Category</span><select value={category} onChange={(event) => changeWithLoading(() => setCategory(event.target.value as IssueCategory | "All"))} className="h-12 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"><option>All</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
      </section>

      {loading ? <IssueSkeletons /> : filteredIssues.length ? <div className="space-y-4 transition-all duration-300">{filteredIssues.map((issue) => <IssueCard key={issue.id} issue={issue} onVote={toggleVote} />)}</div> : <div className="rounded-lg border border-border bg-card p-8 text-center"><h2 className="text-xl font-semibold">No matching reports</h2><p className="mt-2 text-sm text-muted-foreground">Clear a filter or try another flat number to continue.</p></div>}
    </div>
  );
}

