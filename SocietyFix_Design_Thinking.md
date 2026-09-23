# SocietyFix — Design Thinking Documentation
### A Real-Time Civic Issue Reporting & Resolution Platform for Residential Societies

---

## 0. Project Background

Initial idea: a platform for residents to report civic issues (potholes, broken streetlights, etc.) directly to government authorities.

**Scope-down rationale:** Direct integration with government bodies requires APIs, approvals, and data-sharing agreements that are not feasible for rapid development. The problem was explicitly re-scoped to the **residential society level**, where:
- The "authority" is the **Society Secretary / Management Committee** — a reachable stakeholder.
- The user base is localized and constrained safely by multi-tenant logic.
- The core problem remains identical in structure: Reporting → Resolving → Status Tracking.

---

## 1. EMPATHIZE

### 1.1 Why this stage matters
Before architecting, we must understand the dual-friction hurting both the reporter and the resolver.

### 1.2 User Personas

**Persona A: The Resident — "Priya, 32, Working Professional"**
- Frequently notices issues (leaking pipe, flickering light) but doesn't report them because:
  - Complaints get "lost" in the society WhatsApp group under 200 other messages.
  - No way to know if her complaint was seen, ignored, or resolved without bothering people.
- Goal: Report an issue in < 60 seconds with photo proof, and know its status automatically.

**Persona B: The Secretary — "Mr. Sharma, 58, Society Secretary"**
- Pain points:
  - Complaints come through 5 different channels (calls, texts, logs, in-person) — impossible to track.
  - No record of what's pending vs resolved; things fall through the cracks.
  - Residents call repeatedly to "follow up," which wastes his time.
- Goal: See all complaints in one dashboard, filter by upvotes to prioritize, and mass-broadcast updates.

### 1.3 Key Insights
1. **Visibility of status** is the biggest trust-builder for residents.
2. **Duplicate complaints** burn out Secretaries; residents need to "Upvote" existing issues instead of creating new text threads.

---

## 2. DEFINE

### 2.1 Problem Statement
> Residents in housing societies have no structured, transparent way to report common-area issues and track their resolution, leading to duplicate complaints and shattered trust. Management faces unstructured data avalanches.

### 2.2 How Might We (HMW) Questions
- HMW give residents a single, trackable channel to report issues with media?
- HMW help the secretary prioritize issues based on community impact (upvoting)?
- HMW make issue status visible in real-time so residents don't need to follow up?

---

## 3. IDEATE

### 3.1 Chosen Concept
**"SocietyFix"** — A multi-tenant SaaS platform:
- **Secretaries** register their society and get a unique Invite Code.
- **Residents** join via the code and enter an isolated Society Feed.
- **Upvoting Mechanisms** consolidate duplicates.
- **WebSockets** push updates (New Reports, Status Changes, Notes, Broadcasts) to all connected devices instantly without page refreshes.

### 3.2 Feature Prioritization (MoSCoW)

| Must Have (Implemented) | Should Have (Implemented) | Could Have | Won't Have (v1) |
|---|---|---|---|
| Multi-tenant login + Invite Codes | Realtime WebSockets | Complex analytics | Government CRM links |
| Issue submission + Status tags | Photographic Evidence | Automated assignments | Payment tracking |
| Secretary resolution dashboard | Upvoting system | Direct SMS triggers | Vendor logins |
| Official Secretary Broadcasts | CSV Database Exporting | | |

---

## 4. PROTOTYPE & ARCHITECTURE

### 4.1 Tech Stack Execution
- **Frontend Core:** Vite, React 19, TypeScript, `@tanstack/react-router`
- **Design System:** Tailwind v4 (Premium UI parameters, glassmorphism)
- **Backend & Database:** Supabase PostgreSQL
- **Security:** Strict Row-Level Security (RLS) enforcing `society_id` boundaries.
- **Infrastructure:** Supabase Storage (Evidence Buckets), Supabase Realtime (WebSockets)

### 4.2 Core User Flows
**Flow 1 — Tenancy Onboarding:**
Secretary registers Society → Receives Code. Resident registers → Enters Code → Bound to Society.

**Flow 2 — Zero-Latency Reporting:**
Resident submits issue + photo → WebSocket instantly renders it on the Secretary's dashboard.

**Flow 3 — Prioritization:**
Residents see "Lift broken" → Click "Upvote" instead of reporting again → Issue sorts to top of Secretary's queue.

---

## 5. TEST & OUTCOMES

### 5.1 Realized Value
- Centralized reporting eliminates scattered WhatsApp messages.
- Realtime webhooks drop follow-up calls to near zero.
- The administrative CSV export functionality instantly standardizes committee meetings.
- The `Broadcasts` module overrides regular issue streams, giving administration instant, top-level communicative authority over the tenancy.
