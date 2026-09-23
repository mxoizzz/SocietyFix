export type IssueCategory = "Electrical" | "Plumbing" | "Cleanliness" | "Security" | "Other";
export type IssueStatus = "Reported" | "In Progress" | "Resolved";

export type IssueEvent = { label: string; timestamp: string };
export type SecretaryNote = { text: string; timestamp: string };

export type Issue = {
  id: string;
  title: string;
  category: IssueCategory;
  status: IssueStatus;
  description: string;
  flat: string;
  residentId: string;
  residentName: string;
  reportedAt: string;
  upvotes: number;
  voted: boolean;
  timeline: IssueEvent[];
  notes: SecretaryNote[];
};

export const resident = {
  id: "resident-a704",
  name: "Aarav Mehta",
  flat: "A-704",
  society: "Palm Grove Residency",
};

export const categories: IssueCategory[] = ["Electrical", "Plumbing", "Cleanliness", "Security", "Other"];
export const statuses: IssueStatus[] = ["Reported", "In Progress", "Resolved"];

export const initialIssues: Issue[] = [
  {
    id: "SF-0247", title: "Water seepage near lift lobby", category: "Plumbing", status: "In Progress",
    description: "Water has been collecting beside the service lift on the seventh floor since yesterday evening. The floor becomes slippery during busy hours.",
    flat: "A-704", residentId: resident.id, residentName: resident.name, reportedAt: "2026-09-23T08:40:00+05:30", upvotes: 18, voted: false,
    timeline: [{ label: "Reported", timestamp: "2026-09-23T08:40:00+05:30" }, { label: "Marked In Progress", timestamp: "2026-09-23T11:15:00+05:30" }],
    notes: [{ text: "Plumber has inspected the service duct. Repair is scheduled for tomorrow morning.", timestamp: "2026-09-23T12:05:00+05:30" }],
  },
  {
    id: "SF-0246", title: "Basement B2 lights flickering", category: "Electrical", status: "Reported",
    description: "Three lights in the visitor parking row on B2 are flickering continuously after 7 pm.", flat: "C-302", residentId: "resident-c302", residentName: "Nisha Kapoor", reportedAt: "2026-09-22T21:10:00+05:30", upvotes: 24, voted: true,
    timeline: [{ label: "Reported", timestamp: "2026-09-22T21:10:00+05:30" }], notes: [],
  },
  {
    id: "SF-0245", title: "Overflowing bin near play area", category: "Cleanliness", status: "Resolved",
    description: "The covered bin beside the children's play area had not been cleared after the weekend.", flat: "B-1102", residentId: "resident-b1102", residentName: "Maya Shah", reportedAt: "2026-09-22T17:25:00+05:30", upvotes: 31, voted: false,
    timeline: [{ label: "Reported", timestamp: "2026-09-22T17:25:00+05:30" }, { label: "Marked In Progress", timestamp: "2026-09-22T18:10:00+05:30" }, { label: "Resolved", timestamp: "2026-09-23T07:30:00+05:30" }],
    notes: [{ text: "The bin was cleared and an additional evening collection has been added for weekends.", timestamp: "2026-09-23T07:35:00+05:30" }],
  },
  {
    id: "SF-0244", title: "Main gate visitor log delay", category: "Security", status: "In Progress",
    description: "Visitor entries are taking longer during the morning peak because only one register is being used.", flat: "D-506", residentId: "resident-d506", residentName: "Rohan Iyer", reportedAt: "2026-09-21T09:05:00+05:30", upvotes: 42, voted: true,
    timeline: [{ label: "Reported", timestamp: "2026-09-21T09:05:00+05:30" }, { label: "Marked In Progress", timestamp: "2026-09-21T16:20:00+05:30" }], notes: [{ text: "A second visitor desk will be trialled during morning and evening peak hours this week.", timestamp: "2026-09-22T10:00:00+05:30" }],
  },
  {
    id: "SF-0243", title: "Low water pressure in A wing", category: "Plumbing", status: "Reported",
    description: "Water pressure has been noticeably low on upper floors between 7 and 9 am for the last three days.", flat: "A-1004", residentId: "resident-a1004", residentName: "Dev Malhotra", reportedAt: "2026-09-20T08:15:00+05:30", upvotes: 37, voted: false,
    timeline: [{ label: "Reported", timestamp: "2026-09-20T08:15:00+05:30" }], notes: [],
  },
  {
    id: "SF-0241", title: "Intercom not working at A-704", category: "Electrical", status: "Resolved",
    description: "The lobby intercom does not connect to our flat, although calls to neighbouring flats work normally.", flat: "A-704", residentId: resident.id, residentName: resident.name, reportedAt: "2026-09-18T19:45:00+05:30", upvotes: 5, voted: false,
    timeline: [{ label: "Reported", timestamp: "2026-09-18T19:45:00+05:30" }, { label: "Marked In Progress", timestamp: "2026-09-19T10:30:00+05:30" }, { label: "Resolved", timestamp: "2026-09-19T15:20:00+05:30" }], notes: [{ text: "A loose connection in the lobby panel was replaced and the line was tested with the resident.", timestamp: "2026-09-19T15:25:00+05:30" }],
  },
  {
    id: "SF-0239", title: "Stray packages in reception", category: "Other", status: "In Progress",
    description: "Unclaimed courier packages have accumulated behind the reception desk and are blocking staff access.", flat: "C-804", residentId: "resident-c804", residentName: "Ishita Rao", reportedAt: "2026-09-17T13:30:00+05:30", upvotes: 11, voted: false,
    timeline: [{ label: "Reported", timestamp: "2026-09-17T13:30:00+05:30" }, { label: "Marked In Progress", timestamp: "2026-09-18T09:00:00+05:30" }], notes: [{ text: "Residents with pending collections have been notified. Unclaimed items will move to the parcel room.", timestamp: "2026-09-18T09:10:00+05:30" }],
  },
  {
    id: "SF-0237", title: "Mosquito breeding near garden drain", category: "Cleanliness", status: "Resolved",
    description: "Stagnant water was visible in the drain behind the south garden seating area.", flat: "B-603", residentId: "resident-b603", residentName: "Farah Khan", reportedAt: "2026-09-15T18:05:00+05:30", upvotes: 46, voted: true,
    timeline: [{ label: "Reported", timestamp: "2026-09-15T18:05:00+05:30" }, { label: "Marked In Progress", timestamp: "2026-09-16T08:35:00+05:30" }, { label: "Resolved", timestamp: "2026-09-16T12:45:00+05:30" }], notes: [{ text: "Drain cleared and treated by pest control. Weekly inspection added to the housekeeping checklist.", timestamp: "2026-09-16T13:00:00+05:30" }],
  },
  {
    id: "SF-0234", title: "CCTV blind spot at east exit", category: "Security", status: "Reported",
    description: "The east pedestrian exit is not fully visible in the current camera angle, particularly after dark.", flat: "D-1201", residentId: "resident-d1201", residentName: "Kabir Bose", reportedAt: "2026-09-13T20:20:00+05:30", upvotes: 54, voted: false,
    timeline: [{ label: "Reported", timestamp: "2026-09-13T20:20:00+05:30" }], notes: [{ text: "Security vendor has been asked to survey the camera position and share a revised angle.", timestamp: "2026-09-14T11:40:00+05:30" }],
  },
  {
    id: "SF-0231", title: "Clubhouse washroom tap leaking", category: "Plumbing", status: "Resolved",
    description: "The tap in the ground-floor clubhouse washroom continued dripping even when fully closed.", flat: "A-704", residentId: resident.id, residentName: resident.name, reportedAt: "2026-09-11T07:50:00+05:30", upvotes: 8, voted: false,
    timeline: [{ label: "Reported", timestamp: "2026-09-11T07:50:00+05:30" }, { label: "Marked In Progress", timestamp: "2026-09-11T09:20:00+05:30" }, { label: "Resolved", timestamp: "2026-09-11T11:05:00+05:30" }], notes: [{ text: "The worn washer was replaced and the tap is now closing correctly.", timestamp: "2026-09-11T11:10:00+05:30" }],
  },
  {
    id: "SF-0228", title: "Generator noise after midnight", category: "Other", status: "In Progress",
    description: "The generator test cycle has run after midnight twice this week and can be heard clearly from B wing.", flat: "B-904", residentId: "resident-b904", residentName: "Sneha Pillai", reportedAt: "2026-09-08T00:35:00+05:30", upvotes: 29, voted: false,
    timeline: [{ label: "Reported", timestamp: "2026-09-08T00:35:00+05:30" }, { label: "Marked In Progress", timestamp: "2026-09-08T14:00:00+05:30" }], notes: [{ text: "The maintenance vendor is reviewing the automatic test schedule.", timestamp: "2026-09-08T14:10:00+05:30" }],
  },
  {
    id: "SF-0225", title: "Loose tile on walking track", category: "Other", status: "Resolved",
    description: "One tile near the north turn was raised and posed a tripping risk for walkers.", flat: "C-105", residentId: "resident-c105", residentName: "Anil Menon", reportedAt: "2026-09-05T06:40:00+05:30", upvotes: 16, voted: false,
    timeline: [{ label: "Reported", timestamp: "2026-09-05T06:40:00+05:30" }, { label: "Marked In Progress", timestamp: "2026-09-05T10:00:00+05:30" }, { label: "Resolved", timestamp: "2026-09-06T16:30:00+05:30" }], notes: [],
  },
];

export function formatIssueDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));
}

export function formatIssueTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}
