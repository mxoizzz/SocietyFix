import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { CATEGORIES, CATEGORY_META, type IssueCategory } from "@/lib/issues";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/report")({
  component: ReportPage,
});

const field =
  "w-full rounded-xl border border-card/70 bg-card/80 px-4 py-3.5 text-sm outline-none ring-brand/30 placeholder:text-muted-foreground focus:ring-2";

function ReportPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [category, setCategory] = useState<IssueCategory>("electrical");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [flat, setFlat] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile?.flat_number && !flat) setFlat(profile.flat_number);
  }, [profile, flat]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!user) return;
    setBusy(true);
    try {
      let photoPath: string | null = null;
      if (file) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("issue-photos")
          .upload(path, file);
        if (uploadError) throw uploadError;
        photoPath = path;
      }

      const { data, error } = await (supabase as any)
        .from("issues")
        .insert({
          society_id: (profile as any)?.society_id,
          reported_by: user.id,
          reporter_name: profile?.name ?? "Resident",
          flat_number: flat,
          category,
          title,
          description,
          photo_url: photoPath,
        })
        .select("id, ref_code")
        .single();
      if (error) throw error;

      toast.success(`Reported — your tracking ID is ${data.ref_code}`);
      navigate({ to: "/issues" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit the issue");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell eyebrow="Resident" title="Report an issue">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl animate-rise space-y-5 rounded-2xl border border-card/70 bg-card/70 p-5 ring-1 ring-black/5 backdrop-blur-2xl"
      >
        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Category
          </label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {CATEGORIES.map((value) => {
              const Icon = CATEGORY_META[value].icon;
              const active = category === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCategory(value)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3.5 text-xs font-medium transition",
                    active
                      ? "border-brand/30 bg-brand-soft text-brand"
                      : "border-card/70 bg-card/70 text-muted-foreground hover:bg-card",
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                  {CATEGORY_META[value].label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Title
          </label>
          <input
            className={cn(field, "mt-1.5")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Lobby light not switching on"
            required
          />
        </div>

        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            What's happening?
          </label>
          <textarea
            className={cn(field, "mt-1.5 min-h-32 resize-none")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Where it is, when it started, anything the secretary should know."
          />
        </div>

        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Flat / block
          </label>
          <input
            className={cn(field, "mt-1.5")}
            value={flat}
            onChange={(e) => setFlat(e.target.value)}
            placeholder="A-102"
            required
          />
        </div>

        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Photo (optional)
          </label>
          <label className="mt-1.5 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-line bg-card/60 px-4 py-4 text-sm text-muted-foreground hover:bg-card">
            <ImagePlus className="size-5" aria-hidden />
            <span className="truncate">{file ? file.name : "Add a photo of the problem"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-brand/90 disabled:opacity-60 sm:w-auto sm:px-8"
        >
          {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {busy ? "Submitting…" : "Submit report"}
        </button>
      </form>
    </AppShell>
  );
}
