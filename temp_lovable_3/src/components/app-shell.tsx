import { Link, Outlet } from "@tanstack/react-router";
import { useResident } from "@/components/resident-provider";

const navItems = [
  { label: "Society Feed", to: "/" },
  { label: "My Issues", to: "/my-issues" },
  { label: "Report", to: "/report" },
  { label: "Profile", to: "/profile" },
] as const;

function NavLink({ item, mobile = false }: { item: (typeof navItems)[number]; mobile?: boolean }) {
  return (
    <Link
      to={item.to}
      activeOptions={{ exact: item.to === "/" }}
      className={
        mobile
          ? "flex min-h-14 flex-1 items-center justify-center rounded-md px-2 text-center text-xs font-semibold text-muted-foreground transition-colors"
          : "block rounded-md px-4 py-3 text-sm font-semibold text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      }
      activeProps={{
        className: mobile
          ? "flex min-h-14 flex-1 items-center justify-center rounded-md bg-primary px-2 text-center text-xs font-semibold text-primary-foreground transition-colors"
          : "block rounded-md bg-sidebar-primary px-4 py-3 text-sm font-semibold text-sidebar-primary-foreground transition-colors",
      }}
    >
      {item.label}
    </Link>
  );
}

export function AppShell() {
  const { resident } = useResident();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-sidebar-border bg-sidebar px-5 py-7 text-sidebar-foreground lg:block">
        <Link to="/" className="block">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/55">SocietyFix</p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-none text-sidebar-foreground">Resident Desk</h1>
        </Link>
        <nav className="mt-12 space-y-2" aria-label="Resident navigation">
          {navItems.map((item) => <NavLink key={item.to} item={item} />)}
        </nav>
        <div className="absolute bottom-7 left-5 right-5 border-t border-sidebar-border pt-5">
          <p className="text-sm font-semibold text-sidebar-foreground">{resident.name}</p>
          <p className="mt-1 text-sm text-sidebar-foreground/65">{resident.flat}</p>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 px-4 py-4 backdrop-blur-sm sm:px-6 lg:px-10">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{resident.society}</p>
              <p className="mt-1 text-base font-semibold text-foreground sm:text-lg">Resident Dashboard</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">{resident.name}</p>
              <p className="text-xs text-muted-foreground">Flat {resident.flat}</p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-12 lg:pt-10">
          <Outlet />
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card px-2 py-2 shadow-[0_-8px_30px_color-mix(in_oklab,var(--color-foreground)_8%,transparent)] lg:hidden" aria-label="Mobile resident navigation">
        <div className="flex gap-1">
          {navItems.map((item) => <NavLink key={item.to} item={item} mobile />)}
        </div>
      </nav>
    </div>
  );
}
