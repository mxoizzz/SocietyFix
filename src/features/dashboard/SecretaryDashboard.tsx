import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { categories, statuses, type Issue, type IssueCategory, type IssueStatus } from "./issues";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Copy, LogOut, Download } from "lucide-react";

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

function DashboardSidebar({ active, onChange, profile }: { active: View; onChange: (view: View) => void; profile: any }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
      <div className="border-b border-sidebar-border px-6 py-6">
        <a href="/" className="font-display text-[1.65rem] leading-none text-sidebar-foreground hover:opacity-80 transition-opacity">SocietyFix</a>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Secretary desk</p>
      </div>
      <div className="flex-1 px-3 py-6"><AppNav active={active} onChange={onChange} /></div>
      <div className="border-t border-sidebar-border px-6 py-5">
        <p className="text-sm font-semibold text-sidebar-foreground">{profile?.name || "Secretary"}</p>
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
    [issues.filter((issue) => issue.status === "Resolved" && new Date(issue.updatedAt).getMonth() === new Date().getMonth()).length, "Resolved this month"],
  ];
  const counts = categories.map((category) => ({ category, count: issues.filter((issue) => issue.category === category).length }));
  const max = Math.max(...counts.map((item) => item.count));

  return (
    <section aria-labelledby="overview-title">
      <div className="grid border border-border bg-card sm:grid-cols-2 xl:grid-cols-4 shadow-sm">
        {stats.map(([value, label], index) => (
          <div key={label} className={`min-h-36 p-5 sm:p-6 ${index > 0 ? "border-t border-border sm:border-t-0 sm:border-l" : ""} ${index === 2 ? "sm:border-l-0 sm:border-t xl:border-l xl:border-t-0" : ""} ${index === 3 ? "xl:border-l" : ""}`}>
            <strong className="font-display text-5xl font-medium leading-none text-ink">{value}</strong>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 border border-border bg-card p-5 sm:p-6 shadow-sm">
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="min-w-0"><h2 id="overview-title" className="font-display text-2xl text-ink">Issues by category</h2><p className="mt-1 text-sm text-muted-foreground">Current distribution across the society</p></div>
          <p className="text-xs text-muted-foreground">{issues.length} total records</p>
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-5 sm:items-end">
          {counts.map(({ category, count }) => (
            <div key={category} className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-3 sm:block">
              <p className="text-xs text-muted-foreground sm:mb-3 sm:truncate">{category}</p>
              <div className="h-1.5 overflow-hidden bg-muted sm:h-24 sm:flex sm:items-end" aria-label={`${category}: ${count} issues`}>
                <div className="h-full bg-accent transition-[width,height] duration-500 sm:w-full" style={{ width: `${max > 0 ? (count / max) * 100 : 0}%`, height: undefined }}>
                  <div className="hidden sm:block" style={{ height: `${max > 0 ? (count / max) * 6 : 0}rem` }} />
                </div>
              </div>
              <p className="text-right font-display text-xl text-ink sm:mt-3 sm:text-left">{count}</p>
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
      <Input value={query} onChange={(event) => setQuery(event.target.value.slice(0, 80))} placeholder="Search title, flat or block" aria-label="Search issues" className="h-10 bg-card text-ink" />
      <label className="sr-only" htmlFor="status-filter">Filter by status</label>
      <select id="status-filter" value={status} onChange={(event) => setStatus(event.target.value)} className="dashboard-select"><option value="All">All statuses</option>{statuses.map((item) => <option key={item} value={item}>{item}</option>)}</select>
      <label className="sr-only" htmlFor="category-filter">Filter by category</label>
      <select id="category-filter" value={category} onChange={(event) => setCategory(event.target.value)} className="dashboard-select"><option value="All">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select>
      <Button type="button" variant={sort === "upvotes" ? "default" : "outline"} onClick={() => setSort(sort === "upvotes" ? "updated" : "upvotes")} className="h-10 rounded-sm px-4">{sort === "upvotes" ? "Most upvoted first" : "Sort by most upvoted"}</Button>
    </div>
  );
}

function IssueList({ issues, sort, setSort, onSelect }: { issues: Issue[]; sort: Sort; setSort: (sort: Sort) => void; onSelect: (issue: Issue) => void }) {
  if (!issues.length) return <div className="border-b border-border py-20 text-center"><p className="font-display text-3xl text-ink/40">Nothing needs attention here.</p><p className="mt-3 text-sm text-muted-foreground">Try a broader filter or a different search.</p></div>;
  return (
    <div className="mt-2">
      <div className="hidden overflow-hidden border border-border bg-card shadow-sm md:block">
        <table className="w-full border-collapse text-left text-xs">
          <thead className="bg-muted/60 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground border-b border-border">
            <tr><th className="px-4 py-3">Issue ID</th><th className="px-4 py-3">Title</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Flat / Block</th><th className="px-4 py-3"><button type="button" onClick={() => setSort("upvotes")} className={`cursor-pointer ${sort === "upvotes" ? "text-accent font-bold" : "hover:text-ink"}`}>Upvotes {sort === "upvotes" ? "↓" : ""}</button></th><th className="px-4 py-3">Status</th><th className="px-4 py-3"><button type="button" onClick={() => setSort("reported")} className={`cursor-pointer ${sort === "reported" ? "text-accent font-bold" : "hover:text-ink"}`}>Reported {sort === "reported" ? "↓" : ""}</button></th><th className="px-4 py-3">Updated</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {issues.map((issue) => (
              <tr key={issue.id} onClick={() => onSelect(issue)} tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onSelect(issue); }} className="cursor-pointer transition-colors hover:bg-muted/55 focus:bg-muted/55 focus:outline-none text-ink">
                <td className="whitespace-nowrap px-4 py-4 font-mono font-semibold text-accent/80">SF-{issue.id.substring(0, 4).toUpperCase()}</td><td className="max-w-64 px-4 py-4 font-semibold leading-snug">{issue.title}</td><td className="px-4 py-4 text-muted-foreground capitalize">{issue.category}</td><td className="max-w-36 px-4 py-4 text-muted-foreground">{issue.location}</td><td className="px-4 py-4 font-semibold">{issue.upvotes}</td><td className="px-4 py-4"><StatusBadge status={issue.status} /></td><td className="whitespace-nowrap px-4 py-4 text-muted-foreground">{formatDate(issue.reportedAt)}</td><td className="whitespace-nowrap px-4 py-4 text-muted-foreground">{formatDate(issue.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
      <SheetContent side="right" className="w-full overflow-y-auto bg-background p-0 sm:max-w-2xl [&>button]:right-5 [&>button]:top-5 border-l border-border shadow-2xl">
        <SheetHeader className="border-b border-border bg-card px-5 py-6 pr-14 text-left sm:px-8">
          <p className="text-xs font-mono font-semibold text-accent/80 tracking-widest uppercase">SF-{issue.id.substring(0, 4)} · {issue.category}</p>
          <SheetTitle className="font-display text-3xl font-medium leading-tight text-ink mt-2">{issue.title}</SheetTitle>
          <SheetDescription className="mt-2 text-sm">{issue.location} · Reported {formatDate(issue.reportedAt)}</SheetDescription>
        </SheetHeader>
        <div className="space-y-8 px-5 py-7 sm:px-8 bg-background">
          <section>
            <p className="dashboard-kicker">Issue details</p>
            <p className="mt-3 text-sm leading-7 text-ink/80">{issue.description}</p>
            {issue.photo_url && (
              <div className="mt-5 rounded-lg overflow-hidden border border-border">
                <img src={issue.photo_url} alt="Evidence" className="w-full max-h-80 object-cover" />
              </div>
            )}
            <dl className="mt-5 grid grid-cols-2 gap-y-5 border-y border-border py-5 text-sm"><div><dt className="text-xs text-muted-foreground">Reporter</dt><dd className="mt-1 flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-accent/10 text-accent flex items-center justify-center font-semibold text-[10px]">{issue.reporter.charAt(0)}</span><span className="font-semibold text-ink">{issue.reporter}</span></dd></div><div><dt className="text-xs text-muted-foreground">Upvotes</dt><dd className="mt-1 font-display text-2xl text-ink">{issue.upvotes}</dd></div></dl>
          </section>

          <section className="bg-card border border-border rounded-xl p-5 shadow-sm"><p className="dashboard-kicker">Update issue</p><label htmlFor="detail-status" className="mt-4 block text-xs font-semibold text-ink">Status</label><select id="detail-status" value={status} onChange={(event) => setStatus(event.target.value as IssueStatus)} className="dashboard-select mt-2 bg-background border-border text-ink w-full px-3 py-2.5 rounded-lg">{statuses.map((item) => <option key={item} value={item}>{item}</option>)}</select><label htmlFor="detail-note" className="mt-5 block text-xs font-semibold text-ink">Add a note</label><Textarea id="detail-note" value={note} maxLength={500} onChange={(event) => setNote(event.target.value)} placeholder="Share a concise update with residents..." className="mt-2 min-h-28 bg-background text-ink placeholder:text-muted-foreground w-full rounded-lg" /><div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4"><p role="status" className={`min-w-0 text-xs font-semibold text-accent transition-opacity ${saved ? "opacity-100" : "opacity-0"}`}>Update saved successfully.</p><Button type="button" onClick={submit} className="rounded-lg bg-accent text-background hover:bg-accent/90 px-6 py-2">Save & Notify</Button></div></section>

          <section><p className="dashboard-kicker border-b border-border pb-3 mb-1">Secretary notes</p>{issue.notes?.length ? <ul className="divide-y divide-border">{issue.notes.map((item) => <li key={item.id} className="py-4"><p className="text-sm leading-6 text-ink/90">{item.text}</p><p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground"><span className="font-semibold">{item.author}</span> · {detailDateFormatter.format(new Date(item.at))}</p></li>)}</ul> : <p className="mt-4 text-sm text-muted-foreground">No notes have been added yet.</p>}</section>

        </div>
      </SheetContent>
    </Sheet>
  );
}

function ResidentsView() {
  const [residents, setResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResidents = () => {
      (supabase as any).rpc('get_society_residents').then(({ data, error }: any) => {
        if (data) setResidents(data);
        setLoading(false);
      });
    };
    fetchResidents();

    const channel = supabase.channel('residents-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchResidents)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (loading) return <div className="space-y-5"><Skeleton className="h-64 rounded-xl" /></div>;

  return (
    <section className="animate-in fade-in zoom-in-95 duration-500">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4"><div className="min-w-0"><p className="dashboard-kicker">Society Members</p><h2 className="mt-2 font-display text-3xl text-ink">Registered Residents</h2></div><p className="text-xs text-muted-foreground">{residents.length} total members</p></div>
      <div className="mt-6 overflow-hidden border border-border bg-card shadow-sm rounded-xl">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-muted/60 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground border-b border-border">
            <tr><th className="px-6 py-4">Full Name</th><th className="px-6 py-4">Flat / Block</th><th className="px-6 py-4 text-right">Joined Date</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {residents.map((r, i) => (
              <tr key={i} className="transition-colors hover:bg-muted/30">
                <td className="px-6 py-5 font-semibold text-ink flex items-center gap-3">
                  <span className="h-8 w-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-xs">{r.name.charAt(0)}</span>
                  {r.name}
                </td>
                <td className="px-6 py-5 text-muted-foreground font-medium">{r.flat_number || "Awaiting Update"}</td>
                <td className="px-6 py-5 text-right text-muted-foreground text-xs">{new Date(r.joined_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {residents.length === 0 && (
              <tr><td colSpan={3} className="px-6 py-16 text-center text-muted-foreground border-dashed border-2 rounded-xl">No residents have joined your society yet.<br /><span className="text-xs mt-2 block opacity-70">Share your invite code to get started.</span></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SettingsView({ society, onUpdate }: { society: any, onUpdate: (s: any) => void }) {
  const [name, setName] = useState(society?.name || "");
  const [saving, setSaving] = useState(false);

  const saveSettings = async () => {
    setSaving(true);
    const { data, error } = await (supabase as any).from('societies').update({ name }).eq('id', society.id).select().single();
    if (data) {
      onUpdate(data);
      toast.success("Society settings updated!");
    } else {
      toast.error("Failed to update Settings.");
    }
    setSaving(false);
  };

  return (
    <section className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <p className="dashboard-kicker">Administration</p>
      <h2 className="mt-2 font-display text-3xl text-ink">Society Settings</h2>

      <div className="mt-8 space-y-6">
        <div className="p-6 md:p-8 rounded-2xl border border-border bg-card shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-semibold text-ink">Society Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2.5 w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 text-ink ring-offset-0"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink">Global Invite Code</label>
            <div className="mt-2.5 flex items-center gap-4">
              <code className="rounded-lg border border-border/50 bg-background/50 backdrop-blur px-5 py-3 font-mono text-lg font-bold tracking-[0.2em] text-ink shadow-inner">{society?.invite_code}</code>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">This code is locked. Distribute it strictly to verified building occupants.</p>
            </div>
          </div>
          <div className="pt-6 mt-6 border-t border-border flex justify-end">
            <Button onClick={saveSettings} disabled={saving || name === society?.name} className="rounded-xl px-6 bg-accent text-background hover:bg-accent/90 transition-all font-semibold">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SecretaryDashboard() {
  const { user, profile } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [society, setSociety] = useState<any>(null);

  const [active, setActive] = useState<View>("Overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<Sort>("updated");
  const [loading, setLoading] = useState(true);
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Intl.DateTimeFormat("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date()));
  }, []);

  useEffect(() => {
    if (!profile) return;

    // Fetch Society Details
    if ((profile as any).society_id) {
      (supabase as any).from("societies").select("*").eq("id", (profile as any).society_id).single().then(({ data }: any) => setSociety(data));
    }

    const fetchIssues = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from("issues")
          .select("*, issue_status_events(*), issue_notes(*), issue_upvotes(*)")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Dashboard Fetch Error:", error);
          toast.error("Failed to load society issues.");
        }

        if (data) {
          const mapped: Issue[] = data.map((d: any) => ({
            id: d.id,
            category: d.category.charAt(0).toUpperCase() + d.category.slice(1),
            title: d.title,
            description: d.description,
            location: d.flat_number || "Unknown",
            reporter: d.reporter_name || "Resident",
            status: d.status === "in_progress" ? "In Progress" : d.status === "resolved" ? "Resolved" : "Reported",
            reportedAt: d.created_at,
            updatedAt: d.updated_at,
            photo_url: d.photo_url,
            upvotes: d.issue_upvotes?.length || 0,
            timeline: (d.issue_status_events || []).map((e: any) => ({ label: e.status, at: e.created_at })),
            notes: (d.issue_notes || []).map((n: any) => ({ id: n.id, author: n.author, text: n.text, at: n.created_at }))
          }));
          setIssues(mapped);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();

    // Enable massive real-time network subscriptions for Secretary Data
    const channel = supabase.channel('secretary-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'issues' }, fetchIssues)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'issue_upvotes' }, fetchIssues)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'issue_notes' }, fetchIssues)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [profile]);

  const selected = issues.find((item) => item.id === selectedId) ?? null;

  const filtered = useMemo(() => issues.filter((issue) => {
    const needle = query.trim().toLowerCase();
    const matchesQuery = !needle || `${issue.title} ${issue.location} ${issue.id}`.toLowerCase().includes(needle);
    return matchesQuery && (status === "All" || issue.status === status) && (category === "All" || issue.category.toLowerCase() === category.toLowerCase());
  }).sort((a, b) => sort === "upvotes" ? b.upvotes - a.upvotes : sort === "reported" ? +new Date(b.reportedAt) - +new Date(a.reportedAt) : +new Date(b.updatedAt) - +new Date(a.updatedAt)), [issues, query, status, category, sort]);

  const changeView = (view: View) => { setActive(view); setMenuOpen(false); };

  const downloadCSV = () => {
    const headers = ["Issue ID", "Category", "Title", "Location", "Reporter", "Status", "Upvotes", "Reported At", "Updated At", "Description"];
    const rows = filtered.map(issue => [
      `SF-${issue.id.slice(0, 6).toUpperCase()}`,
      issue.category,
      `"${issue.title.replace(/"/g, '""')}"`,
      `"${issue.location.replace(/"/g, '""')}"`,
      `"${issue.reporter.replace(/"/g, '""')}"`,
      issue.status,
      issue.upvotes,
      new Date(issue.reportedAt).toLocaleString(),
      new Date(issue.updatedAt).toLocaleString(),
      `"${issue.description.replace(/"/g, '""')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SocietyFix_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const saveIssue = async (id: string, nextStatus: IssueStatus, note: string) => {
    // 1. Update Supabase
    const dbStatus = nextStatus === "In Progress" ? "in_progress" : nextStatus === "Resolved" ? "resolved" : "reported";
    await supabase.from("issues").update({ status: dbStatus, updated_at: new Date().toISOString() }).eq("id", id);

    if (note.trim()) {
      await (supabase as any).from("issue_notes").insert({
        issue_id: id,
        text: note.trim(),
        author: profile?.name || "Secretary",
        author_id: user?.id
      });
    }

    // 2. Optimistic Local Update
    const now = new Date().toISOString();
    setIssues((current) => current.map((issue) => {
      if (issue.id !== id) return issue;
      const statusChanged = issue.status !== nextStatus;
      return {
        ...issue,
        status: nextStatus,
        updatedAt: now,
        timeline: statusChanged ? [...issue.timeline, { label: nextStatus === "Resolved" ? "Resolved" : nextStatus === "In Progress" ? "Marked In Progress" : "Marked Reported", at: now }] : issue.timeline,
        notes: note ? [...issue.notes, { id: `local-${Date.now()}`, author: profile?.name || "Secretary", text: note, at: now }] : issue.notes
      };
    }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <DashboardSidebar active={active} onChange={changeView} profile={profile} />
      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
          <div className="grid min-h-20 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 sm:flex sm:px-7 lg:px-10">
            <Button type="button" variant="outline" size="sm" onClick={() => setMenuOpen(true)} className="h-10 rounded-sm px-3 lg:hidden" aria-label="Open navigation">Menu</Button>
            <div className="min-w-0 sm:flex-1"><p className="truncate text-sm font-semibold text-ink">{society?.name || "Loading..."}</p><p className="mt-1 truncate text-xs text-muted-foreground">{today || "Today"}</p></div>
            <div className="flex gap-4 items-center">
              <div className="hidden sm:block border-l border-border pl-4 text-right">
                <p className="text-sm font-semibold text-ink">{profile?.name || "Secretary"}</p>
                <p className="mt-1 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Admin</p>
              </div>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/";
                }}
                className="inline-flex items-center justify-center p-2 rounded border border-border bg-card text-muted-foreground hover:bg-muted hover:text-ink transition-colors"
                title="Log Out"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
        </header>

        {society && (
          <div className="mx-4 sm:mx-7 lg:mx-10 xl:mx-12 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-accent/20 bg-accent/5 px-5 py-4 shadow-sm animate-in fade-in zoom-in-95 duration-500">
            <div>
              <h3 className="font-semibold text-accent flex items-center gap-2">Society Invite Code</h3>
              <p className="text-sm text-muted-foreground mt-1">Share this code with new residents so they can join {society.name}.</p>
            </div>
            <div className="flex items-center gap-3">
              <code className="rounded border border-border/50 bg-background/80 px-4 py-2 font-mono text-lg font-bold tracking-[0.2em] text-ink shadow-inner">{society.invite_code}</code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(society.invite_code);
                  toast.success("Invite code copied to clipboard!");
                }}
                className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background transition hover:bg-accent/90 shadow-md shadow-accent/20"
              >
                <Copy className="size-4" />
                Copy
              </button>
            </div>
          </div>
        )}

        <main className="px-4 py-8 sm:px-7 sm:py-8 lg:px-10 xl:px-12">
          <div className="mx-auto max-w-[92rem]">
            <div className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
              <div className="min-w-0">
                <p className="dashboard-kicker">Secretary console</p>
                <h1 className="mt-2 truncate font-display text-4xl sm:text-5xl text-ink">{active}</h1>
              </div>
              <div className="flex flex-col items-end gap-2">
                {active === "Overview" || active === "All Issues" ? <p className="hidden text-sm font-medium text-muted-foreground sm:block">{issues.filter((issue) => issue.status !== "Resolved").length} active cases</p> : null}
                {(active === "Overview" || active === "All Issues") && (
                  <Button onClick={downloadCSV} variant="outline" size="sm" className="hidden sm:flex text-xs font-semibold gap-1.5 h-8 border-border">
                    <Download className="size-3.5" />
                    Export CSV
                  </Button>
                )}
              </div>
            </div>
            {active === "Residents" ? <ResidentsView /> : active === "Settings" ? <SettingsView society={society} onUpdate={setSociety} /> : loading ? <div className="space-y-5"><div className="grid gap-px sm:grid-cols-4">{[1, 2, 3, 4].map((item) => <Skeleton key={item} className="h-36 rounded-xl" />)}</div><Skeleton className="h-40 rounded-xl mt-8" /><Skeleton className="h-96 rounded-xl mt-8" /></div> : <><Summary issues={issues} /><section className="mt-12" aria-labelledby="issues-title"><div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4"><div className="min-w-0"><p className="dashboard-kicker">Issue register</p><h2 id="issues-title" className="mt-2 font-display text-3xl text-ink">{active === "Overview" ? "Recent and active issues" : "All society issues"}</h2></div><p className="text-xs text-muted-foreground">{filtered.length} shown</p></div><Filters query={query} setQuery={setQuery} status={status} setStatus={setStatus} category={category} setCategory={setCategory} sort={sort} setSort={setSort} /><div className="issue-order-transition"><IssueList issues={active === "Overview" ? filtered.slice(0, 12) : filtered} sort={sort} setSort={setSort} onSelect={(issue) => setSelectedId(issue.id)} /></div></section></>}
          </div>
        </main>
      </div>
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}><SheetContent side="left" className="w-[84vw] max-w-xs p-0 bg-sidebar border-r border-sidebar-border"><SheetHeader className="border-b border-sidebar-border px-6 py-6 text-left"><SheetTitle className="font-display text-2xl text-sidebar-foreground">SocietyFix</SheetTitle><SheetDescription>Secretary desk</SheetDescription></SheetHeader><div className="px-3 py-5"><AppNav active={active} onChange={changeView} mobile /></div></SheetContent></Sheet>
      <IssueDetail issue={selected} open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelectedId(null); }} onSave={saveIssue} />
    </div>
  );
}
