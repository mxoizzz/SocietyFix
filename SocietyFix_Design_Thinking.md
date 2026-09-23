# SocietyFix — Design Thinking Documentation
### A Real-Time Civic Issue Reporting & Resolution Platform for Residential Societies

---

## 0. Project Background

Initial idea: a platform for residents to report civic issues (potholes, broken streetlights, etc.) directly to government authorities.

**Scope-down rationale:** Direct integration with government bodies (municipal corporations, PWD, etc.) requires APIs, approvals, and data-sharing agreements that are not feasible for a student/prototype project. The problem was re-scoped to the **residential society level**, where:
- The "authority" is the **Society Secretary / Management Committee** — a real, reachable stakeholder.
- The user base (residents) is small, accessible, and easy to interview/test with.
- The core problem (reporting issues → getting them resolved → knowing the status) remains identical in structure, just at a smaller, testable scale.

---

## 1. EMPATHIZE

### 1.1 Why this stage matters
Before designing anything, we need to understand the frustrations of both people who report issues and the person responsible for resolving them.

### 1.2 User Personas

**Persona A: The Resident — "Priya, 32, Working Professional"**
- Lives in a 2BHK flat, works 9–6, has limited time.
- Frequently notices issues (leaking pipe in the parking area, flickering common-area light, garbage not collected) but doesn't report them because:
  - No clear channel — she doesn't know whether to call the secretary, watchman, or WhatsApp group.
  - Complaints get "lost" in the society WhatsApp group under 200 other messages.
  - No way to know if her complaint was seen, ignored, or resolved.
- Goal: Report an issue in under a minute and know its status without following up personally.

**Persona B: The Secretary — "Mr. Sharma, 58, Retired, Society Secretary"**
- Manages complaints on top of many other responsibilities, mostly via phone calls and WhatsApp.
- Pain points:
  - Complaints come through 4–5 different channels (calls, texts, group messages, in-person) — hard to track.
  - No record of what's pending vs resolved; things fall through the cracks.
  - Residents call repeatedly to "follow up," which wastes his time.
- Goal: See all complaints in one place, prioritize them, mark progress, and reduce repeat follow-up calls.

### 1.3 Empathy Map (Resident)

| Says | Thinks |
|---|---|
| "I've told them thrice, nothing happens" | "Is anyone even reading this?" |
| "I'll just fix it myself" | "Reporting is more effort than it's worth" |

| Does | Feels |
|---|---|
| Posts in WhatsApp group, waits | Frustrated, ignored, powerless |

### 1.4 Empathy Map (Secretary)

| Says | Thinks |
|---|---|
| "Send me a message, I'll note it down" | "I can't keep track of everything manually" |
| "It's already being fixed" (unsure) | "I hope I'm not forgetting something" |

| Does | Feels |
|---|---|
| Juggles calls, texts, physical notes | Overwhelmed, reactive instead of organized |

### 1.5 Research Methods Used
- Informal interviews with 5–6 residents and 1 society secretary.
- Review of an actual society WhatsApp complaint thread (anonymized) to observe real pain points.
- Short survey: "How do you currently report an issue in your society, and how satisfied are you with the resolution time?"

### 1.6 Key Insights
1. Residents don't lack the *will* to report — they lack a **structured, trackable channel**.
2. Secretaries aren't negligent — they're **overloaded with unstructured input**.
3. **Visibility of status** (not just reporting) is the biggest trust-builder for residents.

---

## 2. DEFINE

### 2.1 Point-of-View (POV) Statements

> **Priya (Resident)** needs **a simple way to report society issues and track their resolution** because **she currently has no visibility into whether her complaint is even being addressed, which makes her stop reporting altogether.**

> **Mr. Sharma (Secretary)** needs **a centralized dashboard to view, prioritize, and update the status of all reported issues** because **currently, complaints arrive through scattered channels and are easy to lose track of, damaging resident trust.**

### 2.2 Problem Statement

> Residents in housing societies have no structured, transparent way to report common-area issues (like broken lights, leakages, or cleanliness problems) and track their resolution, leading to under-reporting, repeated follow-ups, and reduced trust in the management committee.

### 2.3 How Might We (HMW) Questions
- HMW give residents a single, always-available channel to report issues?
- HMW help the secretary see all complaints in one prioritized view instead of scattered messages?
- HMW make issue status visible in real time so residents don't need to follow up personally?
- HMW build trust between residents and the committee through transparency?

---

## 3. IDEATE

