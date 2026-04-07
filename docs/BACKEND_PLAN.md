# SnippetVault — Backend Architecture Plan

**Version:** 1.0  
**Date:** April 7, 2026  
**Status:** Implemented ✅  
**Cost:** $0 (Supabase Free Plan)

---

## Table of Contents

1. [Backend Overview](#1-backend-overview)
2. [Technology Choices & Justifications](#2-technology-choices--justifications)
3. [System Architecture](#3-system-architecture)
4. [Database Design](#4-database-design)
5. [Authentication System](#5-authentication-system)
6. [API Route Architecture](#6-api-route-architecture)
7. [Middleware Layer](#7-middleware-layer)
8. [Data Flow Walkthrough](#8-data-flow-walkthrough)
9. [Error Handling Strategy](#9-error-handling-strategy)
10. [Security Implementation](#10-security-implementation)
11. [Performance Considerations](#11-performance-considerations)
12. [File Structure & Code Organization](#12-file-structure--code-organization)
13. [Environment Configuration](#13-environment-configuration)
14. [Deployment Strategy](#14-deployment-strategy)
15. [Known Limitations & Future Improvements](#15-known-limitations--future-improvements)

---

## 1. Backend Overview

SnippetVault uses a **serverless backend architecture** powered by Next.js API Routes and Supabase. There is no traditional backend server — all server-side logic runs as serverless functions on Vercel, and the database + authentication are fully managed by Supabase.

### Architecture Decision: Why Serverless?

| Approach | Considered? | Why / Why Not |
|---|---|---|
| Traditional Node.js server (Express) | ❌ Rejected | Requires server hosting ($$$), manual scaling, separate deployment |
| Next.js API Routes (Serverless) | ✅ Chosen | Zero server management, auto-scaling, same codebase as frontend, free on Vercel |
| Supabase Edge Functions | ❌ Not needed | API Routes are sufficient for CRUD; Edge Functions are for isolated background tasks |
| REST API | ✅ Chosen | Simple, well-understood, fits the CRUD pattern perfectly |
| GraphQL | ❌ Rejected | Overkill for this scope; adds complexity with no real benefit for simple queries |

### Backend Responsibility Summary

```
┌────────────────────────────────────────────────────────┐
│                   BACKEND RESPONSIBILITIES              │
├────────────────────────────────────────────────────────┤
│  ✅ User Authentication (via Supabase Auth)            │
│  ✅ Session Management (cookie-based JWT refresh)      │
│  ✅ Route Protection (middleware)                      │
│  ✅ Snippet CRUD (create, read, update, delete)        │
│  ✅ Version History Management (auto-versioning)       │
│  ✅ Tag Management (CRUD + many-to-many linking)       │
│  ✅ Search & Filtering (full-text + language + tags)   │
│  ✅ Data Isolation (user-scoped queries)               │
└────────────────────────────────────────────────────────┘
```

---

## 2. Technology Choices & Justifications

### 2.1 Supabase (Database + Auth)

**What:** Supabase is an open-source Firebase alternative that provides a PostgreSQL database, authentication, and auto-generated REST API.

**Why Supabase over alternatives?**

| Alternative | Why We Chose Supabase Instead |
|---|---|
| Firebase | NoSQL (Firestore) — relational data fits better with PostgreSQL; vendor lock-in |
| MongoDB Atlas | No built-in auth; requires separate auth service; no SQL |
| PlanetScale | MySQL only; no built-in auth; no free tier for this scale |
| Raw PostgreSQL (self-hosted) | Requires server management, no built-in auth, no free hosting |
| Prisma + Railway | Good, but adds ORM complexity; Railway free tier is limited |

**Supabase Free Tier Includes:**
- 500 MB database storage
- 50,000 monthly active users (auth)
- Unlimited API calls
- 1 GB file storage
- 2 GB bandwidth
- Community support

### 2.2 Next.js API Routes

**What:** Next.js App Router provides a file-system-based API routing system. Each file in `app/api/` becomes a serverless function endpoint.

**Why API Routes over a separate backend?**
- **Same codebase** — No need to maintain two repos or two deployments
- **Same language** — TypeScript everywhere (frontend + backend)
- **Built-in typed routing** — File paths map directly to URL paths
- **Free hosting** — Vercel deploys API Routes as serverless functions at no cost
- **Automatic code splitting** — Each route is an independent function

### 2.3 @supabase/ssr

**What:** Official Supabase library for server-side rendering frameworks. Handles cookie-based authentication in Next.js.

**Why:** Standard Supabase JS client doesn't work with server-side cookies. `@supabase/ssr` provides:
- Cookie-based session management (no localStorage)
- Server component support
- Middleware integration for session refresh

---

## 3. System Architecture

### 3.1 High-Level Architecture Diagram

```
                    ┌──────────────────────┐
                    │     User's Browser    │
                    │                        │
                    │  React Components      │
                    │  (Client-Side)          │
                    └──────────┬─────────────┘
                               │
                        HTTP Requests
                    (fetch with cookies)
                               │
                               ▼
┌──────────────────────────────────────────────────────┐
│                    VERCEL EDGE NETWORK                 │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │               MIDDLEWARE LAYER                     │ │
│  │                                                    │ │
│  │  middleware.ts                                     │ │
│  │  ├── Runs on EVERY request (except static files)  │ │
│  │  ├── Refreshes Supabase auth cookies              │ │
│  │  ├── Redirects unauthenticated users from         │ │
│  │  │   /dashboard → /auth/login                     │ │
│  │  └── Redirects authenticated users from           │ │
│  │      /auth/login → /dashboard                     │ │
│  └──────────────────────────────────────────────────┘ │
│                          │                             │
│  ┌──────────────────────────────────────────────────┐ │
│  │             SERVERLESS FUNCTIONS                   │ │
│  │                                                    │ │
│  │  /api/snippets/route.ts        → GET, POST        │ │
│  │  /api/snippets/[id]/route.ts   → GET, PUT, DELETE │ │
│  │  /api/snippets/[id]/versions/  → GET              │ │
│  │  /api/tags/route.ts            → GET, POST        │ │
│  │                                                    │ │
│  │  Each function:                                   │ │
│  │  1. Creates Supabase server client (with cookies) │ │
│  │  2. Verifies user via getUser()                   │ │
│  │  3. Executes scoped database query                │ │
│  │  4. Returns JSON response                         │ │
│  └──────────────────────────────────────────────────┘ │
└──────────────────────┬───────────────────────────────┘
                       │
                 Supabase SDK
              (HTTPS + Postgres Wire)
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│                   SUPABASE CLOUD                      │
│                                                        │
│  ┌────────────┐    ┌────────────────────────────────┐ │
│  │  Auth       │    │     PostgreSQL Database         │ │
│  │  Service    │    │                                  │ │
│  │             │    │  Tables:                        │ │
│  │  • Sign Up  │    │   • snippets                   │ │
│  │  • Sign In  │    │   • snippet_versions           │ │
│  │  • JWT      │    │   • tags                       │ │
│  │  • Verify   │    │   • snippet_tags               │ │
│  │             │    │                                  │ │
│  │  Auth Users │    │  Built-in:                     │ │
│  │  Table      │──► │   • auth.users (managed)       │ │
│  └────────────┘    └────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

### 3.2 Request Lifecycle

Every API request follows this lifecycle:

```
1. Browser sends HTTP request with cookies
        │
2. Vercel Edge receives request
        │
3. Middleware executes:
   ├── Refreshes Supabase session cookies
   ├── Checks route protection rules
   └── Either allows through or redirects
        │
4. API Route handler executes:
   ├── Creates server-side Supabase client (reads cookies)
   ├── Calls supabase.auth.getUser() (verifies JWT)
   ├── Returns 401 if not authenticated
   ├── Executes database query (filtered by user_id)
   └── Returns JSON response
        │
5. Response sent back to browser
        │
6. SWR caches the response for future use
```

---

## 4. Database Design

### 4.1 Complete Schema

#### Table: `snippets`

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key |
| `user_id` | `uuid` | NO | — | FK → `auth.users(id)` |
| `title` | `text` | NO | — | Snippet title |
| `description` | `text` | YES | `null` | Optional description |
| `language` | `text` | NO | — | Programming language |
| `current_content` | `text` | NO | — | Latest version of code |
| `created_at` | `timestamptz` | NO | `now()` | Creation time |
| `updated_at` | `timestamptz` | NO | `now()` | Last modification time |

**Indexes:**
- `PRIMARY KEY (id)`
- `INDEX ON user_id` — for fast user-scoped queries
- `INDEX ON language` — for language filter queries
- `INDEX ON updated_at` — for sort-by-recent ordering

#### Table: `snippet_versions`

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key |
| `snippet_id` | `uuid` | NO | — | FK → `snippets(id)` ON DELETE CASCADE |
| `version_number` | `integer` | NO | — | Sequential version (1, 2, 3...) |
| `content` | `text` | NO | — | Code content of this version |
| `commit_message` | `text` | YES | `null` | Optional version note |
| `created_at` | `timestamptz` | NO | `now()` | Version creation time |

**Indexes:**
- `PRIMARY KEY (id)`
- `INDEX ON snippet_id` — for history lookup
- `UNIQUE (snippet_id, version_number)` — no duplicate versions

#### Table: `tags`

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key |
| `user_id` | `uuid` | NO | — | FK → `auth.users(id)` |
| `name` | `text` | NO | — | Tag name |

**Indexes:**
- `PRIMARY KEY (id)`
- `UNIQUE (user_id, name)` — no duplicate tag names per user

#### Table: `snippet_tags` (Junction)

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `snippet_id` | `uuid` | NO | — | FK → `snippets(id)` ON DELETE CASCADE |
| `tag_id` | `uuid` | NO | — | FK → `tags(id)` ON DELETE CASCADE |

**Indexes:**
- `PRIMARY KEY (snippet_id, tag_id)` — composite key

### 4.2 Entity Relationships

```
auth.users (1) ──── (N) snippets
auth.users (1) ──── (N) tags
snippets   (1) ──── (N) snippet_versions
snippets   (M) ──── (N) tags       (via snippet_tags)
```

### 4.3 SQL Migration Script

```sql
-- Create snippets table
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

-- Create snippet_versions table
CREATE TABLE public.snippet_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  snippet_id UUID REFERENCES public.snippets(id) ON DELETE CASCADE NOT NULL,
  version_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  commit_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (snippet_id, version_number)
);

-- Create tags table
CREATE TABLE public.tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  UNIQUE (user_id, name)
);

-- Create snippet_tags junction table
CREATE TABLE public.snippet_tags (
  snippet_id UUID REFERENCES public.snippets(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (snippet_id, tag_id)
);

-- Indexes for performance
CREATE INDEX idx_snippets_user_id ON public.snippets(user_id);
CREATE INDEX idx_snippets_language ON public.snippets(language);
CREATE INDEX idx_snippets_updated_at ON public.snippets(updated_at DESC);
CREATE INDEX idx_snippet_versions_snippet_id ON public.snippet_versions(snippet_id);
CREATE INDEX idx_tags_user_id ON public.tags(user_id);

-- Enable Row Level Security
ALTER TABLE public.snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.snippet_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.snippet_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own snippets"
  ON public.snippets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own snippets"
  ON public.snippets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own snippets"
  ON public.snippets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own snippets"
  ON public.snippets FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own tags"
  ON public.tags FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tags"
  ON public.tags FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own tags"
  ON public.tags FOR DELETE USING (auth.uid() = user_id);
```

---

## 5. Authentication System

### 5.1 Auth Flow

```
┌─────────────────────────────────────────────────────┐
│                  AUTHENTICATION FLOW                  │
├─────────────────────────────────────────────────────┤
│                                                       │
│  SIGN UP:                                            │
│  1. User enters email + password                     │
│  2. Client calls supabase.auth.signUp()              │
│  3. Supabase creates user in auth.users              │
│  4. Supabase sends confirmation email                │
│  5. User clicks email link → confirms account        │
│  6. Redirect to /auth/login                          │
│                                                       │
│  LOGIN:                                              │
│  1. User enters credentials                          │
│  2. Client calls supabase.auth.signInWithPassword()  │
│  3. Supabase validates credentials                   │
│  4. Returns JWT access token + refresh token         │
│  5. @supabase/ssr stores tokens in HTTP-only cookies │
│  6. Redirect to /dashboard                           │
│                                                       │
│  SESSION REFRESH (Middleware):                       │
│  1. Every request hits middleware.ts                  │
│  2. middleware calls updateSession()                  │
│  3. Supabase checks if JWT is expired                │
│  4. If expired, uses refresh token to get new JWT    │
│  5. Sets new cookies on the response                 │
│                                                       │
│  LOGOUT:                                             │
│  1. Client calls supabase.auth.signOut()             │
│  2. Cookies are cleared                              │
│  3. Redirect to /                                    │
│                                                       │
└─────────────────────────────────────────────────────┘
```

### 5.2 Three Supabase Client Configurations

| Client | File | Used In | Auth Method |
|---|---|---|---|
| **Browser Client** | `lib/supabase/client.ts` | Client components (e.g., sign out button) | Reads cookies from browser |
| **Server Client** | `lib/supabase/server.ts` | API routes, server components | Reads cookies from `next/headers` |
| **Middleware Client** | `lib/supabase/middleware.ts` | Next.js middleware | Reads/writes cookies on request/response |

### 5.3 Why Three Clients?

Next.js has three distinct execution contexts:

1. **Browser** — Client components. Can access `document.cookie`. Uses `createBrowserClient`.
2. **Server** — API routes, server components. Can access `cookies()` from `next/headers`. Uses `createServerClient`.
3. **Middleware** — Runs at the edge before routing. Has its own cookie API on `NextRequest`/`NextResponse`. Uses `createServerClient` with custom cookie handlers.

---

## 6. API Route Architecture

### 6.1 Route Map

```
app/api/
├── snippets/
│   ├── route.ts                    → GET (list), POST (create)
│   └── [id]/
│       ├── route.ts                → GET (single), PUT (update), DELETE
│       └── versions/
│           └── route.ts            → GET (version history)
└── tags/
    └── route.ts                    → GET (list), POST (create)
```

### 6.2 API Route Pattern (Every Route Follows This)

```typescript
// PATTERN: Every API route handler
export async function METHOD(request: NextRequest) {
  // 1. Create authenticated Supabase client
  const supabase = await createClient()

  // 2. Verify user identity
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 3. Execute user-scoped database query
  const { data, error } = await supabase
    .from('table_name')
    .select('*')
    .eq('user_id', user.id)  // ← ALWAYS SCOPED BY USER

  // 4. Handle errors
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 5. Return JSON response
  return NextResponse.json({ data })
}
```

### 6.3 Detailed Route Specifications

#### `GET /api/snippets` — List Snippets with Filtering

**Query Parameters:**
- `search` (string) — Full-text search across title, description, content
- `language` (string) — Filter by programming language
- `tags` (string) — Comma-separated tag IDs for AND-filter

**Logic:**
1. Build base query: `snippets WHERE user_id = user.id ORDER BY updated_at DESC`
2. If `search` → append `.or(title.ilike.%search%, description.ilike.%search%, current_content.ilike.%search%)`
3. If `language` → append `.eq('language', language)`
4. Fetch all `snippet_tags` for the result set
5. Fetch all `tags` for the user
6. Build `snippetsWithTags[]` by joining in memory
7. If `tags` param → filter snippets that have ALL specified tags (AND logic)
8. Return `{ snippets, tags }`

**Query Count:** 3 queries (snippets, snippet_tags, tags)

#### `POST /api/snippets` — Create Snippet

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "language": "string (required)",
  "content": "string (required)",
  "commitMessage": "string (optional)",
  "tagIds": ["uuid[]"]
}
```

**Logic:**
1. INSERT snippet row → get snippet.id
2. INSERT snippet_versions row (version_number: 1, commit_message: provided or "Initial version")
3. If tagIds provided → INSERT snippet_tags junction rows
4. Return `{ snippet }`

**Query Count:** 2–3 queries (snippet, version, optionally tags)

#### `PUT /api/snippets/[id]` — Update Snippet

**Logic:**
1. Fetch existing snippet (verify ownership)
2. UPDATE snippet row (title, description, language, current_content, updated_at)
3. If `content` changed from existing:
   - Fetch latest version_number
   - INSERT new snippet_versions row (version_number + 1)
4. DELETE all existing snippet_tags for this snippet
5. INSERT new snippet_tags junction rows
6. Return `{ snippet }`

**Query Count:** 4–5 queries

#### `DELETE /api/snippets/[id]` — Delete Snippet

**Logic:**
1. DELETE snippet WHERE id = param AND user_id = user.id
2. Cascade automatically deletes: snippet_versions, snippet_tags

**Query Count:** 1 query (cascades handled by DB)

#### `GET /api/snippets/[id]/versions` — Version History

**Logic:**
1. Verify snippet ownership (SELECT snippet WHERE id AND user_id)
2. SELECT all versions ORDER BY version_number DESC
3. Return `{ versions }`

**Query Count:** 2 queries

#### `POST /api/tags` — Create Tag

**Logic:**
1. Validate name is non-empty string
2. INSERT tag (user_id, name)
3. Handle unique constraint violation (error code 23505 → 409 Conflict)
4. Return `{ tag }`

**Error Handling:** Returns 409 if tag name already exists for this user

---

## 7. Middleware Layer

### 7.1 What the Middleware Does

```
middleware.ts (runs on EVERY request except static files)
│
├── 1. Calls updateSession(request)
│      └── Refreshes Supabase JWT if expired (using refresh token cookie)
│
├── 2. Checks authentication state
│      └── supabase.auth.getUser() → user or null
│
├── 3. Route Protection Rules:
│      ├── /dashboard/* + no user → REDIRECT to /auth/login
│      ├── /auth/login + has user → REDIRECT to /dashboard
│      └── /auth/sign-up + has user → REDIRECT to /dashboard
│
└── 4. Returns response (with updated cookies)
```

### 7.2 Matcher Configuration

```typescript
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

This regex means: **run middleware on ALL routes EXCEPT:**
- `_next/static/*` (compiled JS/CSS bundles)
- `_next/image/*` (optimized images)
- `favicon.ico`
- Any file with image extension (`.svg`, `.png`, `.jpg`, etc.)

---

## 8. Data Flow Walkthrough

### 8.1 Complete Flow: "User Creates a Snippet"

```
 STEP  │  LAYER         │  ACTION
───────┼────────────────┼──────────────────────────────────────
  1    │  Browser       │  User fills form, clicks "Create Snippet"
  2    │  React         │  SnippetDialog calls handleSubmit()
  3    │  React         │  fetch('/api/snippets', { method:'POST', body:{...} })
  4    │  Vercel Edge   │  Request enters Vercel network
  5    │  Middleware     │  updateSession() refreshes JWT cookie
  6    │  Middleware     │  Request allowed through (not /dashboard protection concern)
  7    │  API Route     │  POST handler: createClient() → reads cookies
  8    │  API Route     │  supabase.auth.getUser() → returns { user: { id: 'abc' } }
  9    │  API Route     │  INSERT INTO snippets (user_id='abc', title, language, content)
 10    │  Supabase      │  PostgreSQL executes INSERT → returns snippet row with UUID id
 11    │  API Route     │  INSERT INTO snippet_versions (snippet_id, v1, content, message)
 12    │  Supabase      │  PostgreSQL executes INSERT → returns version row
 13    │  API Route     │  INSERT INTO snippet_tags (snippet_id, tag1), (snippet_id, tag2)
 14    │  Supabase      │  PostgreSQL executes INSERT → returns tag links
 15    │  API Route     │  Return NextResponse.json({ snippet })
 16    │  Vercel Edge   │  Response sent to browser
 17    │  React (SWR)   │  mutate() called → SWR re-fetches GET /api/snippets
 18    │  React         │  Snippet grid re-renders with new card
```

### 8.2 Complete Flow: "User Searches for 'sort'"

```
 STEP  │  LAYER         │  ACTION
───────┼────────────────┼──────────────────────────────────────
  1    │  Browser       │  User types "sort" in search bar
  2    │  React         │  useDebounce delays 300ms
  3    │  React         │  SWR key changes to /api/snippets?search=sort
  4    │  React (SWR)   │  fetch('/api/snippets?search=sort')
  5    │  Middleware     │  Session refreshed
  6    │  API Route     │  GET handler: reads searchParams.get('search') → "sort"
  7    │  API Route     │  query.or(`title.ilike.%sort%, description.ilike.%sort%, 
       │                │    current_content.ilike.%sort%`)
  8    │  Supabase      │  PostgreSQL executes ILIKE query → returns matching rows
  9    │  API Route     │  Fetches snippet_tags and tags for joined result
 10    │  API Route     │  Builds snippetsWithTags array
 11    │  API Route     │  Returns JSON
 12    │  React (SWR)   │  Updates cache → grid re-renders with filtered results
```

---

## 9. Error Handling Strategy

### 9.1 Error Types & Responses

| Error Type | HTTP Code | Response Body | When It Happens |
|---|---|---|---|
| Not authenticated | `401` | `{ error: "Unauthorized" }` | No valid session cookie |
| Resource not found | `404` | `{ error: "Snippet not found" }` | Snippet doesn't exist or not owned by user |
| Validation error | `400` | `{ error: "Name is required" }` | Missing/invalid request body fields |
| Duplicate resource | `409` | `{ error: "Tag already exists" }` | Unique constraint violated (tag name) |
| Server error | `500` | `{ error: "<db error message>" }` | Database query failure |

### 9.2 Client-Side Error Handling

```
SWR Config:
├── On error → Dashboard shows "Failed to load snippets" red text  
├── On loading → Dashboard shows spinner (Loader2 icon)
├── On empty → Dashboard shows "No snippets yet" empty state
└── On success → Dashboard renders snippet grid
```

---

## 10. Security Implementation

### 10.1 Security Layers

```
Layer 1: MIDDLEWARE
  └── Session refresh + route protection

Layer 2: API ROUTE (auth check)
  └── supabase.auth.getUser() on every request

Layer 3: DATABASE QUERY (user scoping)
  └── .eq('user_id', user.id) on every query

Layer 4: DATABASE (RLS policies)
  └── Row Level Security as defense-in-depth

Layer 5: SUPABASE SDK (parameterized queries)
  └── Prevents SQL injection automatically

Layer 6: COOKIES (security attributes)
  └── HTTP-only, Secure, SameSite — prevents XSS/CSRF
```

### 10.2 Why We Check Auth at BOTH Middleware AND API Route Level

| Layer | Purpose |
|---|---|
| **Middleware** | User experience — redirect to login page before rendering dashboard |
| **API Route** | Security — protect the actual data even if middleware is bypassed |

The middleware is for UX (nice redirects). The API route is for security (actual gate). Never rely on one alone.

---

## 11. Performance Considerations

### 11.1 Current Approach

| Technique | Benefit |
|---|---|
| **SWR caching** | Cached data shown instantly while background refresh happens |
| **Debounced search** | Only 1 API call per 300ms of typing, not per keystroke |
| **Index on user_id** | Fast user-scoped queries (most common query pattern) |
| **Index on updated_at** | Fast sort-by-recent without full table scan |
| **current_content in snippets** | Avoids a JOIN to versions table for the most common view |
| **Serverless cold starts** | Minimal — Vercel keeps functions warm for ~15 minutes |

### 11.2 Query Count Per Operation

| Operation | Queries | Notes |
|---|---|---|
| List snippets | 3 | snippets + snippet_tags + tags |
| Create snippet | 2–3 | snippet + version + optionally tags |
| Update snippet | 4–5 | fetch existing + update + version + delete old tags + insert new tags |
| Delete snippet | 1 | CASCADE handles related rows |
| Version history | 2 | verify ownership + fetch versions |
| Create tag | 1 | single insert |

---

## 12. File Structure & Code Organization

```
Backend Files:
│
├── middleware.ts                           # Route protection + session refresh
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                      # Browser-side Supabase client
│   │   ├── server.ts                      # Server-side Supabase client (API routes)
│   │   └── middleware.ts                  # Middleware-specific Supabase client
│   ├── types.ts                           # Shared TypeScript interfaces
│   └── utils.ts                           # Utility functions (cn helper)
│
├── app/api/
│   ├── snippets/
│   │   ├── route.ts                       # GET (list+filter) / POST (create)
│   │   └── [id]/
│   │       ├── route.ts                   # GET / PUT / DELETE single snippet
│   │       └── versions/
│   │           └── route.ts               # GET version history
│   └── tags/
│       └── route.ts                       # GET (list) / POST (create)
│
└── app/auth/
    ├── login/                             # Login page (calls Supabase Auth)
    ├── sign-up/                           # Sign-up page
    ├── sign-up-success/                   # Post-signup confirmation
    └── error/                             # Auth error page
```

---

## 13. Environment Configuration

### Required Environment Variables

```env
# Supabase (from Supabase dashboard → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# Note: Both are prefixed with NEXT_PUBLIC_ because they are
# needed in both server and client code. The anon key is safe
# to expose — it only grants access allowed by RLS policies.
```

### Setting Up

1. Go to [supabase.com](https://supabase.com) → Create new project (Free plan)
2. Go to Project Settings → API → Copy Project URL and Anon Key
3. Create `.env.local` in project root with the values above
4. Run the SQL migration script (Section 4.3) in Supabase SQL Editor

---

## 14. Deployment Strategy

### Deployment Pipeline

```
Developer pushes to GitHub (main branch)
        │
        ▼
Vercel detects push (GitHub integration)
        │
        ▼
Vercel runs: npm run build (next build)
        │
        ├── Compiles React components → static HTML/JS
        ├── Bundles API routes → serverless functions
        └── Generates edge middleware
        │
        ▼
Vercel deploys to global CDN
        │
        ├── Static files → CDN edge nodes worldwide
        ├── API routes → serverless functions (us-east-1)
        └── Middleware → edge runtime (all regions)
        │
        ▼
Live at: https://your-project.vercel.app
```

### Cost: $0

| Resource | Plan | Cost |
|---|---|---|
| Vercel | Hobby (Free) | $0/month |
| Supabase | Free | $0/month |
| Domain | Optional | $0 (use .vercel.app) |

---

## 15. Known Limitations & Future Improvements

### Current Limitations

| Limitation | Impact | Fix (Future Scope) |
|---|---|---|
| No server-side input validation | Malformed data could enter DB | Add Zod schemas to API routes |
| Tag filtering is client-side | Slow for users with 1000+ snippets | Move to DB JOIN query |
| No pagination | All snippets loaded at once | Add cursor-based pagination |
| 3 queries for listing snippets | Slightly slower than necessary | Use Supabase JOIN query |
| No rate limiting | API abuse possible | Add Vercel rate limiting |
| No full-text search index | ILIKE is slow for large datasets | Add PostgreSQL `tsvector` index |
| No caching layer | Every request hits DB | Add Redis or Vercel KV cache |

### What These Limitations Mean Right Now

For a prototype with < 100 users and < 1000 snippets per user, **none of these limitations will cause problems**. They only become relevant at scale.

---

*Document End — SnippetVault Backend Plan v1.0*
