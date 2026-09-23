# Product Requirements Document (PRD)
## SocietyFix — Multi-Tenant Community Management Platform

**Version:** 3.0 (Production Candidate)
**Status:** Developed & Deployed

---

## 1. Purpose
SocietyFix is a scalable, multi-tenant SaaS platform that empowers housing societies to digitally manage common-area issues. It centralizes reports, introduces democratic prioritization through resident upvoting, and gives the society secretary a powerful dashboard to resolve problems transparently. Ultimately, it brings clarity to chaos.

## 2. Problem Statement
Residents currently report issues through chaotic group chats, leading to lost complaints, redundant reporting, and zero visibility on progress. Secretaries are overwhelmed with repetitive complaints and struggle to identify which issues impact the most residents, making prioritization difficult. Top-down broadcasting is broken.

## 3. Goals & Success Metrics

| Goal | Metric |
|---|---|
| Streamlined Onboarding | Secretaries can register a society and generate an invite code in < 2 mins |
| Reduce Redundant Complaints | 80% adoption of the "Upvote" feature instead of duplicate reporting |
| Increase Transparency | 100% of issues show a live status and history visible to the society |
| Improve Prioritization | Secretaries can sort dashboards by "Most Upvoted" to target critical issues |
| Zero-Latency Comms | Sub-second realtime rendering via WebSockets to prevent double-entries |

## 4. Users & Roles

| Role | Description | Key Actions |
|---|---|---|
| **Secretary** (Admin) | Society committee member / Creator | Registers Society, generates Invite, Views all issues, Upgrades status, adds notes, exports CSVs, Publishes Broadcasts. |
| **Resident** | Flat owner/tenant | Registers using Society Invite Code, Reports issues (with photo evidence), Upvotes existing issues, Reads broadcasts. |

## 5. Scope

### 5.1 In Scope (Implemented)
- **Multi-Tenant Onboarding:** 
  - Secretary flow: Register → Name Society → Generate Unique Invite Code.
  - Resident flow: Register → Input Invite Code → Access Isolated Society Space.
- **Zero-Latency Realtime Sync:** Utilizing Supabase WebSockets (`postgres_changes`), the entire UI reacts instantly to db mutations (upvotes, new issues, notes) without refresh.
- **Live Society Feed:** A transparent dashboard showing all problems occurring in the specific society.
- **Reporting System with Media:** Report an issue with category, title, description, and AWS S3-style Supabase Storage bucket photo uploads.
- **Democratic Upvoting:** Residents can upvote an issue to signal their agreement/impact, automatically bumping its priority for the Secretary.
- **Official Broadcast Noticeboard:** Secretaries can publish heavily styled, top-level pinned announcements straight into Resident feeds.
- **Resolution Tracking:** Status flow (**Reported → In Progress → Resolved**), visible to the whole society.
- **Administrative Exports:** One-click CSV downloading mapping all current socket issues for committee meetings.

### 5.2 Out of Scope (Future)
- Payment, billing, or maintenance fee collection.
- Multi-building complex grouping (currently 1 code = 1 isolated society).
- Direct SMS / Email push notifications.

## 6. User Stories

1. **As a Secretary**, I want to register my building and receive an invite code, so that I can securely onboard my residents.
2. **As a Resident**, I want to join my society using a code, so that I only see issues relevant to my building.
3. **As a Resident**, I want to upvote an existing issue instead of creating a new one, so the administration knows how many people varyingly affected.
4. **As a Secretary**, I want to export the entire issue grid to a CSV so I can present it directly at monthly committee meetings.
5. **As a Resident**, I want to attach photographic evidence to my reports so building management understands the full scope.
6. **As a Secretary**, I want to rapidly push structural or timeline announcements to all residents via a Broadcast feature safely overriding normal chat limitations.

## 7. Functional Requirements

### 7.1 Authentication & Onboarding
- **Landing Page:** Ultra-premium aesthetic showcasing distinct CTAs: "Register Society" and "Enter Your Society".
- **Database Rules:** Rigid Row-Level Security explicitly preventing cross-tenant data bleed.

### 7.2 The Society Feed (Dashboard)
- Displays all issues restricted strictly by the user's `society_id`.
- Features Top-Level injected Broadcasts in golden-amber styling.
- Live-render engine capturing image evidence dynamically.

### 7.3 Upvoting Logic
- A single resident account can only upvote an issue once (Composite Primary Key enforced on DB).
- Upvoting an issue acts as a "Me Too", preventing timeline clutter.

## 8. Non-Functional Requirements
- **Aesthetics & UI:** Must feel like a high-end enterprise SaaS. Strict elimination of generic emojis/icons. High reliance on glassmorphism, depth, premium typography, custom SVGs, and subtle micro-animations.
- **Data Isolation:** Absolutely zero cross-bleed of data between societies.

## 9. Data Model 

**Societies** (`id`, `name`, `invite_code`, `created_at`)
**Profiles** (`id`, `society_id`, `name`, `flat_number`)
**Issues** (`id`, `society_id`, `reported_by`, `category`, `title`, `description`, `status`, `photo_url`, `created_at`, `updated_at`)
**Issue Upvotes** (`issue_id`, `user_id`)
**Notices** (`id`, `society_id`, `title`, `content`, `author`, `created_at`)
**Storage** (`issue_evidence` bucket explicitly configured for Public reads and Authenticated push writes)

## 10. Tech Stack Execution
- **Frontend Integration:** React 19, Vite, TanStack Router.
- **Styling Matrix:** Tailwind CSS v4, Lucide Icons, Shadcn components.
- **Backend Frame:** Supabase (Postgres 15, RLS Polices, Supabase Realtime, Global Object Storage).
