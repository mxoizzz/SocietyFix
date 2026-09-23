import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { categories, type IssueCategory } from "@/lib/issues";
import { useResident } from "@/components/resident-provider";

export const Route = createFileRoute("/report")({
  head: () => ({ meta: [
    { title: "Report an Issue — SocietyFix" },
    { name: "description", content: "Submit a common-area maintenance report for your housing society." },
    { property: "og:title", content: "Report an Issue — SocietyFix" },
    { property: "og:description", content: "Submit a common-area maintenance report for your housing society." },
  ] }),
  component: ReportIssue,
});

function ReportIssue() {
  const { resident, addIssue } = useResident();
  const [category, setCategory] = useState<IssueCategory>("Electrical");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [flat, setFlat] = useState(resident.flat);
  const [fileName, setFileName] = useState("");
  const [trackingId, setTrackingId] = useState("");

  const canSubmit = title.trim().length > 3 && description.trim().length > 8 && flat.trim().length > 1;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    const id = addIssue({ title: title.trim(), category, description: description.trim(), flat: flat.trim() });
    setTrackingId(id);
    setTitle(""); setDescription(""); setFileName(""); setCategory("Electrical"); setFlat(resident.flat);
  };

  if (trackingId) {
    return (
      <section className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Report submitted</p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-foreground">Your issue has been reported.</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">Tracking ID: <span className="font-semibold text-foreground">{trackingId}</span></p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button asChild><Link to="/my-issues">View it in My Issues</Link></Button>
          <Button type="button" variant="secondary" onClick={() => setTrackingId("")}>Report another issue</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">Report an Issue</p>
      <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-foreground sm:text-5xl">Send a clear report in under a minute.</h1>
      <form onSubmit={submit} className="mt-8 rounded-lg border border-border bg-card p-4 shadow-sm sm:p-7">
        <div className="grid gap-5 sm:grid-cols-2">
          <label><span className="mb-2 block text-sm font-semibold">Category</span><select value={category} onChange={(event) => setCategory(event.target.value as IssueCategory)} className="h-12 w-full rounded-md border border-input bg-background px-3 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20">{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span className="mb-2 block text-sm font-semibold">Flat / Block number</span><input value={flat} onChange={(event) => setFlat(event.target.value)} className="h-12 w-full rounded-md border border-input bg-background px-3 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20" /></label>
          <label className="sm:col-span-2"><span className="mb-2 block text-sm font-semibold">Title</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Short summary" className="h-12 w-full rounded-md border border-input bg-background px-3 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20" /></label>
          <label className="sm:col-span-2"><span className="mb-2 block text-sm font-semibold">Description</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What happened, where, and when?" rows={5} className="w-full resize-none rounded-md border border-input bg-background px-3 py-3 outline-none focus:border-ring focus:ring-2 focus:ring-ring/20" /></label>
          <label className="sm:col-span-2"><span className="mb-2 block text-sm font-semibold">Photo optional</span><input type="file" accept="image/*" onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")} className="block w-full rounded-md border border-input bg-background px-3 py-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:font-semibold file:text-secondary-foreground" />{fileName && <span className="mt-2 block text-sm text-muted-foreground">Selected: {fileName}</span>}</label>
        </div>
        <Button type="submit" size="wide" disabled={!canSubmit} className="mt-7">Submit Report</Button>
      </form>
    </section>
  );
}

