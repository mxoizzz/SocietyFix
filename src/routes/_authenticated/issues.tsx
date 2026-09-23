import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { IssueDetailsDialog } from "@/components/IssueDetailsDialog";
import { Database } from "@/integrations/supabase/types";

type Issue = Database["public"]["Tables"]["issues"]["Row"];

export const Route = createFileRoute("/_authenticated/issues")({
    component: IssuesDashboard,
});

function IssuesDashboard() {
    const { user, role, loading: authLoading } = useAuth();
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data: issues, isLoading } = useQuery({
        queryKey: ["issues", role, user?.id],
        queryFn: async () => {
            if (role === "secretary") {
                const { data, error } = await supabase
                    .from("issues")
                    .select("*")
                    .order("created_at", { ascending: false });
                if (error) throw error;
                return data;
            } else {
                const { data, error } = await supabase
                    .from("issues")
                    .select("*")
                    .eq("reported_by", user?.id || "")
                    .order("created_at", { ascending: false });
                if (error) throw error;
                return data;
            }
        },
        enabled: !!user && !!role,
    });

    if (authLoading || isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="size-8 animate-spin text-brand" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-ink">
            <div className="mx-auto max-w-5xl px-5 py-12">
                <div className="flex items-center justify-between border-b pb-6 border-ink/10">
                    <div>
                        <Link
                            to="/"
                            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-ink"
                        >
                            <ArrowLeft className="size-4" />
                            Back to Home
                        </Link>
                        <h1 className="font-display text-3xl font-bold">
                            {role === "secretary" ? "Society Issues Dashboard" : "My Reported Issues"}
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            {role === "secretary"
                                ? "Manage and update ongoing problems in the society."
                                : "Track the real-time status of the issues you've reported."}
                        </p>
                    </div>
                    {role === "resident" && (
                        <Link
                            to="/report"
                            className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-brand/20 transition-all hover:bg-brand/90 hover:-translate-y-0.5"
                        >
                            <Plus className="size-4" />
                            Report Issue
                        </Link>
                    )}
                </div>

                <div className="mt-8">
                    {!issues || issues.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-ink/20 bg-card/30 p-12 text-center backdrop-blur-sm">
                            <h3 className="font-display text-lg font-semibold">No issues found</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {role === "secretary"
                                    ? "There are no active issues reported by residents right now."
                                    : "You haven't reported any issues yet."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {issues.map((issue) => (
                                <div
                                    key={issue.id}
                                    onClick={() => {
                                        setSelectedIssue(issue);
                                        setIsDialogOpen(true);
                                    }}
                                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-card/70 bg-card/65 p-5 ring-1 ring-black/5 backdrop-blur-2xl transition-all hover:shadow-xl hover:shadow-brand/5 cursor-pointer"
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-4">
                                            <span className="inline-flex items-center rounded-md bg-brand/10 px-2 py-1 text-xs font-semibold text-brand ring-1 ring-inset ring-brand/20 capitalize">
                                                {issue.category}
                                            </span>
                                            <span
                                                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium capitalize ring-1 ring-inset ${issue.status === "resolved"
                                                    ? "bg-green-500/10 text-green-600 ring-green-500/20"
                                                    : issue.status === "in_progress"
                                                        ? "bg-amber-500/10 text-amber-600 ring-amber-500/20"
                                                        : "bg-blue-500/10 text-blue-600 ring-blue-500/20"
                                                    }`}
                                            >
                                                {issue.status.replace("_", " ")}
                                            </span>
                                        </div>
                                        <h3 className="mt-4 font-display text-lg font-bold text-ink leading-tight">
                                            {issue.title}
                                        </h3>
                                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                                            {issue.description}
                                        </p>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between border-t border-ink/5 pt-4 text-xs text-muted-foreground">
                                        <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                                        <span>Flat {issue.flat_number}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <IssueDetailsDialog
                issue={selectedIssue}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </div>
    );
}
