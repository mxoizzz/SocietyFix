import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { initialIssues, resident, type Issue, type IssueCategory } from "@/lib/issues";

type NewIssue = { title: string; category: IssueCategory; description: string; flat: string };

type ResidentContextValue = {
  issues: Issue[];
  resident: typeof resident;
  toggleVote: (id: string) => void;
  addIssue: (input: NewIssue) => string;
};

const ResidentContext = createContext<ResidentContextValue | undefined>(undefined);

export function ResidentProvider({ children }: { children: ReactNode }) {
  const [issues, setIssues] = useState(initialIssues);

  const toggleVote = (id: string) => {
    setIssues((current) => current.map((issue) => issue.id === id ? { ...issue, voted: !issue.voted, upvotes: issue.upvotes + (issue.voted ? -1 : 1) } : issue));
  };

  const addIssue = (input: NewIssue) => {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    const id = `SF-${suffix}`;
    const now = new Date().toISOString();
    const issue: Issue = {
      ...input, id, status: "Reported", residentId: resident.id, residentName: resident.name,
      reportedAt: now, upvotes: 0, voted: false, timeline: [{ label: "Reported", timestamp: now }], notes: [],
    };
    setIssues((current) => [issue, ...current]);
    return id;
  };

  const value = useMemo(() => ({ issues, resident, toggleVote, addIssue }), [issues]);
  return <ResidentContext.Provider value={value}>{children}</ResidentContext.Provider>;
}

export function useResident() {
  const context = useContext(ResidentContext);
  if (!context) throw new Error("useResident must be used within ResidentProvider");
  return context;
}
