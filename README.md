# 🏢 SocietyFix

<p align="center">
  A highly scalable, multi-tenant digital administration and community feedback platform built to securely streamline housing society management.
</p>

## 🚀 Overview

SocietyFix modernizes how property managers (Secretaries) and Residents interact perfectly. Built gracefully atop a multi-tenant architecture, the platform enables Secretaries to deploy isolated community instances governed by secure `invite_code` routing mechanisms. Residents bypass chaotic group chats by funneling reports (with photographic evidence) straight to structured, natively upvotable pipelines, establishing democratic priority automatically for the administration.

## ✨ Core Functionality

- 🔐 **Air-Tight Multi-Tenancy**: Data is exclusively isolated between housing communities natively via Supabase Row-Level Security (RLS) constraints.
- ⚡ **Zero-Latency Realtime Sync**: Instantly tracking new issue reports, status timeline progressions, nested secretary dialogues, and upvoting mutations without a single manual UI refresh utilizing `postgres_changes` WebSockets.
- 🗳️ **Democratic Upvoting**: Eliminates duplicate reporting by clustering complaint traffic securely into distinct upvote weights.
- 📢 **Official Broadcasts Board**: Administration can pin massive multi-tenant alert broadcasts straight into Resident feeds dynamically. 
- 📸 **Cloud Native Media Hub**: Native frontend UI capturing securely pipelined field photography directly to isolated AWS-style storage buckets.
- 📊 **Instant Admin Exports**: One-click administrative compilation rendering fully formatted active-case lists direct to `.csv`.

## 🛠️ Technology Stack

- **Frontend Core**: Vite, React 19, TypeScript
- **Styling Architecture**: Tailwind v4 (Heavy glassmorphism & premium UI token adherence), customized `Shadcn` layout models, Lucide Icons.
- **Routing & Fetching**: `@tanstack/react-router` and `@tanstack/react-query`
- **Backend & Database**: Fully managed via **Supabase** (Postgres 15, RLS Polices, Supabase Realtime, Supabase Cloud Storage).

---

## 💻 Local Development Protocol

To tear down the repository to your local rig:

1. **Clone and Install Configuration:**
```bash
git clone https://github.com/mxoizzz/SocietyFix.git
cd SocietyFix
npm install
```

2. **Supply Global Environment Vectors:**  
Duplicate the `.env.example` into a local `.env` and map your active Supabase connection strings parameters:
```env
VITE_SUPABASE_PROJECT_ID="your_project_id"
VITE_SUPABASE_ANON_KEY="your_anon_key"
VITE_SUPABASE_URL="https://your_project.supabase.co"
```

3. **Database Spin Up:**
If setting up a fresh backend, explicitly fire off the bundled SQL files inside the `supabase/` directory (specifically `setup_multitenant_schema.sql` and the associated bucket policies in `/migrations`) sequentially into your active backend's SQL Editor window. 

4. **Launch Application:**
```bash
npm run dev
```

## 🏗️ Deployment
Optimized purely for Edge streaming/static builds. Simply attach this repository to Vercel/Netlify, designate framework to `Vite`, expose your `VITE_SUPABASE_*` secure vars, and run `npm run build`.

---

*Architected autonomously to redefine how housing ecosystems communicate.*
