# Product Requirements Document (PRD)
## SocietyFix — Multi-Tenant Community Management Platform

**Version:** 2.0 (SaaS Multi-Tenant Pivot)
**Owner:** [Your Name]
**Status:** Approved for Development

---

## 1. Purpose
SocietyFix is a scalable, multi-tenant SaaS platform that empowers housing societies to digitally manage common-area issues. It centralizes reports (electrical, plumbing, cleanliness, security), introduces democratic prioritization through resident upvoting, and gives the society secretary a powerful dashboard to resolve problems transparently.

## 2. Problem Statement
Residents currently report issues through chaotic group chats, leading to lost complaints, redundant reporting, and zero visibility on progress. Secretaries are overwhelmed with repetitive complaints and struggle to identify which issues impact the most residents, making prioritization difficult.

## 3. Goals & Success Metrics

| Goal | Metric |
|---|---|
| Streamlined Onboarding | Secretaries can register a society and generate an invite code in < 2 mins |
| Reduce Redundant Complaints | 80% adoption of the "Upvote" feature instead of duplicate reporting |
| Increase Transparency | 100% of issues show a live status and history visible to the society |
| Improve Prioritization | Secretaries can sort dashboards by "Most Upvoted" to target critical issues |

## 4. Users & Roles

| Role | Description | Key Actions |
|---|---|---|
| **Secretary** (Admin) | Society committee member / Creator | Registers Society, generates Invite, Views all issues, Upgrades status, adds notes, sorts by priority. |
| **Resident** | Flat owner/tenant | Registers using Society Invite Code, Reports issues, Upvotes existing issues, Views society feed. |

## 5. Scope

### 5.1 In Scope (Phase 1 & 2)
- **Multi-Tenant Onboarding:** 
  - Secretary flow: Register → Name Society → Generate Unique Invite Code.
  - Resident flow: Register → Input Invite Code → Access Isolated Society Space.
- **Live Society Feed:** A transparent dashboard showing all problems occurring in the specific society.
- **Reporting System:** Report an issue with category, title, description, and location.
- **Democratic Upvoting:** Residents can upvote an issue to signal their agreement/impact, automatically bumping its priority for the Secretary.
- **Resolution Tracking:** Status flow (**Reported → In Progress → Resolved**), visible to the whole society.
- **Secretary Controls:** Secretary can update statuses and append official notes/timeline events to issues.

### 5.2 Out of Scope (For Now)
- Vendor/Maintenance Staff direct platform access.
- Payment, billing, or maintenance fee collection.
- Multi-building complex grouping (currently 1 code = 1 isolated society).
- Direct SMS / Email push notifications (relying on live feed checking).

## 6. User Stories

1. **As a Secretary**, I want to register my building and receive an invite code, so that I can securely onboard my residents.
2. **As a Resident**, I want to join my society using a code, so that I only see issues relevant to my building.
3. **As a Resident**, I want to upvote an existing issue (e.g., "Lift is broken") instead of creating a new one, so the administration knows how many people are affected.
4. **As a Secretary**, I want to sort the issue feed by upvotes, so I can tackle the highest priority problems first.
5. **As a Resident**, I want to see a history/timeline of status changes, so I understand the progress without messaging the secretary.
6. **As a Secretary**, I want to update an issue's status and add an official note, keeping the entire society informed instantly.

## 7. Functional Requirements

### 7.1 Authentication & Onboarding
- **Landing Page:** Ultra-premium aesthetic showcasing two distinct CTAs: "Register Society" and "Enter Your Society".
- **Secretary Registration:** Creates a `society` record. System generates a unique `invite_code`.
- **Resident Registration:** Requires a valid `invite_code` to link the user to the correct `society_id`.

### 7.2 The Society Feed (Dashboard)
- Displays all issues restricted strictly by the user's `society_id`.
- Showcases the Upvote count prominently on the card.
- Allows filtering by Status (Reported vs Resolved).
- **Secretary specific:** Can sort by "Most Upvotes" to determine priority.

### 7.3 Upvoting Logic
- A single resident account can only upvote an issue once.
- Upvoting an issue acts as a "Me Too", preventing timeline clutter and validating the severity of a problem.

### 7.4 Issue Details & Status Flow
- Clicking an issue opens a detailed timeline overlay.
- Lists the original description, all status changes, and any notes added by the Secretary.
- Secretaries see operational controls (Change Status Dropdown, Add Note Textarea).

## 8. Non-Functional Requirements
- **Aesthetics & UI:** Must feel like a high-end enterprise SaaS. Strict elimination of generic emojis/icons. High reliance on glassmorphism, depth, premium typography, and subtle micro-animations.
- **Data Isolation:** Absolutely zero cross-bleed of data between societies. Must be enforced at the database level via Row Level Security (RLS).
- **Responsive:** Fluid interactions across mobile and desktop.

## 9. Data Model (Updated for Multi-Tenant)

**Societies**
- `id`, `name`, `invite_code`, `created_at`

**Profiles**
- `id`, `society_id` (FK), `name`, `flat_number`

**Issues**
- `id`, `society_id` (FK), `reported_by`, `category`, `title`, `description`, `status`, `created_at`, `updated_at`

**Issue Upvotes**
- `issue_id`, `user_id` (Composite Primary Key to prevent double voting)

**Issue Notes / Status Events**
- Track the timeline of updates per issue.

## 10. Tech Stack Execution
- **Frontend:** React 19, Vite, TanStack Router.
- **Styling:** Tailwind CSS v4, Shadcn UI (Customized for premium aesthetics).
- **Backend & Database:** Supabase (PostgreSQL).
- **Security:** Supabase Row Level Security (RLS) enforcing `society_id` tenancy checks.

## 11. Next Development Milestones
| Phase | Focus |
|---|---|
| Stage 1 | Migrate DB Schema to Multi-Tenant (Societies, Upvotes, RLS). |
| Stage 2 | Redesign Landing Page (Aesthetics + Dual Routes). |
| Stage 3 | Build the Secretary "Register Society" Auth Flow. |
| Stage 4 | Build the Resident "Join via Code" Auth Flow. |
| Stage 5 | Integrate Upvoting and Priority sorting into the Live Feed. |
