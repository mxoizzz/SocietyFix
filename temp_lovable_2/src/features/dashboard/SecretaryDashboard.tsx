import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { categories, initialIssues, statuses, type Issue, type IssueCategory, type IssueStatus } from "./issues";

type View = "Overview" | "All Issues" | "Residents" | "Settings";
type Sort = "updated" | "upvotes" | "reported";

const dateFormatter = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });
const detailDateFormatter = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function StatusBadge({ status }: { status: IssueStatus }) {
  const className = status === "Reported" ? "status-reported" : status === "In Progress" ? "status-active" : "status-done";
  return <span className={`dashboard-status ${className}`}>{status}</span>;
}

function AppNav({ active, onChange, mobile = false }: { active: View; onChange: (view: View) => void; mobile?: boolean }) {
  return (
    <nav className="space-y-1" aria-label="Secretary navigation">
      {(["Overview", "All Issues", "Residents", "Settings"] as View[]).map((item) => (
        <Button key={item} type="button" variant="ghost" onClick={() => onChange(item)} className={`h-11 w-full justify-start rounded-sm px-3 text-sm ${active === item ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground" : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}>
          <span className={`mr-3 h-1.5 w-1.5 rounded-full transition-colors ${active === item ? "bg-accent" : "bg-border"}`} />
          {item}
          {mobile && (item === "Residents" || item === "Settings") ? <span className="ml-auto text-[10px] font-medium uppercase text-muted-foreground">Soon</span> : null}
        </Button>
      ))}
    </nav>
  );
}

function DashboardSidebar({ active, onChange }: { active: View; onChange: (view: View) => void }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
      <div className="border-b border-sidebar-border px-6 py-6">
        <a href="/" className="font-display text-[1.65rem] leading-none text-sidebar-foreground">SocietyFix</a>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Secretary desk</p>
      </div>
      <div className="flex-1 px-3 py-6"><AppNav active={active} onChange={onChange} /></div>
      <div className="border-t border-sidebar-border px-6 py-5">
        <p className="text-sm font-semibold text-sidebar-foreground">Arjun Mehta</p>
        <p className="mt-1 text-xs text-muted-foreground">Society Secretary</p>
      </div>
    </aside>
  );
}

function Summary({ issues }: { issues: Issue[] }) {
  const stats = [
    [issues.length, "Total issues"],
    [issues.filter((issue) => issue.status === "Reported").length, "Reported"],
    [issues.filter((issue) => issue.status === "In Progress").length, "In progress"],
    [issues.filter((issue) => issue.status === "Resolved" && new Date(issue.updatedAt).getMonth() === 8).length, "Resolved this month"],
  ];
  const counts = categories.map((category) => ({ category, count: issues.filter((issue) => issue.category === category).length }));
  const max = Math.max(...counts.map((item) => item.count));

  return (
    <section aria-labelledby="overview-title">
      <div className="grid border border-border bg-card sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([value, label], index) => (
          <div key={label} className={`min-h-36 p-5 sm:p-6 ${index > 0 ? "border-t border-border sm:border-t-0 sm:border-l" : ""} ${index === 2 ? "sm:border-l-0 sm:border-t xl:border-l xl:border-t-0" : ""} ${index === 3 ? "xl:border-l" : ""}`}>
            <strong className="font-display text-5xl font-medium leading-none">{value}</strong>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 border border-border bg-card p-5 sm:p-6">
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="min-w-0"><h2 id="overview-title" className="font-display text-2xl">Issues by category</h2><p className="mt-1 text-sm text-muted-foreground">Current distribution across the society</p></div>
          <p className="text-xs text-muted-foreground">{issues.length} total records</p>
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-5 sm:items-end">
          {counts.map(({ category, count }) => (
            <div key={category} className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-3 sm:block">
              <p className="text-xs text-muted-foreground sm:mb-3 sm:truncate">{category}</p>
              <div className="h-1.5 overflow-hidden bg-muted sm:h-24 sm:flex sm:items-end" aria-label={`${category}: ${count} issues`}>
                <div className="h-full bg-accent transition-[width,height] duration-500 sm:w-full" style={{ width: `${(count / max) * 100}%`, height: undefined }}>
                  <div className="hidden sm:block" style={{ height: `${(count / max) * 6}rem` }} />
                </div>
              </div>
              <p className="text-right font-display text-xl sm:mt-3 sm:text-left">{count}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Filters({ query, setQuery, status, setStatus, category, setCategory, sort, setSort }: { query: string; setQuery: (value: string) => void; status: string; setStatus: (value: string) => void; category: string; setCategory: (value: string) => void; sort: Sort; setSort: (value: Sort) => void }) {
  return (
    <div className="mt-6 grid gap-3 border-y border-border py-4 xl:grid-cols-[minmax(15rem,1fr)_11rem_11rem_auto]">
      <Input value={query} onChange={(event) => setQuery(event.target.value.slice(0, 80))} placeholder="Search title, flat or block" aria-label="Search issues" className="h-10 bg-card" />
      <label className="sr-only" htmlFor="status-filter">Filter by status</label>
      <select id="status-filter" value={status} onChange={(event) => setStatus(event.target.value)} className="dashboard-select"><option value="All">All statuses</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select>
      <label className="sr-only" htmlFor="category-filter">Filter by category</label>
      <select id="category-filter" value={category} onChange={(event) => setCategory(event.target.value)} className="dashboard-select"><option value="All">All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select>
      <Button type="button" variant={sort === "upvotes" ? "default" : "outline"} onClick={() => setSort(sort === "upvotes" ? "updated" : "upvotes")} className="h-10 rounded-sm px-4">{sort === "upvotes" ? "Most upvoted first" : "Sort by most upvoted"}</Button>
    </div>
  );
}

function IssueList({ issues, sort, setSort, onSelect }: { issues: Issue[]; sort: Sort; setSort: (sort: Sort) => void; onSelect: (issue: Issue) => void }) {
  if (!issues.length) return <div className="border-b border-border py-20 text-center"><p className="font-display text-3xl">Nothing needs attention here.</p><p className="mt-3 text-sm text-muted-foreground">Try a broader filter or a different search.</p></div>;
  return (
    <div className="mt-2">
      <div className="hidden overflow-hidden border border-border bg-card md:block">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="bg-muted/60 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            <tr><th className="px-4 py-3">Issue ID</th><th className="px-4 py-3">Title</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Flat / Block</th><th className="px-4 py-3"><button type="button" onClick={() => setSort("upvotes")} className={`cursor-pointer ${sort === "upvotes" ? "text-accent" : ""}`}>Upvotes {sort === "upvotes" ? "↓" : ""}</button></th><th className="px-4 py-3">Status</th><th className="px-4 py-3"><button type="button" onClick={() => setSort("reported")} className={`cursor-pointer ${sort === "reported" ? "text-accent" : ""}`}>Reported {sort === "reported" ? "↓" : ""}</button></th><th className="px-4 py-3">Updated</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {issues.map((issue) => (
              <tr key={issue.id} onClick={() => onSelect(issue)} tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onSelect(issue); }} className="cursor-pointer transition-colors hover:bg-muted/55 focus:bg-muted/55 focus:outline-none">
                <td className="whitespace-nowrap px-4 py-4 font-semibold text-accent">{issue.id}</td><td className="max-w-64 px-4 py-4 font-semibold leading-snug">{issue.title}</td><td className="px-4 py-4 text-muted-foreground">{issue.category}</td><td className="max-w-36 px-4 py-4 text-muted-foreground">{issue.location}</td><td className="px-4 py-4 font-semibold">{issue.upvotes}</td><td className="px-4 py-4"><StatusBadge status={issue.status} /></td><td className="whitespace-nowrap px-4 py-4 text-muted-foreground">{formatDate(issue.reportedAt)}</td><td className="whitespace-nowrap px-4 py-4 text-muted-foreground">{formatDate(issue.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="divide-y divide-border border-y border-border md:hidden">
        {issues.map((issue) => (
          <button type="button" key={issue.id} onClick={() => onSelect(issue)} className="block w-full bg-background py-5 text-left transition-colors hover:bg-muted/45 focus:bg-muted/45 focus:outline-none">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3"><div className="min-w-0"><p className="text-[11px] font-semibold text-accent">{issue.id} · {issue.category}</p><h3 className="mt-2 font-semibold leading-snug">{issue.title}</h3></div><StatusBadge status={issue.status} /></div>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground"><span>{issue.location}</span><span>{issue.upvotes} upvotes</span><span>Updated {formatDate(issue.updatedAt)}</span></div>
          </button>
        ))}
      </div>
    </div>
  );
}

function IssueDetail({ issue, open, onOpenChange, onSave }: { issue: Issue | null; open: boolean; onOpenChange: (open: boolean) => void; onSave: (id: string, status: IssueStatus, note: string) => void }) {
  const [status, setStatus] = useState<IssueStatus>("Reported");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => { if (issue) { setStatus(issue.status); setNote(""); setSaved(false); } }, [issue]);
  if (!issue) return null;
  const submit = () => {
    const cleanNote = note.trim().slice(0, 500);
    onSave(issue.id, status, cleanNote);
    setNote(""); setSaved(true);
    window.setTimeout(() => setSaved(false), 2600);
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-xl [&>button]:right-5 [&>button]:top-5">
        <SheetHeader className="border-b border-border px-5 py-6 pr-14 text-left sm:px-8">
          <p className="text-xs font-semibold text-accent">{issue.id} · {issue.category}</p>
          <SheetTitle className="font-display text-3xl font-medium leading-tight">{issue.title}</SheetTitle>
          <SheetDescription>{issue.location} · Reported {formatDate(issue.reportedAt)}</SheetDescription>
        </SheetHeader>
        <div className="space-y-8 px-5 py-7 sm:px-8">
          <section><p className="dashboard-kicker">Issue details</p><p className="mt-3 text-sm leading-7 text-foreground/80">{issue.description}</p><dl className="mt-5 grid grid-cols-2 gap-y-5 border-y border-border py-5 text-sm"><div><dt className="text-xs text-muted-foreground">Reporter</dt><dd className="mt-1 font-semibold">{issue.reporter}</dd></div><div><dt className="text-xs text-muted-foreground">Upvotes</dt><dd className="mt-1 font-display text-2xl">{issue.upvotes}</dd></div></dl></section>
          <section><p className="dashboard-kicker">Status timeline</p><ol className="mt-4 border-l border-border pl-5">{issue.timeline.map((event) => <li key={`${event.label}-${event.at}`} className="relative pb-5 last:pb-0 before:absolute before:-left-[1.43rem] before:top-1 before:h-2 before:w-2 before:rounded-full before:bg-accent"><p className="text-sm font-semibold">{event.label}</p><p className="mt-1 text-xs text-muted-foreground">{detailDateFormatter.format(new Date(event.at))}</p></li>)}</ol></section>
          <section><p className="dashboard-kicker">Secretary notes</p>{issue.notes.length ? <ul className="mt-4 divide-y divide-border border-y border-border">{issue.notes.map((item) => <li key={item.id} className="py-4"><p className="text-sm leading-6">{item.text}</p><p className="mt-2 text-xs text-muted-foreground">{item.author} · {detailDateFormatter.format(new Date(item.at))}</p></li>)}</ul> : <p className="mt-3 text-sm text-muted-foreground">No notes have been added yet.</p>}</section>
          <section className="bg-surface-warm p-5"><p className="dashboard-kicker">Update issue</p><label htmlFor="detail-status" className="mt-4 block text-xs font-semibold">Status</label><select id="detail-status" value={status} onChange={(event) => setStatus(event.target.value as IssueStatus)} className="dashboard-select mt-2 bg-card">{statuses.map((item) => <option key={item}>{item}</option>)}</select><label htmlFor="detail-note" className="mt-5 block text-xs font-semibold">Add a note</label><Textarea id="detail-note" value={note} maxLength={500} onChange={(event) => setNote(event.target.value)} placeholder="Share a concise update with residents" className="mt-2 min-h-28 bg-card" /><div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4"><p role="status" className={`min-w-0 text-xs font-semibold text-accent transition-opacity ${saved ? "opacity-100" : "opacity-0"}`}>Update saved locally.</p><Button type="button" onClick={submit} className="rounded-sm">Save update</Button></div></section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Placeholder({ view }: { view: "Residents" | "Settings" }) {
  return <section className="grid min-h-[60vh] place-items-center border-y border-border text-center"><div><p className="dashboard-kicker">{view}</p><h2 className="mt-4 font-display text-4xl">This workspace is being prepared.</h2><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">The {view.toLowerCase()} area will appear here when it is ready for the committee.</p></div></section>;
}

export function SecretaryDashboard() {
  const [issues, setIssues] = useState(initialIssues);
  const [active, setActive] = useState<View>("Overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<Sort>("updated");
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState("");

  useEffect(() => { setToday(new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date())); const id = window.setTimeout(() => setLoading(false), 650); return () => window.clearTimeout(id); }, []);
  const selected = issues.find((item) => item.id === selectedId) ?? null;
  const filtered = useMemo(() => issues.filter((issue) => {
    const needle = query.trim().toLowerCase();
    const matchesQuery = !needle || `${issue.title} ${issue.location} ${issue.id}`.toLowerCase().includes(needle);
    return matchesQuery && (status === "All" || issue.status === status) && (category === "All" || issue.category === category);
  }).sort((a, b) => sort === "upvotes" ? b.upvotes - a.upvotes : sort === "reported" ? +new Date(b.reportedAt) - +new Date(a.reportedAt) : +new Date(b.updatedAt) - +new Date(a.updatedAt)), [issues, query, status, category, sort]);

  const changeView = (view: View) => { setActive(view); setMenuOpen(false); };
  const saveIssue = (id: string, nextStatus: IssueStatus, note: string) => {
    const now = new Date().toISOString();
    setIssues((current) => current.map((issue) => {
      if (issue.id !== id) return issue;
      const statusChanged = issue.status !== nextStatus;
      return { ...issue, status: nextStatus, updatedAt: now, timeline: statusChanged ? [...issue.timeline, { label: nextStatus === "Resolved" ? "Resolved" : nextStatus === "In Progress" ? "Marked In Progress" : "Marked Reported", at: now }] : issue.timeline, notes: note ? [...issue.notes, { id: `local-${Date.now()}`, author: "Arjun Mehta", text: note, at: now }] : issue.notes };
    }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardSidebar active={active} onChange={changeView} />
      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 border-b border-border bg-background/95">
          <div className="grid min-h-20 grid-cols-[auto_minmax(0,1fr)] items-center gap-3 px-4 sm:flex sm:px-7 lg:px-10">
            <Button type="button" variant="outline" size="sm" onClick={() => setMenuOpen(true)} className="h-10 rounded-sm px-3 lg:hidden" aria-label="Open navigation">Menu</Button>
            <div className="min-w-0 sm:flex-1"><p className="truncate text-sm font-semibold">Oakview Residency</p><p className="mt-1 truncate text-xs text-muted-foreground">{today || "Today"}</p></div>
            <div className="col-span-2 border-t border-border pt-3 pb-3 text-right sm:col-span-1 sm:border-0 sm:p-0"><p className="text-sm font-semibold">Arjun Mehta</p><p className="mt-1 text-xs text-muted-foreground">Secretary</p></div>
          </div>
        </header>
        <main className="px-4 py-8 sm:px-7 sm:py-10 lg:px-10 xl:px-12">
          <div className="mx-auto max-w-[92rem]">
            <div className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4"><div className="min-w-0"><p className="dashboard-kicker">Secretary dashboard</p><h1 className="mt-2 truncate font-display text-4xl sm:text-5xl">{active}</h1></div>{active === "Overview" || active === "All Issues" ? <p className="hidden text-sm text-muted-foreground sm:block">{issues.filter((issue) => issue.status !== "Resolved").length} issues need attention</p> : null}</div>
            {active === "Residents" || active === "Settings" ? <Placeholder view={active} /> : loading ? <div className="space-y-5"><div className="grid gap-px sm:grid-cols-4">{[1,2,3,4].map((item) => <Skeleton key={item} className="h-36 rounded-none" />)}</div><Skeleton className="h-40 rounded-none" /><Skeleton className="h-96 rounded-none" /></div> : <><Summary issues={issues} /><section className="mt-12" aria-labelledby="issues-title"><div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4"><div className="min-w-0"><p className="dashboard-kicker">Issue register</p><h2 id="issues-title" className="mt-2 font-display text-3xl">{active === "Overview" ? "Recent and active issues" : "All society issues"}</h2></div><p className="text-xs text-muted-foreground">{filtered.length} shown</p></div><Filters query={query} setQuery={setQuery} status={status} setStatus={setStatus} category={category} setCategory={setCategory} sort={sort} setSort={setSort} /><div className="issue-order-transition"><IssueList issues={active === "Overview" ? filtered.slice(0, 12) : filtered} sort={sort} setSort={setSort} onSelect={(issue) => setSelectedId(issue.id)} /></div></section></>}
          </div>
        </main>
      </div>
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}><SheetContent side="left" className="w-[84vw] max-w-xs p-0"><SheetHeader className="border-b border-border px-6 py-6 text-left"><SheetTitle className="font-display text-2xl">SocietyFix</SheetTitle><SheetDescription>Secretary desk</SheetDescription></SheetHeader><div className="px-3 py-5"><AppNav active={active} onChange={changeView} mobile /></div></SheetContent></Sheet>
      <IssueDetail issue={selected} open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelectedId(null); }} onSave={saveIssue} />
    </div>
  );
}
