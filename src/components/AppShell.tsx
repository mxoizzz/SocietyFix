import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutList, PlusCircle, LogOut, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: LucideIcon };

export function AppShell({
  eyebrow,
  title,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { profile, role } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const items: NavItem[] = [
    { to: "/issues", label: role === "secretary" ? "All issues" : "My issues", icon: LayoutList },
  ];
  if (role !== "secretary") {
    items.push({ to: "/report", label: "Report issue", icon: PlusCircle });
  }

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-ink antialiased">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-20 -left-20 size-[420px] rounded-full bg-card blur-3xl"
          style={{ animation: "drift 14s ease-in-out infinite" }}
        />
        <div
          className="absolute top-1/3 -right-24 size-[380px] rounded-full bg-card blur-3xl"
          style={{ animation: "drift2 18s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-0 left-1/3 size-[300px] rounded-full bg-brand/10 blur-3xl"
          style={{ animation: "drift 20s ease-in-out infinite" }}
        />
      </div>

      <div className="relative flex">
        <aside className="hidden w-64 shrink-0 flex-col gap-8 border-r border-card/70 bg-card/40 px-6 py-8 backdrop-blur-2xl lg:flex lg:min-h-screen">
          <Link to="/issues" className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-brand font-display text-lg font-bold text-primary-foreground">
              S
            </div>
            <div>
              <p className="font-display text-base font-bold leading-none">SocietyFix</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Marigold Residency
              </p>
            </div>
          </Link>
          <nav className="flex flex-col gap-1">
            {items.map((item) => {
              const active = pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-brand-soft font-semibold text-brand"
                      : "text-muted-foreground hover:bg-card/60",
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto rounded-xl border border-card/70 bg-card/50 p-4">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Signed in
            </p>
            <p className="mt-2 text-sm font-semibold">{profile?.name ?? "—"}</p>
            <p className="text-xs text-muted-foreground">
              {role === "secretary" ? "Secretary" : "Resident"}
              {profile?.flat_number ? ` · ${profile.flat_number}` : ""}
            </p>
            <button
              onClick={handleSignOut}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-card/70 bg-card/70 px-3 py-2 text-xs font-medium hover:bg-card"
            >
              <LogOut className="size-3.5" aria-hidden /> Sign out
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-10 border-b border-card/60 bg-card/50 backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-3 px-5 py-4 lg:px-8">
              <div className="flex items-center gap-3 lg:hidden">
                <div className="grid size-9 place-items-center rounded-xl bg-brand font-display font-bold text-primary-foreground">
                  S
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-bold">{title}</p>
                  <p className="truncate font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {eyebrow}
                  </p>
                </div>
              </div>
              <div className="hidden lg:block">
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  {eyebrow}
                </p>
                <h1 className="font-display text-xl font-bold tracking-tight">{title}</h1>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden items-center gap-2 rounded-full border border-green/20 bg-green-soft px-3 py-1.5 font-mono text-[11px] font-medium text-green sm:flex">
                  <span className="size-1.5 rounded-full bg-green" /> Live
                </span>
                {actions}
              </div>
            </div>
          </header>

          <main className="px-5 py-6 pb-28 lg:px-8 lg:py-8 lg:pb-10">{children}</main>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 border-t border-card/70 bg-card/80 backdrop-blur-2xl lg:hidden">
        {items.map((item) => {
          const active = pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-1 py-3 text-[11px] font-medium",
                active ? "text-brand" : "text-muted-foreground",
              )}
            >
              <Icon className="size-5" aria-hidden />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={handleSignOut}
          className="flex flex-col items-center gap-1 py-3 text-[11px] font-medium text-muted-foreground"
        >
          <LogOut className="size-5" aria-hidden />
          Sign out
        </button>
      </nav>
    </div>
  );
}
