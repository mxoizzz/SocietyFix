import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Circle, CircleDashed, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SocietyFix — Report and track society issues" },
      {
        name: "description",
        content:
          "A single place for residents to report common-area issues and for the secretary to resolve them, with live status updates.",
      },
      { property: "og:title", content: "SocietyFix — Report and track society issues" },
      {
        property: "og:description",
        content:
          "A single place for residents to report common-area issues and for the secretary to resolve them, with live status updates.",
      },
    ],
  }),
  component: Landing,
});

const STEPS = [
  { icon: Circle, label: "Reported", text: "A resident logs the issue in under a minute." },
  { icon: CircleDashed, label: "In progress", text: "The secretary picks it up and adds notes." },
  { icon: CheckCircle2, label: "Resolved", text: "Everyone sees the outcome, no chasing." },
];

function Landing() {
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-ink">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-24 -left-24 size-[420px] rounded-full bg-card blur-3xl"
          style={{ animation: "drift 14s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-0 right-0 size-[380px] rounded-full bg-brand/10 blur-3xl"
          style={{ animation: "drift2 18s ease-in-out infinite" }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-5 py-16">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-brand font-display text-lg font-bold text-primary-foreground">
            S
          </div>
          <div>
            <p className="font-display text-lg font-bold leading-none">SocietyFix</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Marigold Residency
            </p>
          </div>
        </div>

        <h1 className="mt-10 font-display text-4xl font-bold leading-tight tracking-tight text-balance sm:text-5xl">
          Common-area problems, logged once and tracked to the end.
        </h1>
        <p className="mt-4 max-w-xl text-pretty text-muted-foreground">
          Residents report electrical, plumbing, cleanliness and security issues. The secretary
          updates status and adds notes — everyone sees changes the moment they happen.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={user ? "/issues" : "/auth"}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-brand/90"
          >
            {user ? "Open your issues" : "Sign in to SocietyFix"}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <div className="mt-14 grid gap-3 sm:grid-cols-3">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.label}
                className="rounded-xl border border-card/70 bg-card/65 p-4 ring-1 ring-black/5 backdrop-blur-2xl"
              >
                <Icon className="size-5 text-brand" aria-hidden />
                <p className="mt-3 font-display text-sm font-bold">{step.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{step.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
