# SnippetVault — Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** April 7, 2026  
**Authors:** Team SnippetVault  
**Status:** Prototype — Phase 1

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Motivation & Vision](#3-motivation--vision)
4. [Target Users](#4-target-users)
5. [Use Cases — How, When, Where](#5-use-cases--how-when-where)
6. [Feature Specification](#6-feature-specification)
7. [User Flows](#7-user-flows)
8. [Application Architecture & Flow](#8-application-architecture--flow)
9. [Technology Stack](#9-technology-stack)
10. [Data Model & Schema Design](#10-data-model--schema-design)
11. [API Design](#11-api-design)
12. [Security & Access Control](#12-security--access-control)
13. [Development Process & Timeline](#13-development-process--timeline)
14. [Future Roadmap & Proposed Enhancements](#14-future-roadmap--proposed-enhancements)
15. [Success Metrics](#15-success-metrics)

---

## 1. Executive Summary

**SnippetVault** is a modern, full-stack web application that allows developers to **save, organize, search, and version-control** their code snippets. Think of it as a personal Git repository specifically designed for reusable code fragments.

Unlike plain note-taking apps or GitHub Gists, SnippetVault provides:

- **Git-like version history** — every edit creates a tracked version with a commit message
- **Side-by-side diff comparison** — see exactly what changed between any two versions
- **Smart tagging & multi-filter search** — find any snippet in milliseconds
- **Syntax highlighting** — for 25+ programming languages
- **One-click copy** — paste into any IDE or terminal instantly

The application is built with **Next.js 16**, **Supabase** (PostgreSQL + Auth), and a modern component library. The entire stack runs on **100% free-tier infrastructure** — Supabase Free Plan + Vercel Hobby Plan — with **zero cost** to build, deploy, and run.

---

## 2. Problem Statement

### The Core Problem

Developers constantly write, reuse, and evolve small pieces of code across projects:

- A utility function for date formatting
- A database query template
- A regex pattern for email validation
- A CSS animation snippet
- A Docker configuration block

**Where does this code live today?**

| Current Solution | Problem |
|---|---|
| Scattered text files | No search, no organization, easily lost |
| GitHub Gists | No version history with diffs, poor discoverability |
| IDE snippets | Locked to one editor, not portable |
| Notion/Google Docs | No syntax highlighting, no code-aware features |
| Memory | Unreliable — developers waste time rewriting what they've already solved |

### Impact

A 2023 Stack Overflow Developer Survey found that developers spend **~30% of their time searching for or rewriting code** they've written before. For a team of 10 developers, this translates to an estimated **3 full-time engineers' worth of productivity lost per year**.

### The Gap

No existing tool combines **code-specific features** (syntax highlighting, version history, diff viewer) with **personal knowledge management** (tags, search, organization) in a lightweight, browser-based interface.

---

## 3. Motivation & Vision

### Why SnippetVault?

> *"Every developer has a personal library of code patterns. SnippetVault makes that library searchable, versioned, and always accessible."*

**Motivation:**

1. **Academic Context** — This project serves as a prototype for a Software Engineering course, demonstrating full-stack development skills including authentication, CRUD operations, real-time search, and version control system design.

2. **Real Developer Pain** — The problem is genuine. The team members themselves have experienced the frustration of losing useful code snippets or rewriting utility functions from scratch.

3. **Technical Learning** — The project exercises advanced concepts:
   - Server-side rendering with Next.js App Router
   - Row-level security with Supabase/PostgreSQL
   - Optimistic UI updates with SWR
   - Diff algorithms implemented in JavaScript
   - Responsive, accessible UI with Radix primitives

### Vision

**Phase 1 (Current Prototype — ✅ Fully Free):** Personal snippet manager with version control. Everything runs on free-tier infrastructure with zero recurring cost.

> **Note:** Phases 2 and 3 below are **future vision only** — listed for academic discussion and potential growth paths. They are NOT part of the current prototype and would require additional time, effort, and potentially paid services.

**Phase 2 (Future):** AI-powered features — auto-tagging, natural language search, snippet suggestions  
**Phase 3 (Future):** Team collaboration — shared collections, real-time co-editing, snippet marketplace

---

## 4. Target Users

### Primary Personas

#### 👨‍💻 The Student Developer
- **Profile:** CS student (18–24), learning multiple languages simultaneously
- **Needs:** Store solutions from assignments, tutorials, and side projects; quick reference during exams prep
- **Pain Point:** Code from last semester's assignment is gone — lost in old folders or deleted repos

#### 👩‍💻 The Professional Developer
- **Profile:** Software engineer (25–40), works across multiple projects and clients
- **Needs:** Maintain a personal utility library, track how solutions evolve over time
- **Pain Point:** "I wrote a perfect date parser last month — where is it?"

#### 🧑‍🏫 The Technical Writer / Educator
- **Profile:** Creates tutorials, documentation, or teaches coding workshops
- **Needs:** Maintain a curated library of example code in multiple languages
- **Pain Point:** Example code drifts out of date; no way to track which version was used in which tutorial

### User Demographics

| Attribute | Value |
|---|---|
| Technical Level | Intermediate to advanced developers |
| Primary Device | Desktop / Laptop (code-centric workflow) |
| Browser | Chrome, Firefox, Edge, Safari |
| Frequency of Use | Daily (during active development) |
| Session Length | 2–15 minutes per session |

---

## 5. Use Cases — How, When, Where

### When Will Users Use SnippetVault?

| Scenario | Trigger | Action |
|---|---|---|
| **Learning a new concept** | User finds a useful pattern in a tutorial | Save snippet → tag with topic and language |
| **Solving a bug** | User writes a clever fix | Save the fix → add commit message explaining reasoning |
| **Starting a new project** | User needs boilerplate code | Search snippets by language/tag → copy to project |
| **Refactoring existing code** | User improves a utility function | Update snippet → version history tracks the improvement |
| **Code review prep** | User wants to compare approaches | Open diff viewer → compare v1 vs v3 side-by-side |
| **Switching devices** | User moves from office to home laptop | Open SnippetVault in browser → all snippets are synced via Supabase |

### Where Will It Be Used?

- **In the browser** alongside an IDE (split screen workflow)
- **On any device** with a modern web browser (cloud-based, no local install)
- **In classrooms** as a teaching tool for code versioning concepts
- **In hackathons** for quick access to reusable starter code

### How Will It Be Used?

1. **Save:** Press "New Snippet" → enter code, title, language, tags → save
2. **Find:** Type in search bar or click a language/tag filter → results appear instantly
3. **Use:** Click a snippet card → view full code → one-click copy to clipboard
4. **Evolve:** Edit a snippet → add a commit message → new version is tracked
5. **Compare:** Select two versions in history → view side-by-side diff

---

## 6. Feature Specification

### 6.1 Core Features (Implemented ✅)

#### F1: User Authentication
- Email/password registration and login via Supabase Auth
- Secure session management with cookie-based tokens
- Protected routes via Next.js middleware
- Sign-up email confirmation flow
- Sign-out functionality

#### F2: Snippet CRUD Operations
- **Create** snippet with title, description, language, code content, and tags
- **Read** snippet list with preview (first 6 lines of code), or full detail in side panel
- **Update** snippet metadata and code — content changes trigger a new version
- **Delete** snippet with confirmation dialog (cascade deletes versions and tag links)

#### F3: Version Control System
- Every content edit creates a new `snippet_versions` record
- Auto-incrementing version numbers (v1, v2, v3...)
- Optional commit messages (defaults to "Version N")
- Full version history list in the snippet detail panel
- Ability to view any historical version's code

#### F4: Side-by-Side Diff Viewer
- Select any two versions from the history panel
- View additions (green) and deletions (red) in a unified diff format
- Built using the `diff` library for line-by-line comparison

#### F5: Smart Tagging System
- User-created tags (each user has their own tag namespace)
- Many-to-many relationship (a snippet can have multiple tags, a tag can span multiple snippets)
- AND-logic tag filtering (selected tags must ALL match)
- Tag management API

#### F6: Full-Text Search
- Searches across `title`, `description`, and `current_content`
- Debounced input (300ms) to prevent excessive API calls
- Combined with language and tag filters for precise results

#### F7: Language Filtering
- Inline chip-based filter for quick language selection
- Sidebar navigation with 10 most common languages
- Full dropdown with 25+ supported languages

#### F8: Syntax Highlighting
- Powered by `prism-react-renderer`
- Supports: JavaScript, TypeScript, Python, Rust, Go, CSS, HTML, SQL, Bash, Java, C, C++, C#, Ruby, PHP, Swift, Kotlin, Scala, Haskell, Lua, Perl, R, Assembly, JSON, YAML, Markdown, Plain Text

#### F9: One-Click Copy
- Clipboard copy button on every snippet card (appears on hover)
- Clipboard copy button in the detail panel
- Visual feedback with checkmark confirmation (2 seconds)

#### F10: Dark/Light Mode
- System-preference-aware theme detection
- Manual toggle in the sidebar
- Persistent theme selection across sessions

---

### 6.2 Future Scope — Potential Enhancements

> ⚠️ **Important Disclaimer:** The features below are **NOT part of the current prototype**. They are documented purely for academic discussion — to demonstrate product thinking and growth potential. Many require paid APIs, significant development time, or infrastructure upgrades. **None of these are planned for immediate implementation.**

| Feature | Description | Cost / Effort | Why It's Future Scope |
|---|---|---|---|
| **AI Auto-Tagging** | Analyze code on save → suggest tags automatically | 💰 Requires OpenAI API ($0.002–$0.06/call) | Paid API, needs billing |
| **AI Natural Language Search** | Search using plain English ("that celsius converter function") | 💰 Requires embedding API + `pgvector` | Paid API, complex setup |
| **Code Execution Sandbox** | Run JS/Python snippets in-browser via WebAssembly | ⏱️ 2–3 weeks of dev time | Heavy engineering effort |
| **Import from GitHub Gists** | OAuth + Gist import pipeline | ⏱️ 1 week + GitHub OAuth setup | Moderate effort |
| **Export & Sharing** | Share snippets via public links / embed widgets | ⏱️ 1 week | Moderate effort, needs public DB rows |
| **Snippet Collections** | Folders/groups for organizing snippets | ⏱️ 1 week | New DB table + UI |
| **Keyboard Shortcuts** | `⌘K` search, `N` new snippet, `Esc` close | 🟢 Free, ~2 hours | Low effort — could be added easily |
| **Analytics Dashboard** | Charts for language distribution, activity | 🟢 Free (recharts already installed) | Low effort — could be added easily |
| **Browser Extension** | Save code blocks from any webpage | ⏱️ 2–3 weeks + Chrome Web Store | Separate project entirely |
| **Mobile Responsive** | Touch-optimized layout | ⏱️ 3–5 days | CSS-only but needs testing |
| **AI Code Explanation** | AI-generated description of what code does | 💰 Requires GPT-4o API | Paid API |
| **Team Workspaces** | Shared collections within an org | 💰⏱️ Paid Supabase plan + 3–4 weeks | Major infrastructure + effort |
| **VS Code Extension** | Save/search snippets from the IDE | ⏱️ 2–3 weeks | Separate project entirely |

> **Bottom line:** The current prototype delivers a complete, functional product using only free tools. The features above represent where the product *could* go — not where it needs to go right now.

---

## 7. User Flows

### 7.1 New User Registration Flow

```
Landing Page (/)
  │
  ├── Click "Get Started"
  │
  ▼
Sign Up Page (/auth/sign-up)
  │
  ├── Enter email + password
  ├── Submit form
  │
  ▼
Supabase sends confirmation email
  │
  ▼
Sign Up Success Page (/auth/sign-up-success)
  │ (User checks email, clicks confirmation link)
  │
  ▼
Redirected to Login Page (/auth/login)
  │
  ├── Enter credentials
  │
  ▼
Dashboard (/dashboard)
  └── Empty state: "No snippets yet" + CTA to create first snippet
```

### 7.2 Create Snippet Flow

```
Dashboard (/dashboard)
  │
  ├── Click "New Snippet" (button or sidebar)
  │
  ▼
Snippet Dialog (Modal)
  │
  ├── Enter title (required)
  ├── Enter description (optional)
  ├── Select language from dropdown
  ├── Write/paste code in editor
  ├── Select tags (multi-select from existing) or create new tag
  ├── Enter commit message (optional, defaults to "Initial version")
  │
  ├── Click "Save"
  │
  ▼
POST /api/snippets
  │
  ├── Creates `snippets` row
  ├── Creates `snippet_versions` row (v1)
  ├── Creates `snippet_tags` junction rows
  │
  ▼
Dashboard refreshes (SWR mutate)
  └── New snippet card appears in grid
```

### 7.3 Edit & Version Flow

```
Dashboard → Click snippet card
  │
  ▼
Detail Panel (Sheet) opens from right
  │
  ├── View current code (Code tab)
  ├── View version history (History tab)
  │
  ├── Click "Edit"
  │
  ▼
Snippet Dialog (Modal) with pre-filled data
  │
  ├── Modify code, title, tags, etc.
  ├── Enter commit message (e.g., "Fixed edge case for null input")
  │
  ├── Click "Save"
  │
  ▼
PUT /api/snippets/[id]
  │
  ├── If content changed:
  │   ├── Updates `snippets.current_content`
  │   ├── Creates new `snippet_versions` row (v2, v3, etc.)
  │
  ├── Updates tags (delete old, insert new)
  │
  ▼
Dashboard + Detail Panel refresh
  └── History tab now shows new version
```

### 7.4 Search & Filter Flow

```
Dashboard
  │
  ├── Type in search bar → debounced (300ms)
  │   └── GET /api/snippets?search=<query>
  │
  ├── Click language chip (e.g., "Python")
  │   └── GET /api/snippets?language=python
  │
  ├── Select tag from sidebar filter
  │   └── GET /api/snippets?tags=<id1>,<id2>
  │
  ├── All filters combine:
  │   └── GET /api/snippets?search=sort&language=javascript&tags=abc,def
  │
  ▼
Grid updates with filtered results (or "No snippets found" empty state)
```

### 7.5 Diff Comparison Flow

```
Detail Panel → History tab
  │
  ├── Click Version 1 → selected (highlighted)
  ├── Click Version 3 → selected (highlighted)
  │
  ▼
"Diff" tab appears in tab bar
  │
  ├── Click "Diff" tab
  │
  ▼
Side-by-side diff view:
  ├── Left: Version 1 content
  ├── Right: Version 3 content  
  ├── Green lines: Added
  ├── Red lines: Removed
  │
  ├── Click "Clear Selection" to deselect
  │
  ▼
Returns to History tab
```

---

## 8. Application Architecture & Flow

### 8.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │  Landing Page │  │  Auth Pages  │  │    Dashboard Page      │  │
│  │  (SSR)       │  │  (SSR)       │  │    (Client-Side)       │  │
│  └──────────────┘  └──────────────┘  └───────────────────────┘  │
│                                           │                       │
│                                    SWR data fetching              │
│                                           │                       │
└───────────────────────────────────────────┼───────────────────────┘
                                            │
                                     HTTP (REST API)
                                            │
┌───────────────────────────────────────────┼───────────────────────┐
│                      NEXT.JS SERVER (API Routes)                  │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  Middleware (middleware.ts)                                  │   │
│  │  → Refreshes Supabase auth session on every request        │   │
│  │  → Protects routes from unauthenticated access             │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────┐   │
│  │ GET /snippets   │  │ POST /snippets   │  │ GET /tags      │   │
│  │ (list + filter) │  │ (create + v1)    │  │ POST /tags     │   │
│  ├─────────────────┤  ├──────────────────┤  ├────────────────┤   │
│  │ GET /[id]       │  │ PUT /[id]        │  │                │   │
│  │ (single)        │  │ (update + veN)   │  │                │   │
│  ├─────────────────┤  ├──────────────────┤  │                │   │
│  │ DELETE /[id]    │  │ GET /versions    │  │                │   │
│  └─────────────────┘  └──────────────────┘  └────────────────┘   │
│                                                                    │
│  Each route: createClient() → supabase.auth.getUser() → query    │
│                                                                    │
└───────────────────────────────┬────────────────────────────────────┘
                                │
                          Supabase SDK
                                │
┌───────────────────────────────┼────────────────────────────────────┐
│                         SUPABASE CLOUD                             │
│                                                                    │
│  ┌──────────────┐   ┌──────────────────────────────────────────┐  │
│  │  Supabase    │   │       PostgreSQL Database                 │  │
│  │  Auth        │   │                                           │  │
│  │              │   │  ┌─────────────┐  ┌───────────────────┐  │  │
│  │  • Sign Up   │   │  │  snippets   │  │ snippet_versions  │  │  │
│  │  • Sign In   │   │  │             │  │                   │  │  │
│  │  • Sessions  │   │  │  id         │──│ snippet_id (FK)   │  │  │
│  │  • JWT       │   │  │  user_id    │  │ version_number    │  │  │
│  │              │   │  │  title      │  │ content           │  │  │
│  └──────────────┘   │  │  language   │  │ commit_message    │  │  │
│                      │  │  content   │  └───────────────────┘  │  │
│                      │  └─────────────┘                         │  │
│                      │        │                                  │  │
│                      │  ┌─────────────┐  ┌───────────────────┐  │  │
│                      │  │ snippet_tags│  │    tags            │  │  │
│                      │  │ (junction)  │──│                    │  │  │
│                      │  │ snippet_id  │  │  id                │  │  │
│                      │  │ tag_id      │  │  user_id           │  │  │
│                      │  └─────────────┘  │  name              │  │  │
│                      │                    └───────────────────┘  │  │
│                      └──────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

### 8.2 Request Flow (Example: Create Snippet)

```
User fills form → clicks "Save"
       │
       ▼
Client: fetch('/api/snippets', { method: 'POST', body: {...} })
       │
       ▼
Next.js Middleware: updateSession(request)
 → Refreshes auth cookies if expired
       │
       ▼
API Route (POST /api/snippets):
 1. createClient() — server-side Supabase client with cookies
 2. supabase.auth.getUser() — verify JWT, get user.id
 3. INSERT INTO snippets (...) → returns snippet row
 4. INSERT INTO snippet_versions (snippet_id, v1, content)
 5. INSERT INTO snippet_tags (snippet_id, tag_id) × N
 6. Return { snippet } as JSON
       │
       ▼
Client: SWR mutate() → re-fetches snippet list
       │
       ▼
Grid re-renders with new snippet card
```

---

## 9. Technology Stack

> 💵 **Total Cost: $0** — Every technology used in this prototype is either open-source or available on a free tier. No credit card required. No trial period. Completely free.

### 9.1 Frontend (All Open-Source / Free)

| Technology | Version | Purpose | Cost |
|---|---|---|---|
| **Next.js** | 16.2 | React framework with App Router, API routes, SSR/SSG | 🟢 Free (MIT) |
| **React** | 19 | UI library with server components and hooks | 🟢 Free (MIT) |
| **TypeScript** | 5.7 | Static typing for safer refactoring and better DX | 🟢 Free (Apache 2.0) |
| **Tailwind CSS** | 4.2 | Utility-first styling with custom design tokens | 🟢 Free (MIT) |
| **shadcn/ui** | Latest | Radix UI primitives styled with Tailwind | 🟢 Free (MIT) |
| **Lucide React** | 0.564 | Modern icon library | 🟢 Free (ISC) |
| **SWR** | 2.2 | Data fetching with caching and revalidation | 🟢 Free (MIT) |
| **prism-react-renderer** | 2.4 | Syntax highlighting for 25+ languages | 🟢 Free (MIT) |
| **diff** | 7.0 | Line-by-line diff computation for version comparison | 🟢 Free (BSD) |
| **react-hook-form** | 7.54 | Performant form management | 🟢 Free (MIT) |
| **zod** | 3.24 | Schema validation for forms | 🟢 Free (MIT) |
| **date-fns** | 4.1 | Lightweight date formatting | 🟢 Free (MIT) |
| **next-themes** | 0.4 | Dark/light mode toggle | 🟢 Free (MIT) |
| **sonner** | 1.7 | Toast notifications | 🟢 Free (MIT) |

### 9.2 Backend & Infrastructure (All Free Tier)

| Technology | Purpose | Cost | Free Tier Limits |
|---|---|---|---|
| **Supabase** | PostgreSQL DB + Auth + REST API | 🟢 Free Plan | 500 MB DB, 50K auth users, unlimited API calls |
| **Supabase Auth** | Email/password auth with JWT | 🟢 Free (included) | 50,000 monthly active users |
| **@supabase/ssr** | Server-side Supabase client | 🟢 Free (npm) | — |
| **Vercel** | Hosting & deployment | 🟢 Hobby Plan (Free) | 100 GB bandwidth, serverless functions |
| **Vercel Analytics** | Performance monitoring | 🟢 Free (included) | 2,500 events/month |

### 9.3 Development Tools (All Free)

| Tool | Purpose | Cost |
|---|---|---|
| **Git** | Version control for the project itself | 🟢 Free |
| **GitHub** | Repository hosting | 🟢 Free (public/private) |
| **ESLint** | Code linting and quality enforcement | 🟢 Free |
| **PostCSS** | CSS processing pipeline | 🟢 Free |
| **VS Code** | Code editor | 🟢 Free |

---

## 10. Data Model & Schema Design

### 10.1 Entity Relationship Diagram

```
┌──────────────────────┐
│       users           │ (managed by Supabase Auth)
│                        │
│  id (UUID, PK)        │
│  email                 │
│  created_at            │
└──────────┬─────────────┘
           │ 1
           │
           │ N
┌──────────┴─────────────┐         ┌──────────────────────────┐
│       snippets          │         │    snippet_versions       │
│                          │   1:N   │                           │
│  id (UUID, PK)          │────────│  id (UUID, PK)            │
│  user_id (FK → users)  │         │  snippet_id (FK)          │
│  title (text)           │         │  version_number (int)     │
│  description (text?)    │         │  content (text)           │
│  language (text)        │         │  commit_message (text?)   │
│  current_content (text) │         │  created_at (timestamp)   │
│  created_at (timestamp) │         └──────────────────────────┘
│  updated_at (timestamp) │
└──────────┬─────────────┘
           │
           │ M:N (via junction table)
           │
┌──────────┴─────────────┐         ┌──────────────────────────┐
│     snippet_tags        │         │        tags               │
│     (junction)          │   N:1   │                           │
│                          │────────│  id (UUID, PK)            │
│  snippet_id (FK)        │         │  user_id (FK → users)    │
│  tag_id (FK)            │         │  name (text)              │
│  (composite PK)         │         │  created_at (timestamp)   │
└──────────────────────────┘         └──────────────────────────┘
```

### 10.2 Key Design Decisions

| Decision | Rationale |
|---|---|
| `current_content` stored in `snippets` | Avoids a JOIN to `snippet_versions` for the common case (viewing latest code) |
| `version_number` is sequential per snippet | Simpler than Git SHA — users understand "v1, v2, v3" |
| Tags are user-scoped | Each user has their own tag namespace — no collisions |
| `snippet_tags` junction table | Allows many-to-many without JSON arrays (better querying) |
| UUIDs for all primary keys | Supabase default, globally unique, no sequential ID leaks |

---

## 11. API Design

### 11.1 Endpoint Reference

#### Snippets

| Method | Endpoint | Query Params | Request Body | Response |
|---|---|---|---|---|
| `GET` | `/api/snippets` | `search`, `language`, `tags` | — | `{ snippets: SnippetWithTags[], tags: Tag[] }` |
| `POST` | `/api/snippets` | — | `{ title, description, language, content, commitMessage, tagIds }` | `{ snippet }` |
| `GET` | `/api/snippets/[id]` | — | — | `{ snippet: SnippetWithTags }` |
| `PUT` | `/api/snippets/[id]` | — | `{ title, description, language, content, commitMessage, tagIds }` | `{ snippet }` |
| `DELETE` | `/api/snippets/[id]` | — | — | `{ success: true }` |

#### Versions

| Method | Endpoint | Response |
|---|---|---|
| `GET` | `/api/snippets/[id]/versions` | `{ versions: SnippetVersion[] }` |

#### Tags

| Method | Endpoint | Request Body | Response |
|---|---|---|---|
| `GET` | `/api/tags` | — | `{ tags: Tag[] }` |
| `POST` | `/api/tags` | `{ name }` | `{ tag }` |

### 11.2 Authentication

All API routes require a valid Supabase session cookie. The middleware (`middleware.ts`) refreshes the session on every request. Each API route handler calls `supabase.auth.getUser()` to verify the JWT and extract the `user.id`.

**Unauthorized requests** receive:
```json
{ "error": "Unauthorized" }  // 401
```

---

## 12. Security & Access Control

| Layer | Mechanism |
|---|---|
| **Authentication** | Supabase Auth with email verification, JWT tokens in HTTP-only cookies |
| **Session Management** | Next.js middleware refreshes session on every request, prevents expired tokens |
| **API Authorization** | Every route handler checks `supabase.auth.getUser()` before processing |
| **Data Isolation** | All DB queries include `.eq('user_id', user.id)` — users can only see their own data |
| **CSRF Protection** | SameSite cookie attributes (handled by Supabase SSR) |
| **Input Sanitization** | Supabase parameterized queries prevent SQL injection |
| **RLS (Recommended)** | Supabase Row Level Security policies should be enabled as a defense-in-depth measure |

---

## 13. Development Process & Timeline

### 13.1 Process

| Phase | Duration | Activities |
|---|---|---|
| **Phase 1: Research & Planning** | 1 week | Market research, PRD writing, wireframes, tech stack selection |
| **Phase 2: Database & Auth** | 1 week | Supabase project setup, schema design, migration scripts, auth flow |
| **Phase 3: Core API** | 1 week | CRUD endpoints for snippets, tags, versions |
| **Phase 4: Frontend — Dashboard** | 2 weeks | Snippet grid, search, filters, create/edit dialog, detail panel |
| **Phase 5: Advanced Features** | 1 week | Version history, diff viewer, syntax highlighting |
| **Phase 6: Polish & Testing** | 1 week | UI refinement, error handling, edge cases, responsive design |
| **Phase 7: Deployment** | 2 days | Vercel deployment, environment variables, domain setup |

### 13.2 Development Methodology

- **Agile sprints** (1 week each)
- **Git Flow** branching strategy (main → develop → feature branches)
- **Pull request reviews** before merging
- **Continuous deployment** via Vercel (auto-deploy on push to main)

---

## 14. Future Roadmap (Vision Only — Not Current Scope)

> ⚠️ **Disclaimer:** Everything below is **aspirational** — documented to show product vision and growth potential for academic evaluation. None of these are planned for the current prototype. Many would require paid services, significant engineering time, or both.

### Phase 2: Intelligence Layer 🧠 *(Would require paid APIs)*

| Feature | Description | Technology | Estimated Cost |
|---|---|---|---|
| **AI Auto-Tagging** | Analyze code on save → suggest tags | OpenAI API / local LLM | 💰 ~$5–20/month |
| **Semantic Search** | Natural language queries across snippets | `pgvector` + embeddings API | 💰 ~$5–10/month |
| **Smart Suggestions** | "You might also need..." recommendations | Collaborative filtering | ⏱️ Heavy dev time |
| **Code Explanation** | AI-generated description of what a snippet does | GPT-4o API | 💰 ~$10–30/month |

### Phase 3: Collaboration 🤝 *(Would require Supabase Pro plan)*

| Feature | Description | Estimated Cost |
|---|---|---|
| **Team Workspaces** | Shared snippet collections within an organization | 💰 Supabase Pro ($25/mo) |
| **Real-Time Co-Editing** | Live cursor and editing (like Google Docs for code) | 💰⏱️ Supabase Realtime + heavy dev |
| **Comment Threads** | Discussions on specific snippets or versions | ⏱️ Moderate dev time |
| **Snippet Marketplace** | Public, discoverable snippet library with upvotes | 💰⏱️ Infrastructure + heavy dev |

### Phase 4: Ecosystem 🌐 *(Separate projects entirely)*

| Feature | Description | Estimated Effort |
|---|---|---|
| **VS Code Extension** | Save/search/paste snippets directly from the IDE | ⏱️ 3–4 weeks |
| **Chrome Extension** | Right-click → save any code block from the web | ⏱️ 2–3 weeks |
| **CLI Tool** | `sv save`, `sv search`, `sv copy` commands | ⏱️ 1–2 weeks |
| **API for Developers** | Public REST API for third-party integrations | ⏱️ 1 week |
| **Webhook Triggers** | Notify external services when snippets are created/updated | ⏱️ 1 week |

> **Current status:** Phase 1 is complete and fully operational on free infrastructure. Phases 2–4 represent where the product *could* evolve if it transitions from a class prototype to a real product.

---

## 15. Success Metrics

### Product KPIs

| Metric | Target (MVP) | Target (6 months) |
|---|---|---|
| Registered Users | 50 | 1,000 |
| Daily Active Users | 10 | 200 |
| Snippets Created | 500 | 20,000 |
| Average Snippets per User | 10 | 20 |
| Average Versions per Snippet | 2 | 4 |
| Search Queries per Day | 50 | 2,000 |
| Copy-to-Clipboard Actions per Day | 30 | 1,500 |

### Technical KPIs

| Metric | Target |
|---|---|
| Page Load Time (LCP) | < 2.5 seconds |
| API Response Time (p95) | < 500ms |
| Uptime | 99.5% |
| Lighthouse Score | > 90 (all categories) |
| Error Rate | < 1% of API requests |

---

## Appendix A: Supported Languages

JavaScript, TypeScript, Python, Rust, Go, CSS, HTML, SQL, Bash, Java, C, C++, C#, Ruby, PHP, Swift, Kotlin, Scala, Haskell, Lua, Perl, R, Assembly, JSON, YAML, Markdown, Plain Text

## Appendix B: Glossary

| Term | Definition |
|---|---|
| **Snippet** | A reusable piece of code stored in SnippetVault |
| **Version** | A historical snapshot of a snippet's code content |
| **Commit Message** | A description of what changed in a version |
| **Diff** | A visual comparison of two versions showing additions and deletions |
| **Tag** | A user-defined label for categorizing snippets |
| **SWR** | Stale-While-Revalidate — a data fetching strategy that shows cached data while refreshing in the background |
| **RLS** | Row Level Security — database-level access control policies |
| **SSR** | Server-Side Rendering — HTML generated on the server for faster initial loads |

---

*Document End — SnippetVault PRD v1.0*
