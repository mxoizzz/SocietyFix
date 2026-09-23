import { createFileRoute } from "@tanstack/react-router";
import { SecretaryDashboard } from "@/features/dashboard/SecretaryDashboard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Secretary Dashboard — SocietyFix" },
      { name: "description", content: "Review, prioritize, and update society issues from the SocietyFix secretary dashboard." },
      { property: "og:title", content: "Secretary Dashboard — SocietyFix" },
      { property: "og:description", content: "A clear command centre for managing residential society issues." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SecretaryDashboard,
});
