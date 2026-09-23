export type IssueStatus = "Reported" | "In Progress" | "Resolved";
export type IssueCategory = "Electrical" | "Plumbing" | "Cleanliness" | "Security" | "Other";

export type IssueNote = {
  id: string;
  author: string;
  text: string;
  at: string;
};

export type TimelineEvent = {
  label: string;
  at: string;
};

export type Issue = {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  location: string;
  reporter: string;
  upvotes: number;
  status: IssueStatus;
  reportedAt: string;
  updatedAt: string;
  photo_url?: string;
  timeline: TimelineEvent[];
  notes: IssueNote[];
};

export const categories: IssueCategory[] = ["Electrical", "Plumbing", "Cleanliness", "Security", "Other"];
export const statuses: IssueStatus[] = ["Reported", "In Progress", "Resolved"];

export const initialIssues: Issue[] = [
  {
    id: "SF-1048",
    title: "Low water pressure on upper floors",
    description: "Water pressure drops sharply between 7:00 and 9:00 am in flats above the seventh floor. Residents in B wing are unable to use showers and kitchen taps at the same time.",
    category: "Plumbing", location: "B Wing · Floors 8–12", reporter: "Priya Nair · B-902", upvotes: 38, status: "In Progress", reportedAt: "2026-09-18T08:20:00", updatedAt: "2026-09-23T10:15:00",
    timeline: [{ label: "Reported", at: "2026-09-18T08:20:00" }, { label: "Marked In Progress", at: "2026-09-19T11:30:00" }],
    notes: [{ id: "n-1", author: "Arjun Mehta", text: "Pump contractor inspected the pressure valves. Replacement parts are expected tomorrow.", at: "2026-09-23T10:15:00" }],
  },
  {
    id: "SF-1051", title: "Main gate intercom not connecting", description: "The visitor intercom at the main gate rings but does not connect to flats in A and C wings. Security is calling residents on personal numbers as a temporary workaround.", category: "Security", location: "Main Gate", reporter: "Rohan Shah · A-304", upvotes: 31, status: "Reported", reportedAt: "2026-09-21T19:05:00", updatedAt: "2026-09-21T19:05:00",
    timeline: [{ label: "Reported", at: "2026-09-21T19:05:00" }], notes: [],
  },
  {
    id: "SF-1039", title: "Basement lights flickering near ramp", description: "Three tube lights near the basement entry ramp flicker continuously after 6 pm, reducing visibility for vehicles entering the parking area.", category: "Electrical", location: "Basement · Ramp 1", reporter: "Nisha Kapoor · C-1102", upvotes: 27, status: "In Progress", reportedAt: "2026-09-12T18:40:00", updatedAt: "2026-09-22T16:10:00",
    timeline: [{ label: "Reported", at: "2026-09-12T18:40:00" }, { label: "Marked In Progress", at: "2026-09-20T09:45:00" }], notes: [{ id: "n-2", author: "Arjun Mehta", text: "Electrician has isolated the affected circuit. Work scheduled for Thursday morning.", at: "2026-09-22T16:10:00" }],
  },
  {
    id: "SF-1045", title: "Evening waste collection missed", description: "Dry waste has not been collected from the garden-side bins for two evenings, causing overflow around the enclosure.", category: "Cleanliness", location: "Garden · Waste Bay", reporter: "Fatima Khan · D-506", upvotes: 24, status: "Resolved", reportedAt: "2026-09-16T20:12:00", updatedAt: "2026-09-20T17:35:00",
    timeline: [{ label: "Reported", at: "2026-09-16T20:12:00" }, { label: "Marked In Progress", at: "2026-09-17T09:10:00" }, { label: "Resolved", at: "2026-09-20T17:35:00" }], notes: [{ id: "n-3", author: "Arjun Mehta", text: "Collection schedule restored and the waste bay has been pressure washed.", at: "2026-09-20T17:35:00" }],
  },
  {
    id: "SF-1054", title: "Lift stops unevenly on fifth floor", description: "The A-wing lift stops a few centimetres below the fifth-floor landing, creating a tripping risk for residents.", category: "Electrical", location: "A Wing · Lift 2", reporter: "Devika Rao · A-503", upvotes: 22, status: "Reported", reportedAt: "2026-09-22T07:50:00", updatedAt: "2026-09-22T07:50:00", timeline: [{ label: "Reported", at: "2026-09-22T07:50:00" }], notes: [],
  },
  {
    id: "SF-1036", title: "Seepage visible in clubhouse ceiling", description: "A damp patch has expanded above the reading corner after recent rain. No dripping is visible yet, but the paint has started peeling.", category: "Plumbing", location: "Clubhouse · Reading Room", reporter: "Sonal Iyer · B-404", upvotes: 19, status: "In Progress", reportedAt: "2026-09-09T14:25:00", updatedAt: "2026-09-21T12:00:00", timeline: [{ label: "Reported", at: "2026-09-09T14:25:00" }, { label: "Marked In Progress", at: "2026-09-11T10:20:00" }], notes: [{ id: "n-4", author: "Arjun Mehta", text: "Waterproofing team traced the source to the terrace drain joint.", at: "2026-09-21T12:00:00" }],
  },
  {
    id: "SF-1049", title: "Stray dogs entering children’s play area", description: "The side gate latch does not close fully, allowing stray dogs into the play area during early mornings.", category: "Security", location: "Garden · Side Gate", reporter: "Kunal Bose · C-702", upvotes: 18, status: "In Progress", reportedAt: "2026-09-19T06:45:00", updatedAt: "2026-09-22T11:25:00", timeline: [{ label: "Reported", at: "2026-09-19T06:45:00" }, { label: "Marked In Progress", at: "2026-09-20T08:30:00" }], notes: [{ id: "n-5", author: "Arjun Mehta", text: "Temporary latch fitted. Fabricator will install a self-closing hinge this week.", at: "2026-09-22T11:25:00" }],
  },
  {
    id: "SF-1041", title: "Mosquito breeding near drain cover", description: "Standing water is collecting beside the rear compound drain after cleaning, with visible mosquito activity in the evenings.", category: "Cleanliness", location: "Rear Compound", reporter: "Meera Joshi · D-203", upvotes: 16, status: "Resolved", reportedAt: "2026-09-13T17:35:00", updatedAt: "2026-09-18T09:15:00", timeline: [{ label: "Reported", at: "2026-09-13T17:35:00" }, { label: "Marked In Progress", at: "2026-09-14T08:40:00" }, { label: "Resolved", at: "2026-09-18T09:15:00" }], notes: [{ id: "n-6", author: "Arjun Mehta", text: "Drain slope corrected and anti-larval treatment completed.", at: "2026-09-18T09:15:00" }],
  },
  {
    id: "SF-1056", title: "Loose tile outside community hall", description: "One floor tile at the community hall entrance rocks underfoot and may crack or cause a fall.", category: "Other", location: "Community Hall · Entrance", reporter: "Aman Verma · A-806", upvotes: 14, status: "Reported", reportedAt: "2026-09-23T08:10:00", updatedAt: "2026-09-23T08:10:00", timeline: [{ label: "Reported", at: "2026-09-23T08:10:00" }], notes: [],
  },
  {
    id: "SF-1032", title: "Garden pathway lights not working", description: "Four bollard lights along the east pathway remain off after sunset, making the walking route difficult for senior residents.", category: "Electrical", location: "Garden · East Path", reporter: "Harish Menon · B-1104", upvotes: 13, status: "Resolved", reportedAt: "2026-09-04T20:05:00", updatedAt: "2026-09-10T18:20:00", timeline: [{ label: "Reported", at: "2026-09-04T20:05:00" }, { label: "Marked In Progress", at: "2026-09-06T10:00:00" }, { label: "Resolved", at: "2026-09-10T18:20:00" }], notes: [{ id: "n-7", author: "Arjun Mehta", text: "Damaged underground cable replaced; all four lights tested after sunset.", at: "2026-09-10T18:20:00" }],
  },
  {
    id: "SF-1046", title: "Water leaking from fire hose cabinet", description: "A slow leak is visible below the fire hose cabinet and is wetting the corridor wall beside flat C-608.", category: "Plumbing", location: "C Wing · Floor 6", reporter: "Leena Thomas · C-608", upvotes: 12, status: "Resolved", reportedAt: "2026-09-17T06:55:00", updatedAt: "2026-09-19T15:45:00", timeline: [{ label: "Reported", at: "2026-09-17T06:55:00" }, { label: "Marked In Progress", at: "2026-09-17T12:30:00" }, { label: "Resolved", at: "2026-09-19T15:45:00" }], notes: [{ id: "n-8", author: "Arjun Mehta", text: "Valve washer replaced. Cabinet and line tested with the fire contractor.", at: "2026-09-19T15:45:00" }],
  },
  {
    id: "SF-1050", title: "Courier desk register running out", description: "The physical parcel register has only a few pages left and entries are becoming difficult to track during peak delivery hours.", category: "Security", location: "Reception", reporter: "Vikram Sethi · D-1001", upvotes: 10, status: "Resolved", reportedAt: "2026-09-20T13:40:00", updatedAt: "2026-09-21T18:05:00", timeline: [{ label: "Reported", at: "2026-09-20T13:40:00" }, { label: "Resolved", at: "2026-09-21T18:05:00" }], notes: [{ id: "n-9", author: "Arjun Mehta", text: "New register issued and old entries archived at the society office.", at: "2026-09-21T18:05:00" }],
  },
  {
    id: "SF-1053", title: "Gym air conditioner making loud noise", description: "The air conditioner near the treadmill area has developed a loud rattling sound after ten minutes of operation.", category: "Other", location: "Clubhouse · Gym", reporter: "Sneha Kulkarni · B-705", upvotes: 9, status: "Reported", reportedAt: "2026-09-21T21:10:00", updatedAt: "2026-09-21T21:10:00", timeline: [{ label: "Reported", at: "2026-09-21T21:10:00" }], notes: [],
  },
  {
    id: "SF-1038", title: "Staircase handrail needs tightening", description: "The handrail between floors three and four moves when pressure is applied and needs its wall brackets tightened.", category: "Other", location: "D Wing · Staircase", reporter: "George Mathew · D-402", upvotes: 8, status: "Resolved", reportedAt: "2026-09-11T10:15:00", updatedAt: "2026-09-14T16:30:00", timeline: [{ label: "Reported", at: "2026-09-11T10:15:00" }, { label: "Resolved", at: "2026-09-14T16:30:00" }], notes: [{ id: "n-10", author: "Arjun Mehta", text: "All brackets tightened and checked across the full staircase.", at: "2026-09-14T16:30:00" }],
  },
  {
    id: "SF-1055", title: "Overflowing planter after irrigation", description: "The planter beside the C-wing lobby overflows onto the walkway each morning after the irrigation cycle.", category: "Cleanliness", location: "C Wing · Lobby", reporter: "Ishita Sen · C-302", upvotes: 7, status: "Reported", reportedAt: "2026-09-22T09:30:00", updatedAt: "2026-09-22T09:30:00", timeline: [{ label: "Reported", at: "2026-09-22T09:30:00" }], notes: [],
  },
  {
    id: "SF-1043", title: "Parking mirror angle is incorrect", description: "The convex mirror at the basement turn points too high and does not show vehicles approaching from the second lane.", category: "Security", location: "Basement · Turn B", reporter: "Mihir Patel · A-1201", upvotes: 6, status: "In Progress", reportedAt: "2026-09-15T11:20:00", updatedAt: "2026-09-20T14:10:00", timeline: [{ label: "Reported", at: "2026-09-15T11:20:00" }, { label: "Marked In Progress", at: "2026-09-20T14:10:00" }], notes: [],
  },
  {
    id: "SF-1029", title: "Lobby ceiling light stays on all day", description: "The daylight sensor in the B-wing lobby is not switching the ceiling lights off during daytime hours.", category: "Electrical", location: "B Wing · Ground Floor", reporter: "Anita Desai · B-104", upvotes: 5, status: "Resolved", reportedAt: "2026-09-01T12:05:00", updatedAt: "2026-09-06T10:40:00", timeline: [{ label: "Reported", at: "2026-09-01T12:05:00" }, { label: "Resolved", at: "2026-09-06T10:40:00" }], notes: [{ id: "n-11", author: "Arjun Mehta", text: "Faulty sensor replaced and timing checked over two days.", at: "2026-09-06T10:40:00" }],
  },
  {
    id: "SF-1047", title: "Housekeeping supplies left in corridor", description: "Cleaning supplies are regularly being stored outside the service room and narrow the passage during morning hours.", category: "Cleanliness", location: "A Wing · Floor 2", reporter: "Kabir Arora · A-205", upvotes: 4, status: "Resolved", reportedAt: "2026-09-17T09:05:00", updatedAt: "2026-09-18T13:20:00", timeline: [{ label: "Reported", at: "2026-09-17T09:05:00" }, { label: "Resolved", at: "2026-09-18T13:20:00" }], notes: [{ id: "n-12", author: "Arjun Mehta", text: "Storage shelves reorganized and housekeeping team briefed.", at: "2026-09-18T13:20:00" }],
  },
];