### 3.1 Brainstormed Solutions
1. A shared Google Form + Sheet (rejected — no real-time status, no notifications).
2. A WhatsApp bot for reporting (rejected — hard to structure/prioritize, no dashboard).
3. **A lightweight web app with two views: Resident view (report + track) and Secretary view (dashboard + status updates).** ✅ Selected
4. A mobile app with push notifications (parked as a future iteration — out of scope for MVP prototype).

### 3.2 Feature Prioritization (MoSCoW)

| Must Have | Should Have | Could Have | Won't Have (v1) |
|---|---|---|---|
| Report issue (title, category, description, photo) | Category-wise filtering | Upvoting issues by other residents | Government authority integration |
| Real-time status (Reported → In Progress → Resolved) | Comment/notes thread on each issue | Auto-assignment to maintenance staff | Push notifications / SMS |
| Secretary dashboard to view & update status | Basic analytics (issues per category) | Anonymous reporting | Payment/billing features |
| Resident-specific issue history | | | |

### 3.3 Chosen Concept
**"SocietyFix"** — A two-role web platform:
- **Residents** report issues with a category, description, and optional photo.
- **Secretary** sees all issues in a single dashboard, updates status, and can leave a resolution note.
- **Residents** see live status updates on their own reported issues without needing to follow up.

---

## 4. PROTOTYPE

### 4.1 Prototype Type
Low-to-mid fidelity **clickable web prototype** (HTML/React), simulating real interactions without a full backend — good enough for usability testing.

### 4.2 Core User Flows

**Flow 1 — Resident reports an issue:**
Login → "Report New Issue" → Select category (Electrical / Plumbing / Cleanliness / Security / Other) → Add description + photo (optional) → Submit → Confirmation with a tracking ID.

**Flow 2 — Resident tracks status:**
Login → "My Issues" → List of reported issues with status badges (🟡 Reported / 🔵 In Progress / 🟢 Resolved) → Click issue → See timeline + secretary's notes.

**Flow 3 — Secretary manages issues:**
Login → Dashboard (all issues, filterable by category/status) → Click issue → Update status → Add resolution note → Resident's view updates live.

### 4.3 Key Screens
1. Login / Role selection (Resident / Secretary)
2. Report Issue Form
3. My Issues (Resident) — status tracker
4. Secretary Dashboard — table/kanban of all issues
5. Issue Detail View — timeline of status changes + notes

### 4.4 Suggested Tech Stack (for actual build)
- **Frontend:** React (or plain HTML/CSS/JS for simplicity)
- **Backend:** Node.js + Express (or Firebase for speed)
- **Database:** Firebase Firestore / MongoDB (supports real-time listeners easily)
- **Real-time updates:** Firebase real-time listeners or WebSockets
- **Hosting:** Vercel/Netlify (frontend), Render/Firebase (backend)

*(See the separate PRD document for full detail.)*

---

## 5. TEST

### 5.1 Testing Goals
- Can a resident report an issue in under 60 seconds without guidance?
- Can they understand their issue's current status without confusion?
- Can the secretary find, update, and resolve an issue faster than their current method (calls/WhatsApp)?

### 5.2 Testing Method
- **Usability testing** with 4–5 residents and the society secretary using the clickable prototype.
- Think-aloud protocol: users narrate their thoughts while performing tasks.
- Tasks given:
  1. "Report that the lift in your building isn't working."
  2. "Check the status of an issue you reported earlier."
  3. (Secretary) "Find the oldest unresolved issue and mark it in progress."

### 5.3 Metrics to Capture
- Task completion rate and time-on-task.
- Number of errors/confusions during reporting flow.
- Subjective trust rating: "Do you feel more confident this issue will be resolved?" (1–5 scale)
- Secretary's perceived reduction in follow-up calls.

### 5.4 Expected Iteration Areas
- Simplify category selection if users hesitate.
- Add clearer visual cues for status (color + icon, not just text).
- Possibly add a "last updated" timestamp for extra reassurance.

### 5.5 Feedback Loop
Insights from testing feed back into **Ideate/Prototype** stages — e.g., if residents want to upvote recurring issues (like a persistently broken light), that could be pulled forward from "Could Have" to "Should Have" in a v2.

---

## Summary Table — All 5 Stages at a Glance

| Stage | Key Output |
|---|---|
| Empathize | 2 personas, empathy maps, key insights |
| Define | POV statements, 1 core problem statement, 4 HMW questions |
| Ideate | 4 solution concepts, MoSCoW prioritization, chosen concept |
| Prototype | Clickable web prototype, 3 user flows, 5 key screens |
| Test | Usability test plan, metrics, iteration plan |
