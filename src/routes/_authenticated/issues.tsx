import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { SecretaryDashboard } from "@/features/dashboard/SecretaryDashboard";
import { ResidentDashboard } from "@/features/dashboard/ResidentDashboard";

export const Route = createFileRoute("/_authenticated/issues")({
    component: IssuesDashboard,
});

function IssuesDashboard() {
    const { user, role, loading: authLoading } = useAuth();

    // Only fetch for residents. Secretaries fetch in their own dashboard component.
    const { data: issues, isLoading } = useQuery({
        queryKey: ["issues", "resident", user?.id],
        queryFn: async () => {
            const { data, error } = await (supabase as any)
                .from("issues")
                .select("*, issue_upvotes(user_id)")
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data;
        },
        enabled: !!user && role === "resident",
    });

    if (authLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="size-8 animate-spin text-brand" />
            </div>
        );
    }

    if (role === "secretary") {
        return <SecretaryDashboard />;
    }

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="size-8 animate-spin text-brand" />
            </div>
        );
    }

    return <ResidentDashboard issues={issues || []} />;
}
