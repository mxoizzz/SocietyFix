import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Issue = Database["public"]["Tables"]["issues"]["Row"];

interface IssueDetailsDialogProps {
    issue: Issue | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function IssueDetailsDialog({ issue, open, onOpenChange }: IssueDetailsDialogProps) {
    const { user, profile, role } = useAuth();
    const queryClient = useQueryClient();
    const [noteText, setNoteText] = useState("");
    const [status, setStatus] = useState<Issue["status"] | "">("");

    // Update local state when issue opens
    useState(() => {
        if (issue) setStatus(issue.status);
    });

    const { data: notes, isLoading: isLoadingNotes } = useQuery({
        queryKey: ["issue_notes", issue?.id],
        queryFn: async () => {
            if (!issue) return [];
            const { data, error } = await supabase
                .from("issue_notes")
                .select("*")
                .eq("issue_id", issue.id)
                .order("created_at", { ascending: true });
            if (error) throw error;
            return data;
        },
        enabled: !!issue,
    });

    const updateMutation = useMutation({
        mutationFn: async () => {
            if (!issue) return;

            // Update Status if changed
            if (status && status !== issue.status) {
                const { error: statusError } = await supabase
                    .from("issues")
                    .update({ status: status as Issue["status"] })
                    .eq("id", issue.id);
                if (statusError) throw statusError;
            }

            // Add Note if exists
            if (noteText.trim()) {
                const { error: noteError } = await supabase.from("issue_notes").insert({
                    issue_id: issue.id,
                    text: noteText.trim(),
                    author: profile?.name || user?.email || "Secretary",
                    author_id: user?.id || null,
                });
                if (noteError) throw noteError;
            }
        },
        onSuccess: () => {
            toast.success("Issue updated successfully!");
            setNoteText("");
            queryClient.invalidateQueries({ queryKey: ["issues"] });
            queryClient.invalidateQueries({ queryKey: ["issue_notes", issue?.id] });
            onOpenChange(false);
        },
        onError: (error) => {
            toast.error("Failed to update issue: " + error.message);
        },
    });

    if (!issue) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="flex flex-col sm:max-w-md overflow-hidden bg-background text-ink border-l border-ink/10 pl-6">
                <SheetHeader className="text-left border-b border-ink/10 pb-4 pr-6">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center rounded-md bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand ring-1 ring-inset ring-brand/20 capitalize">
                            {issue.category}
                        </span>
                        <span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${issue.status === "resolved"
                                ? "bg-green-500/10 text-green-600 ring-green-500/20"
                                : issue.status === "in_progress"
                                    ? "bg-amber-500/10 text-amber-600 ring-amber-500/20"
                                    : "bg-blue-500/10 text-blue-600 ring-blue-500/20"
                                }`}
                        >
                            {issue.status.replace("_", " ")}
                        </span>
                    </div>
                    <SheetTitle className="font-display text-2xl">{issue.title}</SheetTitle>
                    <SheetDescription className="text-muted-foreground mt-2 text-sm">
                        {issue.description}
                    </SheetDescription>
                    <p className="text-xs text-muted-foreground mt-2">
                        Reported by: Flat {issue.flat_number} on {new Date(issue.created_at).toLocaleDateString()}
                    </p>
                </SheetHeader>

                {/* Timeline / Notes view */}
                <div className="flex-1 overflow-y-auto py-4 pr-6 space-y-4">
                    <h3 className="font-semibold text-sm flex items-center gap-2">
                        <MessageSquare className="size-4" /> Updates & Notes
                    </h3>

                    {isLoadingNotes ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="size-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : notes?.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8 italic border border-dashed rounded-lg bg-card/50">
                            No updates yet.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {notes?.map((note) => (
                                <div key={note.id} className="bg-muted/30 rounded-lg p-3 text-sm border ring-1 ring-black/5">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-medium text-brand">{note.author}</span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {new Date(note.created_at).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <p className="text-ink/80 text-pretty">{note.text}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Secretary Actions */}
                {role === "secretary" && (
                    <div className="border-t border-ink/10 pt-4 pb-6 pr-6 space-y-4">
                        <h3 className="font-semibold text-sm">Secretary Actions</h3>
                        <div className="space-y-3">
                            <Select value={status || issue.status} onValueChange={(v) => setStatus(v as Issue["status"])}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Update Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="reported">Reported</SelectItem>
                                    <SelectItem value="in_progress">In Progress</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                </SelectContent>
                            </Select>

                            <Textarea
                                placeholder="Add a resolution note or update..."
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                className="resize-none"
                                rows={3}
                            />

                            <Button
                                className="w-full bg-brand text-primary-foreground font-semibold hover:bg-brand/90 transition-all hover:shadow-lg shadow-brand/20"
                                onClick={() => updateMutation.mutate()}
                                disabled={updateMutation.isPending || (status === issue.status && !noteText.trim())}
                            >
                                {updateMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : "Save Changes"}
                            </Button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
