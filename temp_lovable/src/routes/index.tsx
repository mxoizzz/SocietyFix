import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SocietyFix — Every issue, visible. Every update, accountable." },
      { name: "description", content: "A transparent way for residential societies to report, prioritize, and resolve common-area issues." },
      { property: "og:title", content: "SocietyFix — Transparent issue resolution" },
      { property: "og:description", content: "Report common-area issues, see live updates, and build trust across your society." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const processSteps = [
  ["01", "Report clearly", "Share the issue with a short description and location so nothing gets lost in conversation."],
  ["02", "Prioritize together", "Neighbours see the same issue and upvote what needs the society’s attention first."],
  ["03", "Update openly", "The secretary moves each issue through clear stages and shares progress in one place."],
  ["04", "Close the loop", "Residents see the resolution live, without repeated messages or follow-up calls."],
];

const features = [
  ["Live status tracking", "Every issue has a clear owner, current status, and visible trail from report to resolution."],
  ["One transparent feed", "A shared view replaces scattered messages, private follow-ups, and duplicate complaints."],
  ["Collective prioritization", "Upvotes reveal which common-area issues matter to the greatest number of residents."],
  ["A calmer command centre", "Secretaries can review, sort, update, and close issues from a focused society-wide view."],
];

function Index() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      }),
      { threshold: 0.14 },
    );
    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "border-b border-border bg-background/95 py-3 shadow-nav" : "py-6"}`}>
        <nav className="site-container flex items-center justify-between" aria-label="Main navigation">
          <a href="#top" className="font-display text-[1.65rem] leading-none">SocietyFix</a>
          <div className="hidden items-center gap-7 lg:flex">
            <a className="nav-link" href="#how-it-works">How it Works</a>
            <a className="nav-link" href="#features">Features</a>
            <a className="nav-link" href="#secretaries">For Secretaries</a>
            <a className="nav-link" href="#contact">Contact</a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <a className="button-secondary hidden sm:inline-flex" href="#final-cta">Join Your Society</a>
            <a className="button-primary text-xs sm:text-sm" href="#final-cta">Register Your Society</a>
          </div>
        </nav>
      </header>

      <main>
        <section id="top" className="relative flex min-h-[92vh] items-center border-b border-border pt-28">
          <div className="site-container grid w-full items-center gap-16 py-16 lg:grid-cols-[1.08fr_.92fr] lg:py-24">
            <div className="max-w-3xl">
              <p className="hero-reveal hero-delay-1 mb-8 text-xs font-semibold uppercase tracking-[0.18em] text-accent">For better-run residential societies</p>
              <h1 className="hero-reveal hero-delay-2 font-display text-[clamp(3.4rem,7vw,7.25rem)] leading-[.9] tracking-normal">
                Every issue,<br /><span className="text-accent">out in the open.</span>
              </h1>
              <p className="hero-reveal hero-delay-3 mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                SocietyFix gives residents and committees one calm, transparent place to report common-area problems and follow every resolution.
              </p>
              <div className="hero-reveal hero-delay-4 mt-10 flex flex-wrap gap-3">
                <a className="button-primary" href="#final-cta">Register Your Society</a>
                <a className="button-secondary" href="#how-it-works">See How It Works</a>
              </div>
            </div>

            <div className="hero-reveal hero-delay-3 relative mx-auto w-full max-w-lg lg:ml-auto" aria-label="Example SocietyFix issue feed">
              <div className="product-window">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <p className="text-sm font-semibold">Oakview Residency</p>
                  <p className="text-xs text-muted-foreground">Issue board</p>
                </div>
                <div className="space-y-3 p-4 sm:p-5">
                  <article className="issue-row">
                    <div><p className="issue-label">PLUMBING · B WING</p><h2 className="issue-title">Low water pressure on upper floors</h2></div>
                    <span className="status status-progress">In progress</span>
                  </article>
                  <article className="issue-row ml-0 sm:ml-8">
                    <div><p className="issue-label">SECURITY · MAIN GATE</p><h2 className="issue-title">Visitor entry register update</h2></div>
                    <span className="status status-review">Under review</span>
                  </article>
                  <article className="issue-row">
                    <div><p className="issue-label">CLEANLINESS · GARDEN</p><h2 className="issue-title">Evening waste collection missed</h2></div>
                    <span className="status status-resolved">Resolved</span>
                  </article>
                </div>
                <div className="grid grid-cols-3 border-t border-border text-center">
                  <div className="metric"><strong>24</strong><span>Open</span></div>
                  <div className="metric border-x border-border"><strong>11</strong><span>Active</span></div>
                  <div className="metric"><strong>89</strong><span>Resolved</span></div>
                </div>
              </div>
              <div className="absolute -bottom-7 -left-7 -z-10 h-full w-full border border-accent/35" />
            </div>
          </div>
        </section>

        <section className="section-space bg-surface-warm">
          <div className="site-container grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:gap-24">
            <div data-reveal className="reveal"><p className="eyebrow">The familiar problem</p></div>
            <div className="space-y-0">
              {["Complaints disappear inside busy group chats.", "Residents ask again because nobody can see progress.", "Committees spend more time replying than resolving."].map((text, index) => (
                <p data-reveal key={text} className="reveal problem-line" style={{ transitionDelay: `${index * 100}ms` }}><span>0{index + 1}</span>{text}</p>
              ))}
              <p data-reveal className="reveal pt-10 font-display text-3xl leading-tight text-accent md:text-5xl">The problem is not a lack of effort. It is a lack of shared visibility.</p>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="section-space scroll-mt-20">
          <div className="site-container">
            <div data-reveal className="reveal max-w-2xl">
              <p className="eyebrow">How it works</p>
              <h2 className="section-title">A clear path from report to resolution.</h2>
            </div>
            <div className="mt-20 grid border-t border-border md:grid-cols-2 lg:grid-cols-4">
              {processSteps.map(([number, title, description], index) => (
                <article data-reveal className="reveal process-step" style={{ transitionDelay: `${index * 120}ms` }} key={number}>
                  <p className="font-display text-6xl text-accent/55">{number}</p>
                  <h3 className="mt-12 text-xl font-semibold">{title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="section-space scroll-mt-20 bg-foreground text-background">
          <div className="site-container">
            <div data-reveal className="reveal flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div><p className="eyebrow text-background/60">Built for clarity</p><h2 className="section-title max-w-2xl">Less noise.<br />More accountability.</h2></div>
              <p className="max-w-sm text-base leading-relaxed text-background/65">A focused set of tools designed around the way societies actually communicate and make decisions.</p>
            </div>
            <div className="mt-20 grid gap-px bg-background/15 md:grid-cols-2">
              {features.map(([title, description], index) => (
                <article data-reveal className="reveal feature-block" style={{ transitionDelay: `${index * 90}ms` }} key={title}>
                  <p className="mb-12 font-display text-3xl text-background/35">0{index + 1}</p>
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="mt-4 max-w-md leading-relaxed text-background/60">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="secretaries" className="section-space scroll-mt-20">
          <div className="site-container grid items-start gap-14 lg:grid-cols-2 lg:gap-28">
            <div data-reveal className="reveal lg:sticky lg:top-36">
              <p className="eyebrow">For secretaries and committees</p>
              <h2 className="section-title">Run the society without running after every message.</h2>
            </div>
            <div data-reveal className="reveal">
              <p className="text-xl leading-relaxed text-muted-foreground">See every open concern in one view. Let resident upvotes show genuine priority. Publish an update once, and make it visible to everyone who needs it.</p>
              <div className="my-12 divide-y divide-border border-y border-border">
                <p className="secretary-point"><span>01</span>One centralized issue register</p>
                <p className="secretary-point"><span>02</span>Priority shaped by residents</p>
                <p className="secretary-point"><span>03</span>Fewer repetitive follow-up calls</p>
              </div>
              <a className="button-primary" href="#final-cta">Register Your Society</a>
            </div>
          </div>
        </section>

        <section className="section-space bg-accent text-accent-foreground">
          <div data-reveal className="reveal site-container text-center">
            <p className="mx-auto max-w-5xl font-display text-[clamp(2.8rem,6vw,6rem)] leading-[1.02]">“When everyone can see the work, trust no longer depends on hearsay.”</p>
            <p className="mt-10 text-xs font-semibold uppercase tracking-[0.18em] opacity-65">The SocietyFix principle</p>
          </div>
        </section>

        <section id="final-cta" className="section-space scroll-mt-20">
          <div data-reveal className="reveal site-container text-center">
            <p className="eyebrow">Start with your society</p>
            <h2 className="mx-auto max-w-4xl font-display text-[clamp(3rem,6vw,6.25rem)] leading-[.96]">Make every common concern a shared responsibility.</h2>
            <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">Register as a committee, or join the society your committee has already created.</p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <a className="button-primary" href="#top">Register Your Society</a>
              <a className="button-secondary" href="#top">Join Your Society</a>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-border py-12">
        <div className="site-container grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div><a href="#top" className="font-display text-3xl">SocietyFix</a><p className="mt-3 text-sm text-muted-foreground">Clear issues. Visible progress. Stronger communities.</p></div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <a className="nav-link" href="#how-it-works">How it Works</a><a className="nav-link" href="#features">Features</a><a className="nav-link" href="#secretaries">For Secretaries</a>
          </div>
        </div>
        <div className="site-container mt-10 border-t border-border pt-6 text-xs text-muted-foreground">© 2026 SocietyFix. Built for better neighbourhoods.</div>
      </footer>
    </div>
  );
}
