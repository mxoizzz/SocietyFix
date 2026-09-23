import {
  Zap,
  Droplets,
  Sparkles,
  ShieldCheck,
  Wrench,
  Circle,
  CircleDashed,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";

export type IssueStatus = "reported" | "in_progress" | "resolved";
export type IssueCategory = "electrical" | "plumbing" | "cleanliness" | "security" | "other";

export type Issue = {
  id: string;
  ref_code: string;
  reported_by: string | null;
  reporter_name: string;
  flat_number: string;
  category: IssueCategory;
  title: string;
  description: string;
  photo_url: string | null;
  status: IssueStatus;
  created_at: string;
  updated_at: string;
};

export type IssueNote = {
  id: string;
  issue_id: string;
  author: string;
  text: string;
  created_at: string;
};

export type StatusEvent = {
  id: string;
  issue_id: string;
  status: IssueStatus;
  actor: string;
  created_at: string;
};

export const STATUS_META: Record<
  IssueStatus,
  { label: string; icon: LucideIcon; text: string; bg: string; dot: string }
> = {
  reported: {
    label: "Reported",
    icon: Circle,
    text: "text-amber",
    bg: "bg-amber-soft",
    dot: "bg-amber",
  },
  in_progress: {
    label: "In progress",
    icon: CircleDashed,
    text: "text-blue",
    bg: "bg-blue-soft",
    dot: "bg-blue",
  },
  resolved: {
    label: "Resolved",
    icon: CheckCircle2,
    text: "text-green",
    bg: "bg-green-soft",
    dot: "bg-green",
  },
};

export const STATUS_ORDER: IssueStatus[] = ["reported", "in_progress", "resolved"];

export const CATEGORY_META: Record<IssueCategory, { label: string; icon: LucideIcon }> = {
  electrical: { label: "Electrical", icon: Zap },
  plumbing: { label: "Plumbing", icon: Droplets },
  cleanliness: { label: "Cleanliness", icon: Sparkles },
  security: { label: "Security", icon: ShieldCheck },
  other: { label: "Other", icon: Wrench },
};

export const CATEGORIES = Object.keys(CATEGORY_META) as IssueCategory[];

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function formatStamp(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
