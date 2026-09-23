import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { IssueDetailsDialog } from "@/components/IssueDetailsDialog";
import { Loader2 } from "lucide-react";

type Tab = "Society Feed" | "My Issues" | "Report" | "Profile";

const navItems = ["Society Feed", "My Issues", "Report", "Profile"] as const;

export function ResidentDashboard({ issues }: { issues: any[] }) {
    const { user, profile } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>("Society Feed");
    const [selectedIssue, setSelectedIssue] = useState<any | null>(null);

    const societyName = (profile as any)?.society_name || "Society Dashboard"; // fallback if society unjoined

    return (
        <div className="min-h-screen bg-background text-ink font-sans">
            {/* Desktop Sidebar (Synced to Secretary Dashboard Aesthetics) */}
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
                <div className="border-b border-sidebar-border px-6 py-6 border-b">
                    <a href="/" className="font-display text-[1.65rem] leading-none text-sidebar-foreground hover:opacity-80 transition-opacity">SocietyFix</a>
                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Resident Desk</p>
                </div>
                <div className="flex-1 px-3 py-6">
                    <nav className="space-y-1" aria-label="Resident navigation">
                        {navItems.map((item) => (
                            <button
                                key={item}
                                onClick={() => setActiveTab(item)}
                                className={`flex items-center h-11 w-full justify-start rounded-sm px-3 text-sm transition-colors ${activeTab === item ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground" : "text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
                            >
                                <span className={`mr-3 h-1.5 w-1.5 rounded-full transition-colors ${activeTab === item ? "bg-accent" : "bg-border"}`} />
                                {item}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="border-t border-sidebar-border px-6 py-5">
                    <p className="text-sm font-semibold text-sidebar-foreground truncate">{profile?.name || "Resident"}</p>
                    <p className="mt-1 text-xs text-muted-foreground truncate opacity-80">Flat {profile?.flat_number || "Pending"}</p>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:pl-60 flex flex-col min-h-screen pb-20 lg:pb-0">
                <header className="sticky top-0 z-30 border-b border-card/40 bg-background/80 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-10">
                    <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
                        <div>
                            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">Resident Portal</p>
                            <p className="mt-1 text-base font-bold text-ink sm:text-lg">{activeTab}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-ink">{profile?.name || "Resident"}</p>
                            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Flat {profile?.flat_number}</p>
                        </div>
                    </div>
                </header>

                <main className="mx-auto w-full max-w-5xl px-4 pt-6 sm:px-6 lg:px-10 lg:pt-10 flex-1">
                    {activeTab === "Society Feed" && (
                        <SocietyFeedView issues={issues} onSelect={(issue) => setSelectedIssue(issue)} user={user} />
                    )}
                    {activeTab === "My Issues" && (
                        <MyIssuesView issues={issues} onSelect={(issue) => setSelectedIssue(issue)} user={user} />
                    )}
                    {activeTab === "Report" && (
                        <ReportView user={user} profile={profile} onComplete={() => setActiveTab("My Issues")} />
                    )}
                    {activeTab === "Profile" && (
                        <ProfileView profile={profile} />
                    )}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-card/40 bg-background/90 px-2 py-2 shadow-2xl backdrop-blur-2xl lg:hidden">
                <div className="flex gap-1">
                    {navItems.map((item) => (
                        <button
                            key={item}
                            onClick={() => setActiveTab(item)}
                            className={`flex min-h-14 flex-1 items-center justify-center rounded-xl px-2 text-center text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all ${activeTab === item ? "bg-accent text-primary-foreground shadow-lg shadow-accent/20" : "text-muted-foreground hover:bg-card hover:text-ink"}`}
                        >
                            <span className="truncate">{item === "Society Feed" ? "Feed" : item}</span>
                        </button>
                    ))}
                </div>
            </nav>

            <IssueDetailsDialog issue={selectedIssue} open={!!selectedIssue} onOpenChange={(o) => { if (!o) setSelectedIssue(null); }} />
        </div>
    );
}

// ---------------------------------------------------------
// REUSABLE ISSUE CARD (Matching Lovable + Our Styles)
// ---------------------------------------------------------
function ResidentIssueCard({ issue, user, onSelect }: { issue: any, user: any, onSelect: () => void }) {
    const hasUpvoted = issue.issue_upvotes?.some((u: any) => u.user_id === user?.id) || false;

    return (
        <article
            onClick={onSelect}
            className="group cursor-pointer rounded-2xl border border-card/70 bg-card/65 p-5 sm:p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-2xl transition-all duration-300 ease-out hover:border-accent/40 hover:shadow-xl hover:shadow-accent/5 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between animate-in fade-in"
        >
            <div className="min-w-0 flex-1 text-left flex flex-col">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center rounded-md bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent ring-1 ring-inset ring-accent/20 capitalize">
                        {issue.category}
                    </span>
                    <span
                        className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${issue.status === "resolved"
                            ? "bg-green-500/10 text-green-600 ring-green-500/20"
                            : issue.status === "in_progress"
                                ? "bg-amber-500/10 text-amber-600 ring-amber-500/20"
                                : "bg-blue-500/10 text-blue-600 ring-blue-500/20"
                            }`}
                    >
                        {issue.status.replace("_", " ")}
                    </span>
                </div>
                <h2 className="mt-4 font-display text-xl md:text-2xl font-bold leading-snug text-ink">{issue.title}</h2>
                <p className="mt-2.5 line-clamp-2 text-sm leading-6 text-muted-foreground">{issue.description}</p>
                {issue.photo_url && (
                    <div className="mt-3 overflow-hidden rounded-xl border border-card/40 max-h-48 sm:max-w-sm">
                        <img src={issue.photo_url} alt="Evidence" className="h-full w-full object-cover" />
                    </div>
                )}
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-80">
                    <span>Flat {issue.flat_number}</span>
                    <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                    <span>SF-{issue.id.slice(0, 6).toUpperCase()}</span>
                </div>
            </div>

            <button
                onClick={async (e) => {
                    e.stopPropagation();
                    if (hasUpvoted) {
                        await (supabase as any).from("issue_upvotes").delete().eq("issue_id", issue.id).eq("user_id", user?.id);
                    } else {
                        await (supabase as any).from("issue_upvotes").insert({ issue_id: issue.id, user_id: user?.id });
                    }
                    // Real-time invalidation handles the UI refresh automatically now.
                }}
                className={`shrink-0 transition-all flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm w-full sm:w-auto justify-center sm:justify-start ${hasUpvoted ? "bg-accent/15 text-accent border border-accent/20" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`}
            >
                {hasUpvoted ? "Voted" : "Upvote"} · {issue.issue_upvotes?.length || 0}
            </button>
        </article>
    );
}

// ---------------------------------------------------------
// 1. SOCIETY FEED VIEW (Lovable Filters Format)
// ---------------------------------------------------------
function SocietyFeedView({ issues, onSelect, user }: { issues: any[], onSelect: (issue: any) => void, user: any }) {
    const [statusFilter, setStatusFilter] = useState("All");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [sortByVotes, setSortByVotes] = useState(false);

    const filteredIssues = useMemo(() => {
        if (!issues) return [];
        let result = issues.filter(issue => {
            const matchesStatus = statusFilter === "All" || issue.status === statusFilter;
            const matchesCategory = categoryFilter === "All" || issue.category === categoryFilter;
            const matchesSearch = !search || issue.title.toLowerCase().includes(search.toLowerCase()) || issue.flat_number.toLowerCase().includes(search.toLowerCase());
            return matchesStatus && matchesCategory && matchesSearch;
        });
        if (sortByVotes) {
            result = result.sort((a, b) => (b.issue_upvotes?.length || 0) - (a.issue_upvotes?.length || 0));
        } else {
            result = result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
        return result;
    }, [issues, statusFilter, categoryFilter, search, sortByVotes]);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="mb-8">
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Society Feed</p>
                <div className="mt-3 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight text-ink max-w-2xl">
                            Common-area reports, visible to everyone.
                        </h1>
                        <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                            See what neighbours have reported, add your vote, and follow what is moving.
                        </p>
                    </div>
                    <button
                        onClick={() => setSortByVotes(!sortByVotes)}
                        className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-[0.12em] px-6 py-3.5 rounded-xl border transition-all h-fit ${sortByVotes ? "bg-accent text-background shadow-lg shadow-accent/20 border-accent/20" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`}
                    >
                        {sortByVotes ? "Sorted by votes" : "Most Upvoted"}
                    </button>
                </div>
            </section>

            <section className="mb-8 grid gap-4 rounded-2xl border border-card/40 bg-card/20 p-4 ring-1 ring-black/5 backdrop-blur-md sm:grid-cols-[1fr_180px_180px]">
                <label className="block">
                    <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Search</span>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Title or flat number"
                        className="w-full rounded-xl border border-card/70 bg-background/50 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-accent/30 text-ink"
                    />
                </label>
                <label className="block">
                    <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</span>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full rounded-xl border border-card/70 bg-background/50 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-accent/30 text-ink"
                    >
                        <option value="All">All Statuses</option>
                        <option value="reported">Reported</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </label>
                <label className="block">
                    <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Category</span>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full rounded-xl border border-card/70 bg-background/50 px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-accent/30 text-ink"
                    >
                        <option value="All">All Categories</option>
                        <option value="electrical">Electrical</option>
                        <option value="plumbing">Plumbing</option>
                        <option value="cleanliness">Cleanliness</option>
                        <option value="security">Security</option>
                        <option value="other">Other</option>
                    </select>
                </label>
            </section>

            <div className="space-y-4">
                {!filteredIssues || filteredIssues.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-ink/20 bg-card/30 p-12 text-center backdrop-blur-sm animate-in fade-in">
                        <h3 className="font-display text-xl font-semibold">No matching reports</h3>
                        <p className="mt-2 text-sm text-muted-foreground">Clear a filter or try another flat number to continue.</p>
                    </div>
                ) : (
                    filteredIssues.map((issue) => <ResidentIssueCard key={issue.id} issue={issue} user={user} onSelect={() => onSelect(issue)} />)
                )}
            </div>
        </div>
    );
}

// ---------------------------------------------------------
// 2. MY ISSUES VIEW (Lovable Dedicated My-Issues Format)
// ---------------------------------------------------------
function MyIssuesView({ issues, onSelect, user }: { issues: any[], onSelect: (issue: any) => void, user: any }) {
    const myIssues = useMemo(() => issues.filter((issue) => issue.reported_by === user?.id).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()), [issues, user]);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="mb-8">
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">My Issues</p>
                <div className="mt-3 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="font-display text-4xl sm:text-5xl font-bold leading-tight text-ink max-w-2xl">
                            Your Personal Reports
                        </h1>
                        <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                            Review your submitted issue reports, track timelines, and see direct secretary updates.
                        </p>
                    </div>
                </div>
            </section>

            <div className="space-y-4">
                {!myIssues || myIssues.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-ink/20 bg-card/30 p-12 text-center backdrop-blur-sm animate-in fade-in">
                        <h3 className="font-display text-xl font-semibold">You haven't reported any issues yet.</h3>
                        <p className="mt-2 text-sm text-muted-foreground">When something needs attention, your reports will appear here with secure trackability.</p>
                    </div>
                ) : (
                    myIssues.map((issue) => <ResidentIssueCard key={issue.id} issue={issue} user={user} onSelect={() => onSelect(issue)} />)
                )}
            </div>
        </div>
    );
}

// ---------------------------------------------------------
// 3. REPORT ISSUE FORM VIEW (Lovable Dedicated Form Format)
// ---------------------------------------------------------
function ReportView({ user, profile, onComplete }: { user: any, profile: any, onComplete: () => void }) {
    const [category, setCategory] = useState("electrical");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [flat, setFlat] = useState(profile?.flat_number || "");
    const [photo, setPhoto] = useState<File | null>(null);
    const [busy, setBusy] = useState(false);

    const canSubmit = title.trim().length > 3 && description.trim().length > 8 && flat.trim().length > 1;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!user || !canSubmit) return;
        setBusy(true);
        try {
            let photoUrl = null;
            if (photo) {
                const fileExt = photo.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage.from('issue_evidence').upload(fileName, photo);
                if (uploadError) throw new Error("Failed to upload photo evidence.");
                photoUrl = supabase.storage.from('issue_evidence').getPublicUrl(fileName).data.publicUrl;
            }

            const { error } = await (supabase as any)
                .from("issues")
                .insert({
                    society_id: (profile as any)?.society_id,
                    reported_by: user.id,
                    reporter_name: profile?.name ?? "Resident",
                    flat_number: flat,
                    category,
                    title,
                    description,
                    photo_url: photoUrl,
                });
            if (error) throw error;
            toast.success("Successfully Reported!");
            // Switch tabs gracefully; the websocket listener immediately populates the feed
            onComplete();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Could not submit issue");
            setBusy(false);
        }
    };

    return (
        <section className="mx-auto max-w-3xl animate-in fade-in zoom-in-95 duration-500">
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Report an Issue</p>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold leading-tight text-ink max-w-2xl">
                Send a detailed report in under a minute.
            </h1>

            <form onSubmit={handleSubmit} className="mt-10 rounded-2xl border border-card/40 bg-card/20 p-5 sm:p-8 shadow-sm ring-1 ring-black/5 backdrop-blur-2xl">
                <div className="grid gap-6 sm:grid-cols-2">
                    <label className="block">
                        <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Category</span>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-12 w-full rounded-xl border border-card/70 bg-background/80 px-4 text-sm outline-none transition focus:ring-2 focus:ring-accent/50 text-ink">
                            <option value="electrical">Electrical</option>
                            <option value="plumbing">Plumbing</option>
                            <option value="cleanliness">Cleanliness</option>
                            <option value="security">Security</option>
                            <option value="other">Other</option>
                        </select>
                    </label>
                    <label className="block">
                        <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Flat / Block Number</span>
                        <input value={flat} onChange={(e) => setFlat(e.target.value)} className="h-12 w-full rounded-xl border border-card/70 bg-background/80 px-4 text-sm outline-none transition focus:ring-2 focus:ring-accent/50 text-ink" />
                    </label>
                    <label className="sm:col-span-2 block">
                        <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Title</span>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short technical summary" className="h-12 w-full rounded-xl border border-card/70 bg-background/80 px-4 text-sm outline-none transition focus:ring-2 focus:ring-accent/50 text-ink" />
                    </label>
                    <label className="sm:col-span-2 block">
                        <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Extensive Description</span>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What failed, where is it located, and when did it start?" rows={5} className="w-full resize-none rounded-xl border border-card/70 bg-background/80 px-4 py-4 text-sm outline-none transition focus:ring-2 focus:ring-accent/50 text-ink" />
                    </label>
                    <label className="sm:col-span-2 block">
                        <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Photo Evidence (Optional)</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                            className="h-12 w-full pt-2 rounded-xl border border-card/70 bg-background/80 px-4 text-sm outline-none transition focus:ring-2 focus:ring-accent/50 text-ink file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-wider file:bg-accent/10 file:text-accent hover:file:bg-accent/20 cursor-pointer"
                        />
                    </label>
                </div>
                <button type="submit" disabled={!canSubmit || busy} className="mt-8 flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-accent px-10 py-4 text-sm font-bold text-background shadow-lg shadow-accent/20 transition-all hover:bg-accent/90 hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none">
                    {busy && <Loader2 className="size-4 animate-spin" />}
                    {busy ? "Transmitting..." : "Submit Report"}
                </button>
            </form>
        </section>
    );
}

// ---------------------------------------------------------
// 4. PROFILE VIEW
// ---------------------------------------------------------
function ProfileView({ profile }: { profile: any }) {
    return (
        <section className="mx-auto max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Profile Area</p>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold leading-tight text-ink">
                Resident Details
            </h1>

            <div className="mt-10 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-ink">Registered Full Name</label>
                        <p className="mt-1 text-muted-foreground border-b border-border pb-3">{profile?.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-ink">Unit Allocation</label>
                        <p className="mt-1 text-muted-foreground border-b border-border pb-3">{profile?.flat_number}</p>
                    </div>

                    <div className="pt-6">
                        <button
                            onClick={async () => {
                                await supabase.auth.signOut();
                                window.location.href = "/";
                            }}
                            className="inline-flex w-full sm:w-auto mt-2 items-center justify-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-sm font-bold text-background transition hover:bg-accent/90"
                        >
                            Log Out Securely
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
