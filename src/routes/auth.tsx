import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Building2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, type Role } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in — SocietyFix" },
      { name: "description", content: "Sign in or create your SocietyFix society account." },
      { property: "og:title", content: "Sign in — SocietyFix" },
      {
        property: "og:description",
        content: "Sign in or create your SocietyFix society account.",
      },
    ],
  }),
  component: AuthPage,
});

const field =
  "w-full rounded-xl border border-card/70 bg-card/80 px-4 py-3.5 text-sm outline-none ring-brand/30 placeholder:text-muted-foreground focus:ring-2";

function AuthPage() {
  const navigate = useNavigate();
  const { user, refresh } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [flat, setFlat] = useState("");
  const [role, setRole] = useState<Role>("resident");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/issues", replace: true });
  }, [user, navigate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { name, flat_number: flat, role },
          },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("Check your email to confirm your account, then sign in.");
          setMode("signin");
          return;
        }
        await refresh();
        navigate({ to: "/issues", replace: true });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await refresh();
        navigate({ to: "/issues", replace: true });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-12 text-ink">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-24 left-1/4 size-[420px] rounded-full bg-card blur-3xl"
          style={{ animation: "drift 16s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-0 right-0 size-[320px] rounded-full bg-brand/10 blur-3xl"
          style={{ animation: "drift2 20s ease-in-out infinite" }}
        />
      </div>

      <div className="relative w-full max-w-md">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-brand font-display text-lg font-bold text-primary-foreground">
            S
          </div>
          <div>
            <p className="font-display text-base font-bold leading-none">SocietyFix</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Marigold Residency
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-card/70 bg-card/70 p-5 ring-1 ring-black/5 backdrop-blur-2xl">
          <div className="flex gap-1 rounded-xl border border-card/70 bg-card/60 p-1">
            {(["signup", "signin"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={cn(
                  "flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition",
                  mode === value ? "bg-brand text-primary-foreground" : "text-muted-foreground",
                )}
              >
                {value === "signup" ? "Create account" : "Sign in"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            {mode === "signup" && (
              <>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Your name
                  </label>
                  <input
                    className={cn(field, "mt-1.5")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Anita Desai"
                    required
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
                    I am a
                  </label>
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    {(
                      [
                        { value: "resident", label: "Resident", icon: Building2 },
                        { value: "secretary", label: "Secretary", icon: ShieldCheck },
                      ] as const
                    ).map((option) => {
                      const Icon = option.icon;
                      const active = role === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setRole(option.value)}
                          className={cn(
                            "flex items-center justify-center gap-2 rounded-xl border px-3 py-3.5 text-sm font-medium transition",
                            active
                              ? "border-brand/30 bg-brand-soft text-brand"
                              : "border-card/70 bg-card/70 text-muted-foreground",
                          )}
                        >
                          <Icon className="size-4" aria-hidden />
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                className={cn(field, "mt-1.5")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Password
              </label>
              <input
                type="password"
                className={cn(field, "mt-1.5")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-brand px-4 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-brand/90 disabled:opacity-60"
            >
              {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
