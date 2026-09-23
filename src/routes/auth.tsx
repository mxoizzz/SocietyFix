import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Authenticate — SocietyFix" },
    ],
  }),
  component: AuthPage,
});

const fieldClassName =
  "w-full rounded-lg border border-border bg-background/50 px-4 py-3.5 text-sm outline-none ring-accent/30 placeholder:text-muted-foreground focus:ring-2 transition-all backdrop-blur-sm";

type AuthMode = "signin" | "resident_signup" | "secretary_signup";

function AuthPage() {
  const navigate = useNavigate();
  const { user, refresh } = useAuth();

  // Default to registering a resident unless they clicked "Register Your Society" on the landing page
  const [mode, setMode] = useState<AuthMode>("resident_signup");
  const [busy, setBusy] = useState(false);

  // Common Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Resident Specific
  const [flat, setFlat] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  // Secretary Specific
  const [societyName, setSocietyName] = useState("");

  useEffect(() => {
    if (user) navigate({ to: "/issues", replace: true });
  }, [user, navigate]);

  async function handleSecretarySignup() {
    // 1. Generate Invite Code & Create Society
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const { data: society, error: socError } = await (supabase as any)
      .from("societies")
      .insert({ name: societyName, invite_code: code })
      .select()
      .single();

    if (socError || !society) throw new Error("Failed to register society: " + socError?.message);

    // 2. Register Secretary
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role: "secretary", society_id: society.id },
      },
    });

    if (error) throw error;
    return { session: data.session, society };
  }

  async function handleResidentSignup() {
    // 1. Verify Invite Code
    const { data: society, error: socError } = await (supabase as any)
      .from("societies")
      .select("id")
      .eq("invite_code", inviteCode.trim().toUpperCase())
      .maybeSingle();

    if (socError || !society) throw new Error("Invalid Society Invite Code");

    // 2. Register Resident
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, flat_number: flat, role: "resident", society_id: society.id },
      },
    });

    if (error) throw error;
    return { session: data.session };
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === "secretary_signup") {
        const result = await handleSecretarySignup();
        if (!result.session) {
          toast.success("Society registered! Please click the link sent to your email.");
          setMode("signin");
          return;
        }
      } else if (mode === "resident_signup") {
        const result = await handleResidentSignup();
        if (!result.session) {
          toast.success("Account created! Please click the link sent to your email.");
          setMode("signin");
          return;
        }
      }

      // If session exists immediately
      await refresh();
      navigate({ to: "/issues", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-12 text-ink font-sans">

      {/* Aesthetic Background Orbs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute -top-24 left-[10%] size-[500px] rounded-full bg-accent/5 blur-[120px]"
          style={{ animation: "drift 20s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-[-10%] right-[-5%] size-[400px] rounded-full bg-blue-500/5 blur-[100px]"
          style={{ animation: "drift2 25s ease-in-out infinite" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">

        <div className="text-center mb-10">
          <a href="/" className="font-display text-2xl font-bold tracking-tight inline-block hover:opacity-80 transition-opacity">SocietyFix</a>
          <p className="mt-2 text-sm text-muted-foreground">Secure access to your community</p>
        </div>

        <div className="rounded-2xl border border-border/50 bg-surface-warm/50 p-6 md:p-8 backdrop-blur-2xl shadow-2xl shadow-black/5">

          {/* Mode Switcher */}
          <div className="flex gap-1 rounded-xl border border-border/50 bg-background/50 p-1 mb-8">
            <button
              type="button"
              onClick={() => setMode("resident_signup")}
              className={cn(
                "flex-1 rounded-lg px-2 py-2 text-[11px] uppercase font-bold tracking-wider transition-all",
                mode === "resident_signup" ? "bg-accent text-background shadow-md" : "text-muted-foreground hover:text-ink",
              )}
            >
              Join
            </button>
            <button
              type="button"
              onClick={() => setMode("secretary_signup")}
              className={cn(
                "flex-1 rounded-lg px-2 py-2 text-[11px] uppercase font-bold tracking-wider transition-all",
                mode === "secretary_signup" ? "bg-accent text-background shadow-md" : "text-muted-foreground hover:text-ink",
              )}
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={cn(
                "flex-1 rounded-lg px-2 py-2 text-[11px] uppercase font-bold tracking-wider transition-all",
                mode === "signin" ? "bg-accent text-background shadow-md" : "text-muted-foreground hover:text-ink",
              )}
            >
              Sign In
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {mode !== "signin" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Full Name</label>
                <input
                  className={fieldClassName}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Official Name"
                  required
                />
              </div>
            )}

            {mode === "secretary_signup" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Society/Building Name</label>
                <input
                  className={fieldClassName}
                  value={societyName}
                  onChange={(e) => setSocietyName(e.target.value)}
                  placeholder="e.g. Oakview Residency"
                  required
                />
              </div>
            )}

            {mode === "resident_signup" && (
              <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Flat / Unit</label>
                  <input
                    className={fieldClassName}
                    value={flat}
                    onChange={(e) => setFlat(e.target.value)}
                    placeholder="B-402"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-accent">Invite Code</label>
                  <input
                    className={fieldClassName}
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="XYZ123"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Email</label>
              <input
                type="email"
                className={fieldClassName}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Secure Email"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Password</label>
              <input
                type="password"
                className={fieldClassName}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="mt-6 w-full rounded-lg bg-accent px-4 py-4 text-sm font-semibold text-background transition-transform active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {busy ? "Authenticating..." : mode === "signin" ? "Enter Dashboard" : mode === "resident_signup" ? "Join Society" : "Register Society"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
