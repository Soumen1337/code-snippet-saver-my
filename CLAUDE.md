# CLAUDE.md — SnippetVault Project Instructions

> **This file is read automatically at the start of every Claude session.**
> Read it fully before doing anything else.

---

## 1. Project Description

**SnippetVault** is a full-stack developer tool for saving, organizing, and versioning code snippets. It is built as a class prototype to demonstrate a complete product.

- **What it does:** Users sign up, create code snippets in 20+ languages, tag them, search them, and track edits through an automatic version history with a side-by-side diff viewer.
- **Who it's for:** Developers who want to save reusable code — like a personal GitHub Gist with version control built in.
- **Current status:** Prototype is complete and deployed. Active work is now on **backend improvements + UI redesign** (Phase 2).
- **Cost:** $0 — 100% free-tier infrastructure (Supabase free plan + Vercel Hobby plan).

---

## 2. ⚠️ MANDATORY FIRST STEP — Read the Implementation Plan

> **Before writing a single line of code, always open and read:**
> `docs/IMPLEMENTATION_PLAN.md`

This is the primary working document. It tells you:
- What has already been implemented (Phase 1 — Steps 1–20, all complete)
- What you are supposed to build next (Phase 2 — Steps 21–31, all `[ ]`)
- The exact order of steps and substeps
- The commit message for each substep

**Do not skip ahead. Do not assume something is done. Check the plan first.**

---

## 3. Documentation Map

All project documentation lives in the `docs/` folder. Read the relevant doc before making changes in that area.

| File | What it covers | Read when... |
|---|---|---|
| [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md) | **Primary working document.** Step-by-step build plan with commit messages. Phase 1 = done. Phase 2 = your work. | **Always. Read first.** |
| [`docs/PRD.md`](docs/PRD.md) | Product Requirements Document. Vision, users, features, data model, API reference, roadmap. | You need to understand what the product does or why a feature exists. |
| [`docs/BACKEND_PLAN.md`](docs/BACKEND_PLAN.md) | System architecture, database schema, auth flow, API route specs, middleware, security layers, data flow walkthroughs. | You are touching any API route, database query, middleware, or auth logic. |
| [`docs/FRONTEND_PLAN.md`](docs/FRONTEND_PLAN.md) | Component hierarchy, state management, SWR data fetching, type system, styling architecture, performance, accessibility. | You are touching any component, page, hook, or styling. |
| [`docs/UI_REDESIGN.md`](docs/UI_REDESIGN.md) | Full design specification for the Apple × AI-native redesign. Color palette, typography, glassmorphism, animation specs, component-level redesign targets. | You are working on any Phase 2 UI step (Steps 25–31). |

---

## 4. Tech Stack — Quick Reference

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth + `@supabase/ssr` |
| Data fetching | SWR |
| Code highlighting | prism-react-renderer (Night Owl theme) |
| Diff computation | `diff` library (`diffLines()`) |
| Fonts | Inter (body) + JetBrains Mono (code) via `next/font/google` |
| Toasts | sonner |
| Hosting | Vercel (Hobby — free) |
| Validation | zod (being added in Step 21) |

---

## 5. Project File Structure

```
/                          ← Root
├── CLAUDE.md              ← You are here
├── middleware.ts           ← Route protection + session refresh
├── app/
│   ├── layout.tsx          ← Root layout (fonts, theme, toaster)
│   ├── page.tsx            ← Landing page (SSR)
│   ├── globals.css         ← Design tokens + Tailwind config
│   ├── auth/               ← Login, sign-up, error pages
│   ├── dashboard/          ← Main app page (CSR, 'use client')
│   └── api/
│       ├── snippets/       ← GET, POST snippets
│       │   └── [id]/       ← GET, PUT, DELETE single snippet
│       │       └── versions/ ← GET version history
│       └── tags/           ← GET, POST tags
├── components/
│   ├── ui/                 ← 57 shadcn/ui primitive components
│   ├── code-editor.tsx     ← Syntax-highlighted editor (read/write)
│   ├── dashboard-sidebar.tsx
│   ├── snippet-card.tsx
│   ├── snippet-detail-panel.tsx
│   ├── snippet-dialog.tsx
│   ├── version-history.tsx
│   └── diff-viewer.tsx
├── hooks/
│   └── use-debounce.ts     ← 300ms debounce for search
├── lib/
│   ├── types.ts            ← Shared TypeScript interfaces
│   ├── utils.ts            ← cn() helper
│   └── supabase/
│       ├── client.ts       ← Browser-side client
│       ├── server.ts       ← Server-side client (API routes)
│       └── middleware.ts   ← Middleware client + updateSession()
└── docs/                   ← All documentation (see Section 3)
```

---

## 6. Key Rules & Conventions

