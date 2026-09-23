# Product Requirements Document (PRD)
## SocietyFix — Society Issue Reporting & Resolution Platform

**Version:** 1.0 (Prototype/MVP)
**Owner:** [Your Name]
**Status:** Draft for prototype build

---

## 1. Purpose
SocietyFix lets residents of a housing society report common-area issues (electrical, plumbing, cleanliness, security, etc.) and track their resolution in real time, while giving the society secretary a single dashboard to manage and resolve all reported issues.

## 2. Problem Statement
Residents currently report issues through unstructured channels (calls, WhatsApp groups), leading to lost complaints, repeated follow-ups, and no visibility into resolution status. Secretaries lack a centralized way to track and prioritize issues.

## 3. Goals & Success Metrics

| Goal | Metric |
|---|---|
| Reduce time to report an issue | < 60 seconds per report |
| Increase transparency | 100% of issues show a live status visible to the reporter |
| Reduce follow-up load on secretary | Reduction in repeat "any update?" queries (measured via test feedback) |
| Improve resolution tracking | 0 issues lost/untracked in the system |

## 4. Users & Roles

| Role | Description | Key Actions |
|---|---|---|
| **Resident** | Any flat owner/tenant | Report issue, view own issues, view status/timeline |
| **Secretary** (Admin) | Society committee member | View all issues, filter/sort, update status, add notes |

*(v1 has no separate "maintenance staff" role — secretary handles all status updates. Can be added later.)*

## 5. Scope

### 5.1 In Scope (MVP)
- Resident login (simple, can be mocked/dummy auth for prototype)
- Report an issue: category, title, description, optional photo upload
- Auto-generated tracking ID per issue
- Resident's personal issue list with live status
- Secretary dashboard: view all issues, filter by status/category
- Secretary can update issue status and add a resolution note
- Status flow: **Reported → In Progress → Resolved**
- Real-time or near-real-time status sync between secretary update and resident view

### 5.2 Out of Scope (v1)
- Government/municipal authority integration
- Push notifications / SMS / email alerts
- Payment or billing modules
- Anonymous reporting
- Multi-society / multi-tenant support
- Native mobile app (web-responsive only for now)

## 6. User Stories

1. **As a resident**, I want to report an issue with a category and description, so that the right person can act on it.
2. **As a resident**, I want to see the current status of my reported issue, so that I don't have to call anyone to follow up.
3. **As a resident**, I want to see a history/timeline of status changes, so that I understand what's been done.
4. **As a secretary**, I want to see all reported issues in one dashboard, so that nothing gets missed.
5. **As a secretary**, I want to filter issues by status or category, so that I can prioritize urgent ones.
6. **As a secretary**, I want to update an issue's status and add a note, so that the resident is informed of progress.

## 7. Functional Requirements

### 7.1 Authentication
- Simple login screen with role selection: Resident / Secretary.
- For prototype purposes: dummy/mock login (no OTP/email verification needed unless required).

### 7.2 Report Issue (Resident)
- Fields: Category (dropdown: Electrical, Plumbing, Cleanliness, Security, Other), Title, Description, Photo (optional), Location/Block-Flat number.
- On submit: generate unique Issue ID, set status = "Reported", timestamp = now.

### 7.3 My Issues (Resident)
- List view of all issues reported by the logged-in resident.
- Each item shows: title, category, status badge, date reported.
- Click into an issue → detail view with full timeline (Reported → In Progress → Resolved) and secretary's notes.

### 7.4 Secretary Dashboard
- Table or Kanban view of all issues across all residents.
- Columns/filters: Status, Category, Date, Flat/Block.
- Click into an issue → can change status (dropdown) and add a text note.
- Status change should reflect on the resident's view immediately (or on next refresh, for MVP).

### 7.5 Notifications (Optional/Stretch)
- In-app banner/badge when an issue status changes (no external push/SMS needed for MVP).

## 8. Non-Functional Requirements
- **Usability:** A first-time user should complete "report an issue" without instructions.
- **Performance:** Dashboard should load under 2 seconds for up to ~100 issues (prototype scale).
- **Responsiveness:** Should work on both mobile and desktop browser widths.
- **Data integrity:** No issue should be editable/deletable by residents once submitted (only secretary can update status).

## 9. Data Model (Simplified)

**User**
- id, name, role (resident/secretary), flat_number

**Issue**
- id (tracking ID)
- reported_by (user id)
- category (enum: Electrical, Plumbing, Cleanliness, Security, Other)
- title
- description
- photo_url (optional)
- status (enum: Reported, In Progress, Resolved)
- created_at
- updated_at
- notes: [ { text, author, timestamp } ]

## 10. Suggested Tech Stack

| Layer | Option |
|---|---|
| Frontend | React (or plain HTML/CSS/JS for a fast prototype) |
| Backend | Node.js + Express, or Firebase Functions |
| Database | Firebase Firestore (built-in real-time sync) or MongoDB |
| Auth | Firebase Auth (or mock auth for prototype) |
| Hosting | Vercel/Netlify (frontend) + Firebase/Render (backend) |

*Firebase is recommended for the prototype since it gives real-time listeners "for free," which directly supports the "live real-time status" requirement without building custom WebSocket infrastructure.*

## 11. Milestones (Suggested)

| Milestone | Deliverable |
|---|---|
| M1 | Wireframes / clickable low-fi prototype (Figma or HTML) |
| M2 | Resident flow — report + view issues (mock data) |
| M3 | Secretary dashboard — view + update status |
| M4 | Real-time sync between the two views |
| M5 | Usability testing with residents/secretary + iteration |

## 12. Risks & Open Questions
- How is a resident's "flat number/identity" verified without a full auth system? (For prototype: manual dummy accounts are fine.)
- Should other residents see all issues (community transparency) or only their own? *(Assumption: only own issues in v1, community-wide visibility is a "Could Have.")*
- What happens to an issue if it's marked "Resolved" but the resident disagrees? *(Future: reopen/dispute feature.)*
