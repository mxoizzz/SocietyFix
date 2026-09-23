import { createFileRoute } from "@tanstack/react-router";
import { useResident } from "@/components/resident-provider";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [
    { title: "Profile — SocietyFix" },
    { name: "description", content: "Resident profile details used for SocietyFix issue reporting." },
    { property: "og:title", content: "Profile — SocietyFix" },
    { property: "og:description", content: "Resident profile details used for SocietyFix issue reporting." },
  ] }),
  component: Profile,
});

function Profile() {
  const { resident } = useResident();
  return (
    <section className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Profile</p>
      <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">Resident details</h1>
      <div className="mt-8 rounded-lg border border-border bg-card p-6 shadow-sm">
        <dl className="space-y-5">
          <div><dt className="text-sm font-semibold text-muted-foreground">Name</dt><dd className="mt-1 text-lg font-semibold">{resident.name}</dd></div>
          <div><dt className="text-sm font-semibold text-muted-foreground">Flat / Block</dt><dd className="mt-1 text-lg font-semibold">{resident.flat}</dd></div>
          <div><dt className="text-sm font-semibold text-muted-foreground">Society</dt><dd className="mt-1 text-lg font-semibold">{resident.society}</dd></div>
        </dl>
        <p className="mt-6 border-t border-border pt-5 text-sm leading-6 text-muted-foreground">Profile editing will be connected when resident accounts are added. These details currently power the mock reporting flow.</p>
      </div>
    </section>
  );
}

