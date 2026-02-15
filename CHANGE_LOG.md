# Change Log

Significant changes to the School Transparency website. **Tigger: update this file after completing any feature, fix, or structural change.**

| Date | Change | Details |
|------|--------|---------|
| Feb 2026 | 3 cities live | HCMC, Hanoi, Bangkok — full data via pipeline |
| Feb 2026 | Submission tables created | user_submissions, school_reviews, local_intel_submissions, housing_submissions, salary_submissions — all live in Supabase |
| Feb 2026 | Submission system built | School review + local intel forms, email verification, admin dashboard, Zod validation |
| 2026-02-15 | **MAJOR PUSH — Full submission system + project infrastructure** | See details below |

---

## 2026-02-15 — Major Push Details

**Tigger: Read this carefully.** This commit (`6f51113`) landed 43 files / 6,084 lines. Here's everything that's now in the repo and what state it's in.

### Submission Forms (LIVE on city pages)

| Form | Component | Trigger Location | API Route | Status |
|------|-----------|-----------------|-----------|--------|
| **School Reviews** | `src/components/submissions/SchoolReviewModal.js` | Dropdown + "Write Review" button in `SchoolSection.js` | `/api/submissions/school-review` | **Front-end + backend working** |
| **Local Intel Tips** | `src/components/submissions/LocalIntelModal.js` | "Submit Your Tip" button in `LocalIntelSection.js` | `/api/submissions/local-intel` | **Front-end + backend working** |
| **Housing** | *No modal yet* | *No button yet* | `/api/submissions/housing` | **Backend API only — front-end TODO** |
| **Salary** | *No modal yet* | *No button yet* | `/api/submissions/salary` | **Backend API only — front-end TODO** |

### Email Verification System
- `src/lib/email/resend-client.js` — Resend SDK client (lazy-loaded)
- `src/lib/email/templates.js` — Verification, approval, and rejection email templates
- `src/app/api/submissions/verify/route.js` — Token verification endpoint
- `src/app/submission-verified/page.js` — Success page after clicking email link
- **Flow:** Submit → email with token link (24hr expiry) → click verifies → admin reviews

### Admin Dashboard
- `src/app/admin/page.js` — Password-protected dashboard (ADMIN_PASSWORD env var)
- `src/app/api/admin/submissions/route.js` — List submissions with status filters
- `src/app/api/admin/submissions/[id]/route.js` — Approve/reject individual submissions
- **Features:** Filter by status (pending/approved/rejected), view full details, rejection reason required

### Validation
- `src/lib/validation/submission-schemas.js` — Zod schemas for all 4 submission types

### Database
- `database/create_submission_tables.sql` — Full schema: 5 tables, RLS policies, indexes
- `database/performance_indexes.sql` — Additional query performance indexes
- **All tables confirmed live in Supabase** (created Feb 2026)

### Shared Components
- `src/components/common/Footer.js` — Site footer
- `src/components/common/ProgressiveLoader.js` — Lazy loading wrapper
- `src/components/common/SectionSkeleton.js` — Loading skeleton for sections

### Project Docs (reference only — do NOT implement TODOs from these)
- `ARCHITECTURE.md` — Technical architecture reference
- `ROADMAP.md` — Future plans (JP-gated, not Tigger's to action)
- `COMPLIANCE_TODO.md` — Security/compliance checklist
- `CLAUDE.md` — Tigger's agent instructions and role boundaries

### Scripts & Utilities (maintenance tools, not part of the app)
- `scripts/seed-bangkok.js`, `scripts/seed-hanoi.js`, `scripts/add-hcmc-mock-data.js` — Data seeding
- `scripts/bangkok-bulk-data.json`, `scripts/hcmc-local-intel-mock-data.json` — Seed data payloads
- `check-duplicates.js`, `cleanup-duplicates.js`, `CLEANUP_DUPLICATES_SQL.sql` — Duplicate cleanup
- `HCMC_MOCK_DATA_SQL.sql` — HCMC test data

### Known Issues / Next Steps (for JP to prioritize)
1. **`NEXT_PUBLIC_SITE_URL` is `http://localhost:3000`** — Verification email links point to localhost, not production. Needs updating in Vercel env vars.
2. **Vercel env vars** — Confirm `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `ADMIN_PASSWORD`, and `NEXT_PUBLIC_SITE_URL` are set in Vercel dashboard.
3. **Resend domain** — Emails send from `submissions@schooltransparency.com`. Domain must be verified in Resend.
4. **No "Add New School" option** — School review dropdown only shows existing schools. Teachers can't suggest new ones. JP has approved a design for this (inline dropdown option → combined form). Not built yet.
5. **Housing + Salary modals** — Backend APIs ready, front-end forms still needed.