### 6.1 The Critical Rule (from the Implementation Plan)
> **Mark each substep `[x]` in `docs/IMPLEMENTATION_PLAN.md` immediately after completing it. Never move to the next substep until the current one is done and marked.**

### 6.2 Code Conventions

| Rule | Detail |
|---|---|
| **TypeScript strict mode** | No `any` types. Use types from `lib/types.ts`. |
| **Every API route must check auth** | Call `supabase.auth.getUser()` at the top of every handler. Return `401` if no user. |
| **Every DB query must be user-scoped** | Always add `.eq('user_id', user.id)` on queries. Never return data from other users. |
| **className composition** | Always use the `cn()` helper from `lib/utils.ts` to merge Tailwind classes. |
| **No inline styles** | Use Tailwind utility classes. For design tokens, use CSS variables defined in `globals.css`. |
| **Supabase client selection** | Browser components → `lib/supabase/client.ts`. API routes → `lib/supabase/server.ts`. Middleware → `lib/supabase/middleware.ts`. Never mix them up. |
| **After any create/update/delete** | Call SWR `mutate()` to re-fetch and keep UI in sync with the database. |
| **Colors** | Do not hardcode `emerald` Tailwind classes. Use `primary`, `secondary`, `muted`, `destructive` semantic tokens. (Phase 2 Step 25 changes the primary color from emerald to violet.) |

### 6.3 Commit Message Format

Follow the format used in the Implementation Plan exactly:

```
type(scope): short description

Types: feat, fix, chore, docs, style, refactor, test, perf, security, design, deploy
Examples:
  feat(api): add Zod validation to POST /api/snippets
  design(card): apply glassmorphism and hover glow to snippet cards
  security: verify RLS is active on all tables in Supabase
  perf(api): rewrite snippet listing to use single relational JOIN query
```

Do **not** include "co-authored by Claude" or any AI attribution in commits.

### 6.4 What NOT to Do

- ❌ Do not use `localStorage` for auth tokens — cookies only (`@supabase/ssr` handles this)
- ❌ Do not use Redux, Zustand, or any global state library — SWR + `useState` is sufficient
- ❌ Do not use `document.cookie` directly — use the Supabase client APIs
- ❌ Do not add any paid service, paid API, or paid library — keep cost at $0
- ❌ Do not skip marking substeps complete in the implementation plan
- ❌ Do not start Phase 2 UI work (Steps 25–31) before Phase 2 Backend work (Steps 21–24) is done

---

## 7. Current Work — Phase 2 Summary

The prototype (Phase 1) is 100% complete. You are now working on **Phase 2**.

### Phase 2 — Backend Improvements (Steps 21–24) — ⏳ DO FIRST

| Step | Task | Status |
|---|---|---|
| 21 | Add Zod input validation to all API routes | `[ ]` Not started |
| 22 | Verify RLS policies are active on Supabase | `[ ]` Not started |
| 23 | Rewrite snippet listing to use a single server-side JOIN | `[ ]` Not started |
| 24 | Add success/error toast notifications (sonner) | `[ ]` Not started |

### Phase 2 — UI Redesign (Steps 25–31) — ⏳ DO AFTER BACKEND

| Step | Task | Status |
|---|---|---|
| 25 | Replace emerald tokens with violet/cyan design system | `[ ]` Not started |
| 26 | Landing page redesign (glassmorphism, gradient hero) | `[ ]` Not started |
| 27 | Auth pages redesign (glass card, gradient button) | `[ ]` Not started |
| 28 | Dashboard & sidebar redesign | `[ ]` Not started |
| 29 | Snippet card redesign (glass cards, hover glow) | `[ ]` Not started |
| 30 | Detail panel & dialog redesign | `[ ]` Not started |
| 31 | Final audit, build check, re-deploy | `[ ]` Not started |

> For full substep details and commit messages → see `docs/IMPLEMENTATION_PLAN.md`

---

## 8. Database Schema — Quick Reference

```
auth.users          ← Managed by Supabase Auth
    │
    ├── snippets (id, user_id, title, description, language, current_content, created_at, updated_at)
    │       │
    │       ├── snippet_versions (id, snippet_id, version_number, content, commit_message, created_at)
    │       │
    │       └── snippet_tags (snippet_id, tag_id)  ← junction table
    │
    └── tags (id, user_id, name)
```

All tables have RLS enabled. All queries are scoped by `user_id`.

---

## 9. Environment Variables

Required in `.env.local` (never commit this file):

```env
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Get these from: Supabase Dashboard → Project Settings → API.

---

## 10. Running the Project

```bash
# Development
npm run dev           # Starts at http://localhost:3000

# Build check (before deploying)
npm run build         # Must exit 0 with no errors

# Lint
npm run lint
```

Deployment is automatic: push to `main` on GitHub → Vercel auto-deploys.

---

*Last updated: April 7, 2026 — SnippetVault v2.0*
