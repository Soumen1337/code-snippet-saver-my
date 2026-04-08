# SnippetVault — Implementation Plan

**Version:** 2.0  
**Date:** April 7, 2026  
**Based On:** PRD.md, BACKEND_PLAN.md, FRONTEND_PLAN.md, UI_REDESIGN.md

---

> ## ⚠️ CRITICAL RULE
>
> **Each step and substep MUST be marked as complete (`[x]`) after implementation, before moving to the next step. No skipping ahead.**
>
> - `[ ]` — Not started
> - `[~]` — In progress
> - `[x]` — Complete
>
> Follow the steps in order. Do not jump ahead to a later step until all substeps in the current step are marked `[x]`.

---

## How to Read This Plan

This plan is split into **two phases**:

| Phase | Steps | Status | Description |
|---|---|---|---|
| **Phase 1** | Steps 1–20 | ✅ All complete | The original prototype — already built and working |
| **Phase 2** | Steps 21–27 | ⏳ Not started | UI redesign + improvements — this is the work you are doing NOW |

> **Why is Phase 1 all ticked?**  
> Because the prototype is already built and running. Steps 1–20 document what was already implemented so you have a complete history of the project. The actual work you need to do starts at **Step 21**.

---

## Table of Contents

### Phase 1 — Prototype (Already Complete ✅)
1. [Step 1: Project Initialization & Tooling](#step-1-project-initialization--tooling)
2. [Step 2: Supabase Setup & Database Schema](#step-2-supabase-setup--database-schema)
3. [Step 3: Authentication System](#step-3-authentication-system)
4. [Step 4: Core API Routes — Snippets](#step-4-core-api-routes--snippets)
5. [Step 5: Core API Routes — Tags & Versions](#step-5-core-api-routes--tags--versions)
6. [Step 6: Frontend Foundation — Layout & Styling](#step-6-frontend-foundation--layout--styling)
7. [Step 7: Landing Page](#step-7-landing-page)
8. [Step 8: Auth Pages](#step-8-auth-pages)
9. [Step 9: Dashboard — Core Structure](#step-9-dashboard--core-structure)
10. [Step 10: Snippet Card & Grid](#step-10-snippet-card--grid)
11. [Step 11: Code Editor Component](#step-11-code-editor-component)
12. [Step 12: Snippet Create/Edit Dialog](#step-12-snippet-createedit-dialog)
13. [Step 13: Snippet Detail Panel](#step-13-snippet-detail-panel)
14. [Step 14: Version History & Diff Viewer](#step-14-version-history--diff-viewer)
15. [Step 15: Search & Filtering](#step-15-search--filtering)
16. [Step 16: Sidebar & Navigation](#step-16-sidebar--navigation)
17. [Step 17: Dark/Light Theme](#step-17-darklight-theme)
18. [Step 18: Polish, Error Handling & Edge Cases](#step-18-polish-error-handling--edge-cases)
19. [Step 19: Deployment](#step-19-deployment)
20. [Step 20: Documentation](#step-20-documentation)

### Phase 2 — Backend Improvements (Do This First ⏳)
21. [Step 21: Input Validation with Zod](#step-21-input-validation-with-zod)
22. [Step 22: Verify RLS Policies on Supabase](#step-22-verify-rls-policies-on-supabase)
23. [Step 23: Server-Side Tag Filtering](#step-23-server-side-tag-filtering)
24. [Step 24: Success Toasts & API Error Feedback](#step-24-success-toasts--api-error-feedback)

### Phase 2 — UI Redesign (Do This After Backend ⏳)
25. [Step 25: New Design Token System](#step-25-new-design-token-system)
26. [Step 26: Landing Page Redesign](#step-26-landing-page-redesign)
27. [Step 27: Auth Pages Redesign](#step-27-auth-pages-redesign)
28. [Step 28: Dashboard & Sidebar Redesign](#step-28-dashboard--sidebar-redesign)
29. [Step 29: Snippet Card Redesign](#step-29-snippet-card-redesign)
30. [Step 30: Detail Panel & Dialog Redesign](#step-30-detail-panel--dialog-redesign)
31. [Step 31: Final Polish & Re-deployment](#step-31-final-polish--re-deployment)

---

## Step 1: Project Initialization & Tooling

**Goal:** Set up the development environment, initialize the Next.js project, and install all dependencies.

- [x] **1.1** Initialize Next.js 16 project with TypeScript, App Router, and Tailwind CSS v4  
  ```
  npx create-next-app@latest ./ --typescript --tailwind --app --src-dir=false
  ```
  > Commit: `init: scaffold Next.js 16 project with TypeScript and Tailwind`

- [x] **1.2** Install UI component library (shadcn/ui) and initialize with default config  
  ```
  npx shadcn@latest init
  ```
  > Commit: `chore: initialize shadcn/ui component library`

- [x] **1.3** Install core dependencies  
  ```
  npm install @supabase/supabase-js @supabase/ssr swr prism-react-renderer diff
  npm install react-hook-form zod date-fns next-themes sonner lucide-react
  ```
  > Commit: `chore: install Supabase, SWR, Prism, diff, and utility dependencies`

- [x] **1.4** Install shadcn/ui components needed for the app  
  ```
  npx shadcn@latest add button card dialog sheet input textarea select badge
  npx shadcn@latest add tabs label alert-dialog tooltip separator
  ```
  > Commit: `chore: add shadcn/ui components (button, card, dialog, sheet, etc.)`

- [x] **1.5** Create project folder structure  
  ```
  mkdir components lib lib/supabase hooks app/auth app/dashboard app/api
  ```
  > Commit: `chore: create project directory structure`

- [x] **1.6** Create `.env.local` file with Supabase environment variable placeholders  
  ```
  NEXT_PUBLIC_SUPABASE_URL=your_project_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
  ```
  > Commit: `chore: add .env.local template for Supabase credentials`

- [x] **1.7** Add `.env.local` to `.gitignore` to prevent secrets from being committed  
  > Commit: `chore: add .env.local to gitignore`

---

## Step 2: Supabase Setup & Database Schema

**Goal:** Create the Supabase project (free tier), design the database schema, and run migration scripts.

- [x] **2.1** Create a new Supabase project on the free plan at [supabase.com](https://supabase.com)  
  - Select region closest to your users  
  - Copy the Project URL and Anon Key into `.env.local`  
  > Commit: `config: connect Supabase project and set environment variables`

- [x] **2.2** Create the `snippets` table in Supabase SQL Editor  
  ```sql
  CREATE TABLE public.snippets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    language TEXT NOT NULL,
    current_content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
  );
  CREATE INDEX idx_snippets_user_id ON public.snippets(user_id);
  CREATE INDEX idx_snippets_language ON public.snippets(language);
  CREATE INDEX idx_snippets_updated_at ON public.snippets(updated_at DESC);
  ```
  > Commit: `db: create snippets table with indexes`

- [x] **2.3** Create the `snippet_versions` table  
  ```sql
  CREATE TABLE public.snippet_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    snippet_id UUID REFERENCES public.snippets(id) ON DELETE CASCADE NOT NULL,
    version_number INTEGER NOT NULL,
    content TEXT NOT NULL,
    commit_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE (snippet_id, version_number)
  );
  CREATE INDEX idx_snippet_versions_snippet_id ON public.snippet_versions(snippet_id);
  ```
  > Commit: `db: create snippet_versions table with unique constraint`

- [x] **2.4** Create the `tags` table  
  ```sql
  CREATE TABLE public.tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    UNIQUE (user_id, name)
  );
  CREATE INDEX idx_tags_user_id ON public.tags(user_id);
  ```
  > Commit: `db: create tags table with user-scoped unique constraint`

- [x] **2.5** Create the `snippet_tags` junction table  
  ```sql
  CREATE TABLE public.snippet_tags (
    snippet_id UUID REFERENCES public.snippets(id) ON DELETE CASCADE NOT NULL,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (snippet_id, tag_id)
  );
  ```
  > Commit: `db: create snippet_tags junction table for many-to-many relationship`

- [x] **2.6** Enable Row Level Security (RLS) on all tables and create access policies  
  ```sql
  ALTER TABLE public.snippets ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.snippet_versions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.snippet_tags ENABLE ROW LEVEL SECURITY;
  -- Create SELECT/INSERT/UPDATE/DELETE policies for each table
  ```
  > Commit: `db: enable RLS and create user-scoped access policies`

- [x] **2.7** Test schema by inserting a sample row via Supabase dashboard and verifying relationships  
  > Commit: `test: verify database schema and relationships`

---

## Step 3: Authentication System

**Goal:** Implement Supabase Auth with email/password, set up three client configurations, and add middleware for route protection.

- [x] **3.1** Create the browser-side Supabase client (`lib/supabase/client.ts`)  
  - Uses `createBrowserClient` from `@supabase/ssr`  
  - Reads `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
  > Commit: `feat(auth): add browser-side Supabase client`

- [x] **3.2** Create the server-side Supabase client (`lib/supabase/server.ts`)  
  - Uses `createServerClient` with `cookies()` from `next/headers`  
  - Used in API routes and server components  
  > Commit: `feat(auth): add server-side Supabase client with cookie handling`

- [x] **3.3** Create the middleware Supabase client (`lib/supabase/middleware.ts`)  
  - Implements `updateSession()` function  
  - Refreshes JWT cookies on every request  
  - Redirects unauthenticated users from `/dashboard` to `/auth/login`  
  - Redirects authenticated users from `/auth/login` to `/dashboard`  
  > Commit: `feat(auth): add middleware helper for session refresh and route protection`

- [x] **3.4** Create the root middleware file (`middleware.ts`)  
  - Calls `updateSession(request)` from the middleware helper  
  - Configures matcher to exclude static files and images  
  > Commit: `feat(auth): add Next.js middleware for auth session management`

- [x] **3.5** Verify auth flow works end-to-end  
  - Sign up a test user via Supabase dashboard  
  - Confirm middleware redirects work (`/dashboard` → `/auth/login` when logged out)  
  > Commit: `test: verify authentication flow and middleware redirects`

---

## Step 4: Core API Routes — Snippets

**Goal:** Build the CRUD API endpoints for snippets with authentication checks, user scoping, and versioning.

- [x] **4.1** Create `GET /api/snippets` route (`app/api/snippets/route.ts`)  
  - Authenticates user via `supabase.auth.getUser()`  
  - Fetches all snippets for the authenticated user, ordered by `updated_at DESC`  
  - Supports query params: `search` (ILIKE on title/description/content), `language` (exact match)  
  - Fetches `snippet_tags` and `tags`, joins them in-memory to build `SnippetWithTags[]`  
  - Supports `tags` param for AND-filter logic  
  > Commit: `feat(api): add GET /api/snippets with search, language, and tag filtering`

- [x] **4.2** Create `POST /api/snippets` route (same file)  
  - Validates required fields: `title`, `content`, `language`  
  - Inserts into `snippets` table  
  - Creates initial `snippet_versions` row (version_number: 1)  
  - Inserts `snippet_tags` junction rows if `tagIds` provided  
  > Commit: `feat(api): add POST /api/snippets with versioning and tag linking`

- [x] **4.3** Create `GET /api/snippets/[id]` route (`app/api/snippets/[id]/route.ts`)  
  - Fetches single snippet by ID, scoped to authenticated user  
  - Returns 404 if not found or not owned by user  
  > Commit: `feat(api): add GET /api/snippets/[id] for single snippet retrieval`

- [x] **4.4** Create `PUT /api/snippets/[id]` route (same file)  
  - Updates snippet metadata (title, description, language, content)  
  - If `current_content` changed: creates new `snippet_versions` row with incremented version number  
  - Replaces all `snippet_tags` (delete existing + insert new)  
  - Updates `updated_at` timestamp  
  > Commit: `feat(api): add PUT /api/snippets/[id] with auto-versioning on content change`

- [x] **4.5** Create `DELETE /api/snippets/[id]` route (same file)  
  - Deletes snippet scoped to user  
  - CASCADE automatically removes related versions and tags  
  > Commit: `feat(api): add DELETE /api/snippets/[id] with cascade cleanup`

- [x] **4.6** Test all snippet CRUD operations using browser dev tools or Postman  
  - Verify create returns snippet with ID  
  - Verify list returns created snippets  
  - Verify update creates new version  
  - Verify delete removes snippet and related data  
  > Commit: `test: verify snippet CRUD API routes`

---

## Step 5: Core API Routes — Tags & Versions

**Goal:** Build the API endpoints for tag management and version history retrieval.

- [x] **5.1** Create `GET /api/tags` route (`app/api/tags/route.ts`)  
  - Returns all tags for the authenticated user, ordered by name  
  > Commit: `feat(api): add GET /api/tags for user-scoped tag listing`

- [x] **5.2** Create `POST /api/tags` route (same file)  
  - Validates `name` is a non-empty string  
  - Inserts new tag with `user_id`  
  - Handles unique constraint violation (error code `23505`) → returns 409 Conflict  
  > Commit: `feat(api): add POST /api/tags with duplicate detection`

- [x] **5.3** Create `GET /api/snippets/[id]/versions` route (`app/api/snippets/[id]/versions/route.ts`)  
  - Verifies snippet ownership before returning versions  
  - Returns all versions ordered by `version_number DESC` (latest first)  
  > Commit: `feat(api): add GET /api/snippets/[id]/versions for version history`

- [x] **5.4** Test tag creation, duplicate handling, and version history endpoints  
  > Commit: `test: verify tag and version API routes`

---

## Step 6: Frontend Foundation — Layout & Styling

**Goal:** Set up the root layout, global CSS design tokens, fonts, and theme infrastructure.

- [x] **6.1** Define shared TypeScript types (`lib/types.ts`)  
  - Create interfaces: `Snippet`, `SnippetVersion`, `Tag`, `SnippetTag`, `SnippetWithTags`  
  - Define `Language` type union and `SUPPORTED_LANGUAGES` constant array  
  - Define `QUICK_FILTER_LANGUAGES` for the language chip bar  
  > Commit: `feat(types): add shared TypeScript interfaces and language constants`

- [x] **6.2** Create utility functions (`lib/utils.ts`)  
  - Implement `cn()` helper using `clsx` + `tailwind-merge` for className composition  
  > Commit: `feat(utils): add className merge utility`

- [x] **6.3** Set up global CSS design tokens (`app/globals.css`)  
  - Define light theme CSS variables (`:root`)  
  - Define dark theme CSS variables (`.dark`)  
  - Use `oklch` color space for perceptually uniform colors  
  - Map CSS variables to Tailwind tokens via `@theme` block  
  - Add base layer resets (border-color, body background)  
  > Commit: `feat(theme): add design tokens for light and dark themes`

- [x] **6.4** Configure root layout (`app/layout.tsx`)  
  - Load Inter font (body text) and JetBrains Mono (code) via `next/font/google`  
  - Wrap app in `ThemeProvider` from `next-themes`  
  - Set default theme to `dark`, enable system preference detection  
  - Add Vercel Analytics component  
  - Set page metadata (title, description)  
  > Commit: `feat(layout): add root layout with fonts, theme provider, and analytics`

- [x] **6.5** Create `ThemeProvider` wrapper component (`components/theme-provider.tsx`)  
  - Wraps `next-themes` `ThemeProvider` with `attribute="class"`  
  > Commit: `feat(theme): add ThemeProvider wrapper component`

---

## Step 7: Landing Page

**Goal:** Build the marketing landing page with hero section and feature cards.

- [x] **7.1** Create the landing page (`app/page.tsx`)  
  - Server component (no `'use client'` — fast SSR)  
  - Hero section with title, description, and CTA buttons ("Get Started", "Learn More")  
  - Feature grid (3 cards): Version Control, Smart Search, Multi-Language  
  - Navigation: links to `/auth/login` and `/auth/sign-up`  
  - Use Lucide icons: `Code2`, `GitBranch`, `Search`, `Layers`  
  > Commit: `feat(landing): add landing page with hero section and feature cards`

- [x] **7.2** Style landing page with Tailwind classes  
  - Gradient background effects  
  - Hover effects on feature cards  
  - Responsive layout (stacks on mobile)  
  > Commit: `style(landing): add responsive styling and hover effects`

---

## Step 8: Auth Pages

**Goal:** Build login, sign-up, sign-up success, and auth error pages.

- [x] **8.1** Create login page (`app/auth/login/page.tsx`)  
  - Email and password form inputs  
  - `signInWithPassword()` call on submit  
  - Error message display  
  - Link to sign-up page  
  - Redirect to `/dashboard` on success  
  > Commit: `feat(auth): add login page with email/password form`

- [x] **8.2** Create sign-up page (`app/auth/sign-up/page.tsx`)  
  - Email and password form inputs  
  - Password confirmation field  
  - `signUp()` call on submit  
  - Redirect to sign-up success page  
  - Link to login page  
  > Commit: `feat(auth): add sign-up page with email confirmation flow`

- [x] **8.3** Create sign-up success page (`app/auth/sign-up-success/page.tsx`)  
  - Confirmation message: "Check your email to verify your account"  
  - Link back to login page  
  > Commit: `feat(auth): add sign-up success confirmation page`

- [x] **8.4** Create auth error page (`app/auth/error/page.tsx`)  
  - Displays auth error message from URL search params  
  - Link back to login page  
  > Commit: `feat(auth): add auth error page`

- [x] **8.5** Test complete auth flow: sign up → email confirm → login → dashboard → sign out  
  > Commit: `test: verify end-to-end authentication flow`

---

## Step 9: Dashboard — Core Structure

**Goal:** Build the dashboard page scaffold with layout (sidebar + main area), SWR data fetching, and state management.

- [x] **9.1** Create the dashboard page (`app/dashboard/page.tsx`)  
  - Mark as `'use client'` (client-side rendering for interactivity)  
  - Set up state variables: `searchQuery`, `debouncedSearch`, `selectedLanguage`, `selectedTagIds`, `selectedSnippet`, `editingSnippet`, `isDialogOpen`  
  - Implement SWR data fetching with dynamic URL key construction based on filters  
  - Create `handleSaveSnippet` callback (create or update)  
  - Render: Sidebar + Main Area (header + search + grid or empty state)  
  > Commit: `feat(dashboard): add dashboard page with SWR data fetching and state management`

- [x] **9.2** Create the `useDebounce` custom hook (`hooks/use-debounce.ts`)  
  - Accepts a value and delay (300ms)  
  - Returns debounced value using `setTimeout` + `useEffect`  
  > Commit: `feat(hooks): add useDebounce hook for search input`

- [x] **9.3** Create the SWR fetcher utility  
  - Generic `fetch` wrapper that throws on non-OK responses  
  - Used by all SWR hooks in the dashboard  
  > Commit: `feat(data): add SWR fetcher utility`

---

## Step 10: Snippet Card & Grid

**Goal:** Build the snippet card component and render them in a responsive grid on the dashboard.

- [x] **10.1** Create the SnippetCard component (`components/snippet-card.tsx`)  
  - Display: title, description preview, language badge, tag badges  
  - Code preview: first 6 lines with syntax highlighting (read-only CodeEditor)  
  - Timestamp: relative time ("2h ago") using `date-fns` `formatDistanceToNow`  
  - Copy button: appears on hover, copies full code to clipboard  
  - Click handler: opens detail panel  
  > Commit: `feat(ui): add SnippetCard component with code preview and copy button`

- [x] **10.2** Render snippet grid in the dashboard  
  - 3-column responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)  
  - Each card renders a SnippetCard component  
  - Empty state: icon + "No snippets yet" message  
  > Commit: `feat(dashboard): render snippet grid with responsive layout`

---

## Step 11: Code Editor Component

**Goal:** Build the dual-mode code editor (read-only viewer + editable textarea with live syntax highlighting).

- [x] **11.1** Create the CodeEditor component (`components/code-editor.tsx`)  
  - Props: `value`, `onChange`, `language`, `readOnly`, `className`  
  - Define `languageMap` mapping Language type → Prism grammar names  
  - Use `prism-react-renderer` with Night Owl theme  
  > Commit: `feat(ui): add CodeEditor component skeleton with language mapping`

- [x] **11.2** Implement read-only mode  
  - Render `<Highlight>` component with line numbers  
  - Non-selectable line numbers (`select-none`)  
  - Dark code background (`bg-[#0d1117]`)  
  - Scrollable overflow for long code  
  > Commit: `feat(ui): add CodeEditor read-only mode with line numbers`

- [x] **11.3** Implement edit mode  
  - Transparent `<textarea>` overlay (z-10) for capturing user input  
  - `<Highlight>` preview below (pointer-events-none) for visual rendering  
  - Caret color set to white, text set to transparent  
  - Both layers share identical font-size, font-family, padding, and line-height  
  > Commit: `feat(ui): add CodeEditor edit mode with live syntax highlighting overlay`

---

## Step 12: Snippet Create/Edit Dialog

**Goal:** Build the modal dialog for creating new snippets and editing existing ones.

- [x] **12.1** Create the SnippetDialog component (`components/snippet-dialog.tsx`)  
  - Props: `open`, `onOpenChange`, `snippet` (null for create, populated for edit), `onSave`, `availableTags`  
  - Form fields: title (required), language (select dropdown), description (optional textarea), code (CodeEditor in edit mode), tags (toggle buttons), commit message (edit mode only)  
  - Submit handler: validates required fields (title + content), calls `onSave` with form data  
  - Loading state: disabled button + spinner during save  
  > Commit: `feat(ui): add SnippetDialog component for create and edit modes`

- [x] **12.2** Implement form pre-population for edit mode  
  - `useEffect` watches `snippet` and `open` state  
  - When `snippet` is provided: fills all fields with existing values  
  - When `snippet` is null: resets all fields to defaults  
  > Commit: `feat(ui): add edit mode pre-population for SnippetDialog`

- [x] **12.3** Implement tag toggle functionality  
  - Display available tags as toggle buttons  
  - Selected tags use `bg-emerald-600` style  
  - Click toggles a tag in/out of `selectedTagIds`  
  > Commit: `feat(ui): add tag toggle selection in SnippetDialog`

- [x] **12.4** Wire SnippetDialog into dashboard page  
  - "New Snippet" button opens dialog with `snippet=null`  
  - "Edit" button in detail panel opens dialog with `snippet=selectedSnippet`  
  - `onSave` calls `POST` or `PUT` API route, then `mutate()` to refresh  
  > Commit: `feat(dashboard): wire SnippetDialog to create and edit flows`

---

## Step 13: Snippet Detail Panel

**Goal:** Build the right-side slide-in panel that shows full snippet details, code, and version history.

- [x] **13.1** Create the SnippetDetailPanel component (`components/snippet-detail-panel.tsx`)  
  - Uses `Sheet` component from shadcn/ui (slides in from right)  
  - Props: `snippet`, `open`, `onOpenChange`, `onEdit`, `onDelete`  
  - Header: title, description, language badge, tag badges  
  - Actions: Copy, Edit, Delete buttons  
  > Commit: `feat(ui): add SnippetDetailPanel with header and action buttons`

- [x] **13.2** Add tabbed content area  
  - Three tabs: "Code", "History", "Diff" (Diff tab only visible when 2 versions selected)  
  - Code tab: full CodeEditor in read-only mode  
  - History tab: VersionHistory component  
  - Diff tab: DiffViewer component  
  > Commit: `feat(ui): add tabbed content area (Code/History/Diff) to detail panel`

- [x] **13.3** Fetch version history with SWR  
  - Conditional SWR fetch: only when `snippet` is non-null  
  - Key: `/api/snippets/${snippet.id}/versions`  
  - Manage `selectedVersions` state: `[SnippetVersion | null, SnippetVersion | null]`  
  > Commit: `feat(ui): add SWR version history fetching in detail panel`

- [x] **13.4** Implement delete with confirmation dialog  
  - Uses `AlertDialog` from shadcn/ui  
  - "Are you sure you want to delete this snippet?" with Cancel/Delete buttons  
  - Delete calls `DELETE /api/snippets/[id]`, then `mutate()` + close panel  
  > Commit: `feat(ui): add delete confirmation dialog to detail panel`

---

## Step 14: Version History & Diff Viewer

**Goal:** Build the version timeline and side-by-side diff comparison components.

- [x] **14.1** Create the VersionHistory component (`components/version-history.tsx`)  
  - Timeline UI: vertical line with version dots  
  - Each version shows: version badge (v1, v2...), "Latest" badge on newest, commit message, timestamp  
  - Click a version: selects it for diff (max 2 selections)  
  - "Clear" button: deselects all versions  
  - Selection status banner: "Select another version to compare" / "Two versions selected"  
  > Commit: `feat(ui): add VersionHistory timeline with diff selection`

- [x] **14.2** Create the DiffViewer component (`components/diff-viewer.tsx`)  
  - Uses `diffLines()` from the `diff` library  
  - Auto-sorts versions (older on left, newer on right) via `useMemo`  
  - Header: version badges (v1 → v3) + stats (+N added, -N removed)  
  - Version info: commit messages + timestamps for both versions  
  - Diff block rendering: green lines (added), red lines (removed), default (unchanged)  
  > Commit: `feat(ui): add DiffViewer with line-by-line comparison`

- [x] **14.3** Create the internal DiffBlock sub-component  
  - Splits change value by newlines  
  - Applies colored backgrounds: `bg-emerald-500/20` (added), `bg-red-500/20` (removed)  
  - Adds prefix symbols: `+` (added), `-` (removed), ` ` (unchanged)  
  > Commit: `feat(ui): add DiffBlock rendering for colored diff lines`

- [x] **14.4** Wire version selection logic  
  - Clicking first version: `[v1, null]`  
  - Clicking second version: `[v1, v3]` → "Diff" tab appears  
  - Clicking already-selected version: deselects it  
  - Auto-switch to "Diff" tab when both versions are selected  
  > Commit: `feat(ui): wire version selection to diff tab in detail panel`

---

## Step 15: Search & Filtering

**Goal:** Implement the debounced search bar, language chip filter, and tag filter.

- [x] **15.1** Create the LanguageFilter component (`components/language-filter.tsx`)  
  - Horizontal scrollable chip bar  
  - Shows top 10 languages from `QUICK_FILTER_LANGUAGES`  
  - Click a chip: sets `selectedLanguage` (toggles on/off)  
  - Active chip uses emerald color  
  > Commit: `feat(ui): add LanguageFilter chip bar component`

- [x] **15.2** Implement debounced search in dashboard  
  - Search input at top of main content area  
  - Raw input updates `searchQuery` state immediately (responsive typing)  
  - `useDebounce(searchQuery, 300)` produces `debouncedSearch`  
  - `debouncedSearch` is used in SWR key → only fetches after 300ms pause  
  > Commit: `feat(search): add debounced search bar to dashboard`

- [x] **15.3** Construct SWR key from all active filters  
  - Build `URLSearchParams` from: `debouncedSearch`, `selectedLanguage`, `selectedTagIds`  
  - SWR key: `/api/snippets?${params.toString()}`  
  - When key changes → SWR shows cached data + background re-fetch  
  > Commit: `feat(search): combine search, language, and tag filters into SWR key`

- [x] **15.4** Implement tag filtering in the sidebar  
  - Create TagFilter component or inline in sidebar  
  - Multi-select tags: clicking a tag toggles it in `selectedTagIds`  
  - Selected tags are sent as comma-separated IDs in the API request  
  - API applies AND-logic: snippet must have ALL selected tags  
  > Commit: `feat(filter): add tag filtering with AND-logic`

---

## Step 16: Sidebar & Navigation

**Goal:** Build the dashboard sidebar with logo, nav links, language shortcuts, theme toggle, and sign out.

- [x] **16.1** Create the DashboardSidebar component (`components/dashboard-sidebar.tsx`)  
  - Collapsible width: 260px ↔ 64px with `transition-all duration-300`  
  - Logo with `Code2` icon + "SnippetVault" text (hidden when collapsed)  
  - "New Snippet" button (icon-only when collapsed)  
  - "All Snippets" button: resets language filter to null  
  > Commit: `feat(ui): add DashboardSidebar with collapsible layout`

- [x] **16.2** Add language navigation to sidebar  
  - List of 10 languages with icons (from `QUICK_FILTER_LANGUAGES`)  
  - Click a language: sets `selectedLanguage` filter  
  - Active language highlighted with emerald color  
  - Labels hidden when sidebar is collapsed  
  > Commit: `feat(ui): add language navigation shortcuts to sidebar`

- [x] **16.3** Add sign out button  
  - Calls `supabase.auth.signOut()` (browser client)  
  - Redirects to `/` after sign out  
  - Shows `LogOut` icon  
  > Commit: `feat(auth): add sign out button to sidebar`

---

## Step 17: Dark/Light Theme

**Goal:** Implement dark and light mode with system preference detection and manual toggle.

- [x] **17.1** Create the ThemeToggle component (`components/theme-toggle.tsx`)  
  - Uses `useTheme()` from `next-themes`  
  - Displays `Sun` icon (light mode) or `Moon` icon (dark mode)  
  - Click toggles between themes  
  > Commit: `feat(theme): add ThemeToggle button component`

- [x] **17.2** Verify theme switching  
  - Toggle between dark and light manually  
  - Verify system preference detection (`enableSystem`)  
  - Verify CSS variables switch correctly in both themes  
  - Verify code blocks (Night Owl) remain readable in both themes  
  > Commit: `test: verify dark/light theme switching and persistence`

---

## Step 18: Polish, Error Handling & Edge Cases

**Goal:** Refine the UI, handle error states, and address edge cases.

- [x] **18.1** Add loading state to dashboard  
  - Display centered `Loader2` spinner with fade animation while SWR is loading  
  > Commit: `feat(ux): add loading spinner to dashboard`

- [x] **18.2** Add error state to dashboard  
  - Display "Failed to load snippets" message when SWR returns error  
  > Commit: `feat(ux): add error state to dashboard`

- [x] **18.3** Add empty states  
  - No snippets at all: `Code2` icon + "No snippets yet. Create your first snippet!"  
  - No results from search: "No snippets found matching your filters"  
  > Commit: `feat(ux): add empty state messages for no snippets and no results`

- [x] **18.4** Add copy-to-clipboard feedback  
  - `navigator.clipboard.writeText(content)`  
  - Button icon morphs from `Clipboard` → `Check` (green) for 2 seconds  
  - Works on both SnippetCard and SnippetDetailPanel  
  > Commit: `feat(ux): add clipboard copy with visual confirmation feedback`

- [x] **18.5** Ensure form validation  
  - "Create/Save" button disabled when title or content is empty  
  - Cannot submit empty forms  
  > Commit: `feat(ux): add form validation for required fields`

- [x] **18.6** Test all edge cases  
  - Create snippet with no tags → verify it works  
  - Edit snippet without changing content → verify no new version created  
  - Delete snippet → verify versions and tags cascade deleted  
  - Search with special characters → verify no SQL injection  
  - Sign out while on dashboard → verify redirect to login  
  > Commit: `test: verify edge cases for CRUD, auth, and search`

---

## Step 19: Deployment

**Goal:** Deploy the application to Vercel (free) and verify production build.

- [x] **19.1** Push code to GitHub repository  
  ```
  git add .
  git commit -m "feat: complete SnippetVault prototype"
  git push origin main
  ```
  > Commit: `chore: push complete codebase to GitHub`

- [x] **19.2** Connect GitHub repo to Vercel  
  - Go to [vercel.com](https://vercel.com) → Import Project  
  - Select the GitHub repository  
  - Vercel auto-detects Next.js framework  
  > Commit: `deploy: connect GitHub repo to Vercel`

- [x] **19.3** Configure environment variables on Vercel  
  - Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
  - Set them for Production, Preview, and Development environments  
  > Commit: `deploy: configure Supabase environment variables on Vercel`

- [x] **19.4** Trigger first production deploy and verify  
  - Verify build succeeds (`npm run build` exits 0)  
  - Verify production URL works  
  - Test: login → create snippet → search → edit → diff → delete → sign out  
  > Commit: `deploy: verify production build and functionality`

---

## Step 20: Documentation & Submission

**Goal:** Create comprehensive documentation for the project submission.

- [x] **20.1** Write the Product Requirements Document (`docs/PRD.md`)  
  - 15 sections: Executive Summary through Success Metrics  
  - Feature specification, user flows, architecture diagrams, data model, API reference  
  - Clear separation of current features vs future scope  
  - Emphasis on $0 cost infrastructure  
  > Commit: `docs: add comprehensive Product Requirements Document`

- [x] **20.2** Write the UI Redesign Specification (`docs/UI_REDESIGN.md`)  
  - Design philosophy (Apple × AI-native)  
  - New color palette, typography, and component redesign specs  
  - Animation specifications and CSS code samples  
  > Commit: `docs: add UI redesign specification`

- [x] **20.3** Write the Backend Architecture Plan (`docs/BACKEND_PLAN.md`)  
  - System architecture diagram, database schema, auth flow  
  - API route specifications, middleware details, security layers  
  - Data flow walkthroughs, performance considerations  
  > Commit: `docs: add backend architecture plan`

- [x] **20.4** Write the Frontend Architecture Plan (`docs/FRONTEND_PLAN.md`)  
  - Component hierarchy, state management strategy, SWR data fetching  
  - Component deep dives, styling architecture, type system  
  - Performance optimizations, accessibility features  
  > Commit: `docs: add frontend architecture plan`

- [x] **20.5** Write the Implementation Plan (`docs/IMPLEMENTATION_PLAN.md`)  
  - 20 steps, 80+ substeps with commit messages  
  - Actionable day-by-day working document  
  > Commit: `docs: add implementation plan with step-by-step instructions`

- [x] **20.6** Generate Word document version of PRD (`docs/SnippetVault_PRD.docx`)  
  - Professional formatting with custom styles, colors, and tables  
  - Cover page, table of contents, 15 sections  
  > Commit: `docs: generate Word document version of PRD`

---

# Phase 2 — Backend Improvements

> ⏳ **This is your active work
 zone — start here before touching the UI.** Everything below is NOT started. Follow the critical rule — mark each substep `[x]` before moving to the next one.

---

## Step 21: Input Validation with Zod

**Goal:** The current API routes accept any request body without validation — malformed or missing data goes straight to the database. Add `zod` schema validation to every API route that accepts a request body. This is the single most important backend improvement.

- [x] **21.1** Install the `zod` library  
  ```
  npm install zod
  ```
  > Commit: `chore: install zod for schema validation`

- [x] **21.2** Add Zod schema validation to `POST /api/snippets`  
  - Define schema: `title` (string, min 1), `language` (string, min 1), `content` (string, min 1), `description` (string optional), `commitMessage` (string optional), `tagIds` (array of UUID strings, optional)  
  - Parse request body with the schema  
  - Return `400` with field-specific error messages if validation fails  
  ```typescript
  const snippetSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    language: z.string().min(1, 'Language is required'),
    content: z.string().min(1, 'Content is required'),
    description: z.string().optional(),
    commitMessage: z.string().optional(),
    tagIds: z.array(z.string().uuid()).optional().default([]),
  })
  ```
  > Commit: `feat(api): add Zod validation to POST /api/snippets`

- [x] **21.3** Add Zod schema validation to `PUT /api/snippets/[id]`  
  - Same schema as POST — validate before any DB operation  
  - Return `400` with clear error message  
  > Commit: `feat(api): add Zod validation to PUT /api/snippets/[id]`

- [x] **21.4** Add Zod schema validation to `POST /api/tags`  
  - Schema: `name` (string, min 1, max 50)  
  - Replace the current manual `if (!name || typeof name !== 'string')` check  
  > Commit: `feat(api): add Zod validation to POST /api/tags`

- [x] **21.5** Test that invalid requests are now properly rejected  
  - Send POST with empty title → expect `400` with `"Title is required"`  
  - Send POST with no body → expect `400`  
  - Send POST with valid data → expect `200` as before  
  > Commit: `test: verify Zod validation rejects malformed requests`

---

## Step 22: Verify RLS Policies on Supabase

**Goal:** Row Level Security was set up in the SQL migration (Step 2.6) but it needs to be verified as actually active. Without RLS, if someone bypasses the API and queries Supabase directly with the anon key, they could read other users' data.

- [ ] **22.1** Open Supabase dashboard → Authentication → Policies  
  - Verify all 4 tables have RLS enabled: `snippets`, `snippet_versions`, `tags`, `snippet_tags`  
  - The toggle should show **"RLS enabled"** for each  
  > Commit: `security: verify RLS is active on all tables in Supabase`

- [ ] **22.2** Verify the SELECT policy on `snippets` works correctly  
  - In Supabase SQL Editor, run: `SELECT * FROM snippets;` without a user context  
  - Should return 0 rows (policy blocks unauthenticated access)  
  > Commit: `security: confirm RLS blocks unauthenticated direct DB access`

- [ ] **22.3** Check that `snippet_versions` and `snippet_tags` have access policies  
  - If these tables don't have policies, add them:  
  ```sql
  -- snippet_versions: access through parent snippet ownership
  CREATE POLICY "Users can view own snippet versions"
    ON public.snippet_versions FOR SELECT
    USING (EXISTS (
      SELECT 1 FROM public.snippets
      WHERE snippets.id = snippet_versions.snippet_id
        AND snippets.user_id = auth.uid()
    ));

  -- snippet_tags: access through parent snippet ownership  
  CREATE POLICY "Users can view own snippet tags"
    ON public.snippet_tags FOR ALL
    USING (EXISTS (
      SELECT 1 FROM public.snippets
      WHERE snippets.id = snippet_tags.snippet_id
        AND snippets.user_id = auth.uid()
    ));
  ```
  > Commit: `security: add RLS policies for snippet_versions and snippet_tags`

---

## Step 23: Server-Side Tag Filtering

**Goal:** Currently the API runs 3 separate queries (snippets, snippet_tags, tags) and joins them in JavaScript memory. This is inefficient and means tag filtering happens client-side after all data is returned. Move tag filtering into a single server-side SQL JOIN.

- [x] **23.1** Rewrite `GET /api/snippets` to use a single Supabase relational query  
  - Use Supabase's nested select syntax to join tags in one query:  
  ```typescript
  const { data: snippets } = await supabase
    .from('snippets')
    .select(`
      *,
      snippet_tags (
        tags ( id, name )
      )
    `)
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
  ```
  - Map the nested result to the flat `SnippetWithTags` shape the frontend expects  
  > Commit: `perf(api): rewrite snippet listing to use single relational JOIN query`

- [x] **23.2** Move tag AND-filtering to the database level  
  - When `tags` query param is present, add a filter at the DB level instead of in JS  
  - Each tag ID requires: `snippet must be in snippet_tags WHERE tag_id = X`  
  > Commit: `perf(api): move tag AND-filtering from client JS to DB query`

- [x] **23.3** Remove the now-unused separate `snippet_tags` and `tags` fetches  
  - The route previously did 3 queries; it should now do 1  
  - Verify query count dropped by checking Supabase dashboard → Logs  
  > Commit: `perf(api): remove redundant separate snippet_tags and tags queries`

- [x] **23.4** Test that filtering still works correctly after the refactor  
  - Create a snippet with tag "React" → search by tag "React" → it should appear  
  - Create a snippet with no tags → search by any tag → it should NOT appear  
  - Search + language + tags combined → should still work  
  > Commit: `test: verify tag filtering still works after server-side refactor`

---

## Step 24: Success Toasts & API Error Feedback

**Goal:** Right now when you create, update, or delete a snippet, nothing tells you it succeeded. The UI just re-renders silently. Add toast notifications for user actions using the `sonner` library (already installed).

- [x] **24.1** Wire up the `<Toaster>` component in the root layout (`app/layout.tsx`)  
  - Import `Toaster` from `sonner`  
  - Add `<Toaster position="bottom-right" richColors />` to the layout  
  > Commit: `feat(ux): add Sonner toast provider to root layout`

- [x] **24.2** Add success toasts in the dashboard `handleSaveSnippet` function  
  - On create success: `toast.success('Snippet created!')`  
  - On update success: `toast.success('Snippet updated!')`  
  > Commit: `feat(ux): add success toasts for snippet create and update`

- [x] **24.3** Add success toast for snippet deletion in the detail panel  
  - On delete success: `toast.success('Snippet deleted')`  
  > Commit: `feat(ux): add success toast for snippet deletion`

- [x] **24.4** Add error toasts for API failures  
  - If save fails: `toast.error('Failed to save snippet. Please try again.')`  
  - If delete fails: `toast.error('Failed to delete snippet.')`  
  - Replace the current silent failure (nothing happens if API returns error)  
  > Commit: `feat(ux): add error toasts for failed API operations`

---

# Phase 2 — UI Redesign

> ⏳ **Start here only after Steps 21–24 are all complete.** Everything below is NOT started.

---

## Step 25: New Design Token System

**Goal:** Replace the current generic emerald green theme with the new violet → cyan gradient system defined in `UI_REDESIGN.md`. This is the foundation all other redesign steps depend on — do this first.

- [x] **25.1** Update `app/globals.css` — replace all emerald color variables with the new violet/cyan palette  
  - New primary: `oklch(0.55 0.28 295)` (violet `#8B5CF6`)  
  - New accent: `oklch(0.72 0.19 210)` (cyan `#06B6D4`)  
  - Update `--primary`, `--primary-foreground`, `--ring` tokens  
  > Commit: `design: update primary color tokens from emerald to violet`

- [x] **25.2** Add new CSS utility classes to `globals.css`  
  - `.gradient-text` — violet-to-cyan gradient text  
  - `.glass` — frosted glass card (`backdrop-filter: blur(20px)`)  
  - `.gradient-bg` — violet-to-cyan gradient background  
  > Commit: `design: add glassmorphism and gradient utility classes`

- [x] **25.3** Add ambient mesh gradient to the body background  
  - Dark mesh: layered radial gradients in violet and cyan on a near-black base  
  - Should be subtle — not distracting, but gives depth  
  > Commit: `design: add ambient mesh gradient to app background`

- [x] **25.4** Update all hardcoded `emerald` Tailwind classes across all component files  
  - Files to update: `snippet-card.tsx`, `snippet-dialog.tsx`, `version-history.tsx`, `diff-viewer.tsx`, `dashboard-sidebar.tsx`, `dashboard-header.tsx`, `tag-filter.tsx`, auth pages, landing page  
  - Replace `bg-emerald-600` → `bg-primary`, `text-emerald-500` → `text-primary`, `border-emerald-500/50` → `border-primary/50`  
  > Commit: `design: replace hardcoded emerald classes with semantic design tokens`

- [x] **25.5** Verify the app still builds and runs after token changes  
  - `npm run build` exits 0 with no errors ✓  
  > Commit: `test: verify app runs correctly after design token update`

---

## Step 26: Landing Page Redesign

**Goal:** Transform the current flat landing page into a premium, visually striking hero with gradient elements and glassmorphism cards.

- [x] **26.1** Redesign the hero section (`app/page.tsx`)  
  - Applied gradient text to headline using `.gradient-text`  
  > Commit: `design(landing): redesign hero section with gradient headline`

- [x] **26.2** Redesign feature cards  
  - Applied `.glass` class for frosted glass effect  
  - Added `hover:-translate-y-1 hover:shadow-primary/10` lift effect  
  - Icon containers: `bg-primary/10 text-primary`  
  > Commit: `design(landing): upgrade feature cards with glassmorphism and hover effects`

- [x] **26.3** Redesign the CTA buttons  
  - Primary button: `gradient-bg hover:opacity-90 text-white`  
  > Commit: `design(landing): apply gradient styles to CTA buttons`

- [x] **26.4** Add a subtle floating code snippet preview to the hero (visual element)  
  - A small dark card showing a snippet of code with syntax highlighting  
  - Positioned to the right of the hero text  
  - Adds an authentic "developer tool" feel  
  > Commit: `design(landing): add floating code preview card to hero section`

---

## Step 27: Auth Pages Redesign

**Goal:** Make the login and sign-up pages feel premium and on-brand with the new design system.

- [x] **27.1** Redesign the auth page layout  
  - Centered card with `.glass` background on the ambient mesh  
  - Card has a subtle gradient border  
  - SnippetVault logo + gradient text at the top of the card  
  > Commit: `design(auth): redesign auth card layout with glassmorphism`

- [x] **27.2** Style the form inputs  
  - Frosted glass input background  
  - Violet focus ring (`focus:ring-violet-500`)  
  - Smooth `transition-all` on focus  
  > Commit: `design(auth): style form inputs with glass background and violet focus ring`

- [x] **27.3** Style the submit button  
  - Full-width gradient button (violet → cyan)  
  - Loading spinner shown inside button when submitting  
  > Commit: `design(auth): apply gradient button style to auth form submit`

---

## Step 28: Dashboard & Sidebar Redesign

**Goal:** Overhaul the dashboard layout — the sidebar becomes a premium dark panel, and the main area gets the ambient mesh backdrop.

- [x] **28.1** Redesign the sidebar (`components/dashboard-sidebar.tsx`)  
  - Darker sidebar background — near black with a faint violet tint  
  - SnippetVault logo: gradient text on the brand name  
  - Active language item: left border accent in violet + subtle violet background  
  - "New Snippet" button: gradient border, glass background instead of solid  
  > Commit: `design(sidebar): redesign sidebar with dark glass and violet accents`

- [x] **28.2** Redesign the "New Snippet" primary button  
  - Violet → cyan gradient fill  
  - Subtle glow on hover (`shadow-violet-500/30`)  
  - `Sparkles` icon (or `Plus` with animated pulse)  
  > Commit: `design(sidebar): apply gradient style to New Snippet button`

- [x] **28.3** Redesign the search bar (`app/dashboard/page.tsx`)  
  - Glass background with blur  
  - Violet focus ring  
  - Search icon subtle glow on focus  
  > Commit: `design(dashboard): redesign search bar with glass style`

- [x] **28.4** Redesign the language filter chips (`components/language-filter.tsx`)  
  - Default chip: glass background with subtle border  
  - Active chip: violet gradient background, white text  
  - Smooth `transition-all` between states  
  > Commit: `design(dashboard): redesign language filter chips with gradient active state`

- [x] **28.5** Add skeleton loading cards to replace the spinner  
  - When SWR is loading, show 6 skeleton cards in the grid  
  - Each skeleton has an animated shimmer effect  
  - Use the existing `<Skeleton>` component from shadcn/ui  
  > Commit: `feat(ux): replace loading spinner with skeleton card shimmer`

---

## Step 29: Snippet Card Redesign

**Goal:** Make snippet cards the star of the UI — premium glass cards with hover glow and polished details.

- [x] **29.1** Apply glassmorphism to snippet cards (`components/snippet-card.tsx`)  
  - Card background: `.glass` class  
  - Border: `border border-white/10`  
  - Hover: `hover:-translate-y-0.5 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/10`  
  - Smooth `transition-all duration-200`  
  > Commit: `design(card): apply glassmorphism and hover glow to snippet cards`

- [x] **29.2** Redesign the language badge  
  - Language-specific colors (JS = amber, Python = blue, Rust = orange, etc.) from `UI_REDESIGN.md`  
  - Small colored dot + language name  
  > Commit: `design(card): add language-specific colors to language badges`

- [x] **29.3** Redesign the copy button  
  - Appears on hover with a fade-in transition  
  - Glass button with violet icon  
  - On copy success: brief green flash + checkmark  
  > Commit: `design(card): redesign copy button with hover reveal and success feedback`

- [x] **29.4** Improve the card footer  
  - Tags displayed as small pill badges with glass background  
  - Timestamp: smaller, muted, with a clock icon  
  - Clean visual hierarchy — language badge prominent, tags secondary  
  > Commit: `design(card): improve card footer with pill tags and formatted timestamp`

---

## Step 30: Detail Panel & Dialog Redesign

**Goal:** Upgrade the right-side detail panel and create/edit dialog to match the new premium aesthetic.

- [x] **30.1** Redesign the detail panel (`components/snippet-detail-panel.tsx`)  
  - Panel background: dark glass  
  - Header: gradient text on snippet title  
  - Action buttons (Copy, Edit, Delete): glass buttons with borders  
  - Tab bar: subtle underline indicator in violet, not the default heavy box  
  > Commit: `design(panel): redesign detail panel with glass background and gradient title`

- [x] **30.2** Redesign the diff viewer (`components/diff-viewer.tsx`)  
  - Header stats: `+N` in green, `-N` in red — bold and prominent  
  - Diff lines: slightly more saturated colors for added/removed  
  - Code font slightly larger for readability  
  > Commit: `design(diff): improve diff viewer visual clarity`

- [x] **30.3** Redesign the version history timeline (`components/version-history.tsx`)  
  - Timeline line in violet  
  - Version dot: violet fill when selected, glass when unselected  
  - Selected version: violet border + glass highlight background  
  - "Latest" badge: gradient background  
  > Commit: `design(history): redesign version history timeline with violet accents`

- [ ] **30.4** Redesign the create/edit dialog (`components/snippet-dialog.tsx`)  
  - Dark glass dialog background  
  - Form inputs: glass style with violet focus ring  
  - Tag toggle buttons: glass default, gradient active  
  - "Create Snippet" / "Save Changes" button: full-width gradient  
  > Commit: `design(dialog): redesign snippet dialog with glass style and gradient button`

---

## Step 31: Final Polish & Re-deployment

**Goal:** Final review pass, verify everything looks great together, fix any visual inconsistencies, and push to production.

- [ ] **31.1** Visual consistency audit  
  - Open every page and every component state (hover, active, loading, empty, error)  
  - Check: no leftover emerald colors, consistent border-radius, consistent spacing  
  > Commit: `fix(design): resolve visual inconsistencies across all components`

- [ ] **31.2** Check dark and light mode  
  - Toggle between themes and verify both look polished  
  - The glassmorphism effects must work in both themes  
  > Commit: `fix(theme): verify glassmorphism and gradient effects in both themes`

- [ ] **31.3** Run production build and check for errors  
  ```
  npm run build
  ```
  - Fix any TypeScript errors or build warnings before deploying  
  > Commit: `fix: resolve build errors and TypeScript warnings`

- [ ] **31.4** Push all changes to GitHub and deploy to Vercel  
  ```
  git add .
  git commit -m "feat: complete backend improvements and UI redesign"
  git push origin main
  ```
  > Commit: `feat: complete backend improvements and UI redesign`

- [ ] **31.5** Verify production deployment end-to-end  
  - Open the live Vercel URL  
  - Test full flow: sign up → create snippet → search → edit → diff → sign out  
  - Confirm toasts appear, validation works, and redesigned UI looks correct  
  > Commit: `deploy: confirm full feature set and redesign live on Vercel`

---

## Summary

### Phase 1 — Prototype (Already Built)

| Step | Scope | Substeps | Status |
|---|---|---|---|
| Step 1 | Project initialization | 7 | ✅ Complete |
| Step 2 | Database schema | 7 | ✅ Complete |
| Step 3 | Authentication | 5 | ✅ Complete |
| Step 4 | Snippet API routes | 6 | ✅ Complete |
| Step 5 | Tag & version API routes | 4 | ✅ Complete |
| Step 6 | Layout & styling foundation | 5 | ✅ Complete |
| Step 7 | Landing page | 2 | ✅ Complete |
| Step 8 | Auth pages | 5 | ✅ Complete |
| Step 9 | Dashboard core structure | 3 | ✅ Complete |
| Step 10 | Snippet card & grid | 2 | ✅ Complete |
| Step 11 | Code editor | 3 | ✅ Complete |
| Step 12 | Create/edit dialog | 4 | ✅ Complete |
| Step 13 | Detail panel | 4 | ✅ Complete |
| Step 14 | Version history & diff | 4 | ✅ Complete |
| Step 15 | Search & filtering | 4 | ✅ Complete |
| Step 16 | Sidebar & navigation | 3 | ✅ Complete |
| Step 17 | Dark/light theme | 2 | ✅ Complete |
| Step 18 | Polish & edge cases | 6 | ✅ Complete |
| Step 19 | Deployment | 4 | ✅ Complete |
| Step 20 | Documentation | 6 | ✅ Complete |
| **Phase 1 Total** | | **84 substeps** | **✅ All Complete** |

### Phase 2 — Backend Improvements (Start here ⏳)

| Step | Scope | Substeps | Status |
|---|---|---|---|
| Step 21 | Input validation with Zod | 5 | ⏳ Not started |
| Step 22 | Verify RLS policies | 3 | ⏳ Not started |
| Step 23 | Server-side tag filtering | 4 | ⏳ Not started |
| Step 24 | Success toasts & error feedback | 4 | ⏳ Not started |
| **Backend Total** | | **16 substeps** | **⏳ 0 / 16 complete** |

### Phase 2 — UI Redesign (After backend is done ⏳)

| Step | Scope | Substeps | Status |
|---|---|---|---|
| Step 25 | New design token system | 5 | ⏳ Not started |
| Step 26 | Landing page redesign | 4 | ⏳ Not started |
| Step 27 | Auth pages redesign | 3 | ⏳ Not started |
| Step 28 | Dashboard & sidebar redesign | 5 | ⏳ Not started |
| Step 29 | Snippet card redesign | 4 | ⏳ Not started |
| Step 30 | Detail panel & dialog redesign | 4 | ⏳ Not started |
| Step 31 | Final polish & re-deployment | 5 | ⏳ Not started |
| **UI Total** | | **30 substeps** | **⏳ 0 / 30 complete** |

| **Phase 2 Grand Total** | | **46 substeps** | **⏳ 0 / 46 complete** |

---

*Document End — SnippetVault Implementation Plan v2.0*
