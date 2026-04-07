# SnippetVault — Frontend Architecture Plan

**Version:** 1.0  
**Date:** April 7, 2026  
**Status:** Implemented ✅  
**Framework:** Next.js 16 (App Router) + React 19 + TypeScript

---

## Table of Contents

1. [Frontend Overview](#1-frontend-overview)
2. [Technology Choices & Justifications](#2-technology-choices--justifications)
3. [Application Structure](#3-application-structure)
4. [Routing Architecture](#4-routing-architecture)
5. [Component Architecture](#5-component-architecture)
6. [State Management Strategy](#6-state-management-strategy)
7. [Data Fetching with SWR](#7-data-fetching-with-swr)
8. [Component Deep Dive](#8-component-deep-dive)
9. [Styling Architecture](#9-styling-architecture)
10. [Type System](#10-type-system)
11. [Custom Hooks](#11-custom-hooks)
12. [User Experience Patterns](#12-user-experience-patterns)
13. [Performance Optimizations](#13-performance-optimizations)
14. [Accessibility (a11y)](#14-accessibility-a11y)
15. [File-by-File Reference](#15-file-by-file-reference)
16. [Known Limitations & Future Improvements](#16-known-limitations--future-improvements)

---

## 1. Frontend Overview

SnippetVault's frontend is a **hybrid-rendered** Next.js application:

- **Landing page, auth pages:** Server-Side Rendered (SSR) — fast initial load, SEO-friendly
- **Dashboard:** Client-Side Rendered (CSR) — interactive, real-time updates via SWR

### Frontend Responsibility Summary

```
┌────────────────────────────────────────────────────────┐
│                  FRONTEND RESPONSIBILITIES              │
├────────────────────────────────────────────────────────┤
│  ✅ Page routing (App Router)                          │
│  ✅ Server-side rendering (landing + auth pages)       │
│  ✅ Client-side interactivity (dashboard)              │
│  ✅ State management (React useState + SWR cache)      │
│  ✅ Data fetching + caching (SWR)                      │
│  ✅ Search with debounce                               │
│  ✅ Syntax highlighting (prism-react-renderer)         │
│  ✅ Diff computation + rendering (diff library)        │
│  ✅ Form handling (controlled inputs)                  │
│  ✅ Theme management (dark/light mode)                 │
│  ✅ Clipboard API integration                          │
│  ✅ Responsive layout                                  │
│  ✅ UI component library (shadcn/ui)                   │
└────────────────────────────────────────────────────────┘
```

---

## 2. Technology Choices & Justifications

### 2.1 Next.js 16 (App Router)

| Why Next.js | Benefit |
|---|---|
| App Router | File-system routing with layouts, loading states, error boundaries |
| Server Components | Landing page renders on server — fast, SEO-friendly |
| API Routes | Backend in same codebase — no separate server |
| Middleware | Route protection at the edge |
| Image Optimization | Automatic image compression and lazy loading |
| TypeScript first | Built-in TS support without extra config |
| Vercel integration | Zero-config deployment to Vercel's CDN |

### 2.2 React 19

| Feature Used | Where |
|---|---|
| `useState` | Form state, UI toggles, selection state |
| `useEffect` | Form pre-population on edit, side effects |
| `useCallback` | Memoized handlers to prevent re-renders |
| `useMemo` | Diff computation caching |
| Server Components | Landing page, auth pages, root layout |
| Client Components | Dashboard (marked with `'use client'`) |

### 2.3 shadcn/ui (57 Components)

**What:** A collection of re-usable, accessible UI components built with Radix UI primitives and styled with Tailwind CSS. Components are **copied into the project** (not installed as a dependency) — full control over customization.

**Components Used in SnippetVault:**

| Component | From | Used For |
|---|---|---|
| `Button` | shadcn/ui | All buttons (CTA, ghost, outline, icon) |
| `Card` | shadcn/ui | Snippet cards in the grid |
| `Dialog` | shadcn/ui | Create/edit snippet modal |
| `Sheet` | shadcn/ui | Right-side detail panel (slide-in) |
| `Input` | shadcn/ui | Search bar, form inputs |
| `Textarea` | shadcn/ui | Description field |
| `Select` | shadcn/ui | Language dropdown |
| `Badge` | shadcn/ui | Language labels, tags, version badges |
| `Tabs` | shadcn/ui | Code / History / Diff tabs in detail panel |
| `Label` | shadcn/ui | Form field labels |
| `AlertDialog` | shadcn/ui | Delete confirmation dialog |
| `Tooltip` | shadcn/ui | Hover hints |
| `Separator` | shadcn/ui | Visual dividers |

**Why shadcn/ui over alternatives?**

| Alternative | Why We Chose shadcn/ui |
|---|---|
| Material UI (MUI) | Too opinionated visual style; heavy bundle; Google aesthetic |
| Chakra UI | Good, but adds full runtime CSS-in-JS |
| Ant Design | Enterprise-focused; heavy; Chinese documentation primary |
| Headless UI | No styles — would need to build everything from scratch |
| Radix UI directly | shadcn/ui IS Radix — just pre-styled with Tailwind |

### 2.4 prism-react-renderer

**What:** A thin React wrapper around PrismJS that provides syntax highlighting as React components.

**Why:** Code snippets are the core product — they must look beautiful. `prism-react-renderer` provides:
- 27+ language support
- Night Owl theme (dark, high-contrast, easy on the eyes)
- Token-level rendering (allows custom styling per token type)
- Zero runtime cost — highlighting is computed at render time

### 2.5 SWR (Stale-While-Revalidate)

**What:** A React hooks library for data fetching by Vercel. Shows cached data first, then re-fetches in the background.

**Why SWR over alternatives?**

| Alternative | Why We Chose SWR |
|---|---|
| React Query (TanStack) | More features, but heavier; SWR is simpler and sufficient |
| `useEffect` + `fetch` | No caching, no revalidation, manual loading/error state |
| Next.js `fetch` + suspense | Good for server components; not ideal for client-side interactive data |
| Redux Toolkit Query | Overkill for this scope; adds Redux complexity |

### 2.6 diff (npm)

**What:** A JavaScript library that implements diff algorithms (unified, line-by-line, word-by-word).

**Used for:** Computing line-by-line differences between two snippet versions for the diff viewer.

---

## 3. Application Structure

### 3.1 Directory Tree

```
app/                              ← Next.js App Router
├── layout.tsx                    ← Root layout (fonts, theme provider, analytics)
├── page.tsx                      ← Landing page (/) — server component
├── globals.css                   ← Global styles + Tailwind config + design tokens
├── auth/
│   ├── login/page.tsx            ← Login form
│   ├── sign-up/page.tsx          ← Sign-up form
│   ├── sign-up-success/page.tsx  ← Post-signup confirmation
│   └── error/page.tsx            ← Auth error display
├── dashboard/
│   ├── layout.tsx                ← Dashboard layout (could add nav here)
│   └── page.tsx                  ← Main dashboard — client component ('use client')
└── api/                          ← Backend API routes (see Backend Plan)

components/                       ← Reusable React components
├── code-editor.tsx               ← Syntax-highlighted code viewer/editor
├── dashboard-header.tsx          ← Top bar with title
├── dashboard-sidebar.tsx         ← Left nav: logo, languages, sign out
├── diff-viewer.tsx               ← Side-by-side version diff
├── language-filter.tsx           ← Language chip filter bar
├── snippet-card.tsx              ← Grid card for a snippet
├── snippet-detail-panel.tsx      ← Right-side slide-in detail view
├── snippet-dialog.tsx            ← Create/edit modal form
├── tag-filter.tsx                ← Tag selection filter
├── theme-provider.tsx            ← next-themes wrapper
├── theme-toggle.tsx              ← Dark/light mode toggle button
├── version-history.tsx           ← Timeline of snippet versions
└── ui/                           ← shadcn/ui primitive components (57 files)
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── sheet.tsx
    ├── input.tsx
    ├── badge.tsx
    ├── tabs.tsx
    ├── select.tsx
    ├── alert-dialog.tsx
    └── ... (48 more)

hooks/                            ← Custom React hooks
├── use-debounce.ts               ← Debounce hook for search input
├── use-mobile.ts                 ← Mobile breakpoint detection
└── use-toast.ts                  ← Toast notification hook

lib/                              ← Shared utilities and types
├── types.ts                      ← TypeScript interfaces + language constants
├── utils.ts                      ← cn() className merge helper
└── supabase/                     ← Supabase client configurations
    ├── client.ts
    ├── server.ts
    └── middleware.ts
```

### 3.2 Rendering Strategy Per Route

| Route | Rendering | Why |
|---|---|---|
| `/` (Landing page) | **Server Component** (SSR) | SEO, fast initial paint, no interactivity needed |
| `/auth/login` | **Server Component** (SSR) | SEO, form submits to Supabase directly |
| `/auth/sign-up` | **Server Component** (SSR) | Same as login |
| `/dashboard` | **Client Component** (CSR) | Heavy interactivity: search, filter, create, edit, delete, diff |

---

## 4. Routing Architecture

### 4.1 Next.js App Router

```
URL Path                  →  File                           →  Rendering
/                         →  app/page.tsx                    →  SSR
/auth/login               →  app/auth/login/page.tsx         →  SSR
/auth/sign-up             →  app/auth/sign-up/page.tsx       →  SSR
/auth/sign-up-success     →  app/auth/sign-up-success/page.tsx → SSR
/auth/error               →  app/auth/error/page.tsx         →  SSR
/dashboard                →  app/dashboard/page.tsx          →  CSR ('use client')
```

### 4.2 Layout Hierarchy

```
RootLayout (app/layout.tsx)
├── Applies fonts (Inter + JetBrains Mono)
├── Wraps with ThemeProvider (dark/light mode)
├── Applies global CSS
├── Adds Vercel Analytics (production only)
│
├── Landing page (app/page.tsx)
│
├── Auth pages (app/auth/*/page.tsx)
│
└── DashboardLayout (app/dashboard/layout.tsx)
    └── Dashboard page (app/dashboard/page.tsx)
```

---

## 5. Component Architecture

### 5.1 Component Hierarchy (Dashboard)

```
DashboardPage ('use client')
│
├── DashboardSidebar
│   ├── Logo + Brand
│   ├── "New Snippet" button
│   ├── "All Snippets" link
│   ├── Language list (10 items)
│   ├── ThemeToggle
│   └── Sign Out button
│
├── Main Content Area
│   ├── Header ("My Snippets" + count + "New Snippet" button)
│   ├── Search Input (with debounce)
│   ├── LanguageFilter (chip bar)
│   │
│   ├── Loading State → Loader2 spinner
│   ├── Error State → "Failed to load snippets"
│   ├── Empty State → "No snippets yet" + icon
│   │
│   └── Snippet Grid (3 columns)
│       └── SnippetCard (× N)
│           ├── Title + Description
│           ├── CodeEditor (preview, 6 lines, read-only)
│           ├── Language Badge + Tag Badges
│           ├── Timestamp ("2h ago")
│           └── Copy Button (hover reveal)
│
├── SnippetDialog (Modal — Create/Edit)
│   ├── Title input
│   ├── Language select dropdown
│   ├── Description textarea
│   ├── CodeEditor (editable, full-height)
│   ├── Tag selector (toggle buttons)
│   ├── Commit message input (edit mode only)
│   └── Save / Cancel buttons
│
└── SnippetDetailPanel (Sheet — Right Slide-in)
    ├── Title + Description
    ├── Language Badge + Tag Badges
    ├── Copy / Edit / Delete buttons
    ├── Timestamp
    │
    └── Tabs
        ├── Code tab → CodeEditor (full, read-only)
        ├── History tab → VersionHistory
        │   └── Timeline of versions (clickable for diff selection)
        └── Diff tab → DiffViewer (appears when 2 versions selected)
            ├── Version labels (v1 → v3)
            ├── Stats (+N added, -N removed)
            └── Color-coded diff lines
```

### 5.2 Component Categories

| Category | Components | Pattern |
|---|---|---|
| **Page Components** | `HomePage`, `DashboardPage`, auth pages | Top-level, own their data |
| **Layout Components** | `DashboardSidebar`, `DashboardHeader` | Structural, receive callbacks |
| **Feature Components** | `SnippetCard`, `SnippetDialog`, `SnippetDetailPanel`, `VersionHistory`, `DiffViewer` | Business logic, domain-specific |
| **Input Components** | `CodeEditor`, `LanguageFilter`, `TagFilter` | Controlled inputs, emit changes |
| **Utility Components** | `ThemeProvider`, `ThemeToggle` | Cross-cutting concerns |
| **UI Primitives** | 57 shadcn/ui components | Generic, reusable, headless |

---

## 6. State Management Strategy

### 6.1 State Architecture

SnippetVault uses **NO global state library** (no Redux, no Zustand, no Context for data). All state is managed through:

1. **React `useState`** — Local component state
2. **SWR cache** — Server data cache (automatically synced)
3. **URL query params** — Filter state (reflected in SWR key)

### 6.2 State Inventory

| State Variable | Component | Type | Purpose |
|---|---|---|---|
| `searchQuery` | DashboardPage | `string` | Raw search input text |
| `debouncedSearch` | DashboardPage | `string` | Debounced version (300ms delay) |
| `selectedTagIds` | DashboardPage | `string[]` | Currently selected tag filter IDs |
| `selectedLanguage` | DashboardPage | `Language \| null` | Currently selected language filter |
| `isDialogOpen` | DashboardPage | `boolean` | Create/edit dialog visibility |
| `selectedSnippet` | DashboardPage | `SnippetWithTags \| null` | Snippet shown in detail panel |
| `editingSnippet` | DashboardPage | `SnippetWithTags \| null` | Snippet being edited (pre-fills dialog) |
| `copied` | SnippetCard, DetailPanel | `boolean` | Copy-to-clipboard confirmation state |
| `showDeleteDialog` | DetailPanel | `boolean` | Delete confirmation visibility |
| `selectedVersions` | DetailPanel | `[Version \| null, Version \| null]` | Two versions selected for diff |
| `isCollapsed` | DashboardSidebar | `boolean` | Sidebar expanded/collapsed |
| `title, description, language, content, commitMessage, selectedTagIds, isLoading` | SnippetDialog | various | Form field state |

### 6.3 Why No Global State?

- **SWR IS the source of truth** for server data. It caches, revalidates, and deduplicates automatically.
- **Filter state stays in the component** that owns it (DashboardPage). It doesn't need to leak to other pages.
- **Adding Redux would be over-engineering** for 12 state variables in one component tree.

---

## 7. Data Fetching with SWR

### 7.1 How SWR Works in SnippetVault

```typescript
const { data, error, mutate, isLoading } = useSWR<{ snippets: SnippetWithTags[]; tags: Tag[] }>(
  `/api/snippets?${queryParams.toString()}`,
  fetcher,
  { refreshInterval: 0 }
)
```

### 7.2 SWR Key Construction

The SWR cache key changes when filters change, triggering a new fetch:

```
No filters:     /api/snippets?
Search:         /api/snippets?search=sort
Language:       /api/snippets?language=python
Tags:           /api/snippets?tags=abc,def
Combined:       /api/snippets?search=sort&language=python&tags=abc,def
```

When the key changes, SWR:
1. Shows cached data for the new key (if any)
2. Fetches fresh data in the background
3. Updates the UI when fresh data arrives

### 7.3 Mutation Strategy (After Create/Update/Delete)

After a successful POST, PUT, or DELETE, the dashboard calls `mutate()`:

```typescript
// After creating/updating a snippet
const res = await fetch(url, { method, headers, body })
if (res.ok) {
  mutate()  // ← tells SWR to re-fetch the current key
}
```

This ensures the snippet list is always in sync with the database without a full page reload.

### 7.4 SWR for Version History

The detail panel fetches version history separately:

```typescript
const { data: versionsData } = useSWR<{ versions: SnippetVersion[] }>(
  snippet ? `/api/snippets/${snippet.id}/versions` : null,  // null = don't fetch
  fetcher
)
```

When `snippet` is null (panel closed), SWR doesn't fetch. When a snippet is selected, it fetches that snippet's version history.

---

## 8. Component Deep Dive

### 8.1 CodeEditor (`components/code-editor.tsx`)

**Purpose:** The core component — displays code with syntax highlighting. Has two modes:

**Read-Only Mode (preview + detail view):**
```
┌──────────────────────────────────────────┐
│ 1  │ function mergeSort(arr: number[]) { │  ← Line numbers
│ 2  │   if (arr.length <= 1) return arr;  │  ← Syntax highlighted
│ 3  │   const mid = Math.floor(arr.len... │
│ 4  │   ...                               │
└──────────────────────────────────────────┘
```

**Edit Mode (create/edit dialog):**
```
┌──────────────────────────────────────────┐
│  (transparent textarea overlay)           │  ← Captures user typing
│  (syntax highlighted preview underneath) │  ← Shows highlighted code
│                                           │  ← User types on top of preview
└──────────────────────────────────────────┘
```

**How the edit mode works (clever technique):**
1. A `<textarea>` is positioned absolutely, covering the entire container
2. The textarea text color is set to `transparent` — user doesn't see raw text
3. The caret is set to white — user sees the cursor
4. A `<Highlight>` component renders below as a visual preview
5. As the user types, the textarea value updates → re-renders the highlight
6. Result: User gets syntax highlighting while typing

```
 Z-INDEX STACK:
 ┌──────────┐
 │ textarea │  z-10  (transparent text, visible caret)
 ├──────────┤
 │ Highlight│  z-0   (syntax highlighted preview, pointer-events-none)
 └──────────┘
```

### 8.2 DiffViewer (`components/diff-viewer.tsx`)

**How diffs are computed:**

```typescript
import { diffLines } from 'diff'

const diff = diffLines(olderVersion.content, newerVersion.content)
// Returns: Change[] where each Change has:
//   { value: string, added?: boolean, removed?: boolean }
```

**Rendering logic:**

| Change Type | Visual | CSS Class |
|---|---|---|
| `added: true` | Green background, "+" prefix | `bg-emerald-500/20 text-emerald-400` |
| `removed: true` | Red background, "–" prefix | `bg-red-500/20 text-red-400` |
| Neither (unchanged) | No background, " " prefix | `text-foreground/80` |

**Version ordering:** Always computes diff from older → newer (sorts by `version_number`).

### 8.3 VersionHistory (`components/version-history.tsx`)

**Visual design:** A vertical timeline with:
- A connecting line (`absolute left-4 top-0 bottom-0 w-px bg-border`)
- Circular dots at each version point
- Version badge (v1, v2, v3)
- "Latest" badge on the newest version
- Commit message text
- Formatted timestamp

**Diff selection logic:**
```
Click version 1 → selected = [v1, null]      → "Select another to compare"
Click version 3 → selected = [v1, v3]        → "Diff" tab appears
Click version 1 → selected = [null, null]    → Deselects
Click version 2 → selected = [v2, null]      → New selection started
```

### 8.4 DashboardSidebar (`components/dashboard-sidebar.tsx`)

**Features:**
- Collapsible (260px ↔ 64px) with smooth transition
- Logo + brand name (hidden when collapsed)
- "New Snippet" button (icon-only when collapsed)
- "All Snippets" button (resets language filter)
- 10 language shortcuts with label (hidden when collapsed)
- Theme toggle button
- Sign out button

**Sign out flow:**
```typescript
const handleSignOut = async () => {
  const supabase = createClient()        // Browser client
  await supabase.auth.signOut()          // Clears session cookies
  router.push('/')                       // Redirect to landing
}
```

---

## 9. Styling Architecture

### 9.1 CSS Strategy

```
Tailwind CSS v4 (utility-first)
├── Design tokens defined as CSS variables in globals.css
├── Two themes: :root (light) and .dark (dark)
├── oklch color space for perceptually uniform colors
├── @theme inline block maps CSS vars to Tailwind tokens
├── @layer base for global resets
├── tw-animate-css for animation utilities
└── Components use utility classes directly (no custom CSS files)
```

### 9.2 Design Token Overview

```css
/* Key tokens */
--background       /* Page background */
--foreground        /* Primary text */
--card              /* Card/panel background */
--card-foreground   /* Text on cards */
--primary           /* Primary action color (buttons, links) */
--secondary         /* Secondary backgrounds */
--muted-foreground  /* De-emphasized text (timestamps, hints) */
--border            /* Border color for cards, inputs, dividers */
--input             /* Input background */
--destructive       /* Delete/error actions */
--sidebar           /* Sidebar background (dark in both themes) */
```

### 9.3 Fonts

```
Body text:    Inter (loaded via next/font/google)
Code text:    JetBrains Mono (loaded via next/font/google)
```

Both fonts are self-hosted by Next.js (no external requests after build), ensuring fast FOUT-free loading.

### 9.4 Dark Mode Implementation

```typescript
// theme-provider.tsx
<ThemeProvider
  attribute="class"          // Adds "dark" class to <html>
  defaultTheme="dark"        // Dark mode is default
  enableSystem                // Respects OS preference
  disableTransitionOnChange   // Prevents flash on theme switch
>
```

**How it works:**
1. `next-themes` reads OS preference or localStorage
2. Adds/removes `class="dark"` on `<html>`
3. All CSS variables switch via `.dark { ... }` block in globals.css
4. Tailwind's `dark:` variant applies dark styles

---

## 10. Type System

### 10.1 Core Types (`lib/types.ts`)

```typescript
// The main data models
interface Snippet {
  id: string
  user_id: string
  title: string
  description: string | null
  language: string
  current_content: string
  created_at: string
  updated_at: string
}

interface SnippetVersion {
  id: string
  snippet_id: string
  version_number: number
  content: string
  commit_message: string | null
  created_at: string
}

interface Tag {
  id: string
  user_id: string
  name: string
}

interface SnippetTag {
  snippet_id: string
  tag_id: string
}

// Extended type with joined tags
interface SnippetWithTags extends Snippet {
  tags: Tag[]
}

// Union type for supported languages
type Language = 'javascript' | 'typescript' | 'python' | ... | 'text'
```

### 10.2 Type Usage Across the App

| Type | Used By |
|---|---|
| `SnippetWithTags` | SnippetCard, SnippetDialog, SnippetDetailPanel, DashboardPage |
| `SnippetVersion` | VersionHistory, DiffViewer, SnippetDetailPanel |
| `Tag` | SnippetDialog (tag selector), DashboardPage (filter) |
| `Language` | CodeEditor, LanguageFilter, DashboardSidebar, SnippetDialog |
| `SUPPORTED_LANGUAGES` | SnippetDialog (dropdown), DashboardSidebar (filter list) |
| `QUICK_FILTER_LANGUAGES` | LanguageFilter (chip bar) |

---

## 11. Custom Hooks

### 11.1 `useDebounce` (`hooks/use-debounce.ts`)

**Purpose:** Delays updating a value until the user stops changing it. Used for search input.

**How it works:**
```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  
  return debouncedValue
}
```

**Usage:**
```typescript
const [searchQuery, setSearchQuery] = useState('')
const debouncedSearch = useDebounce(searchQuery, 300)
// debouncedSearch updates 300ms after user stops typing
// SWR key uses debouncedSearch → only fetches after 300ms pause
```

### 11.2 `useMobile` (`hooks/use-mobile.ts`)

**Purpose:** Detects if the viewport is mobile-sized.

**How it works:** Uses `window.matchMedia('(max-width: 768px)')` with a resize listener.

### 11.3 `useToast` (`hooks/use-toast.ts`)

**Purpose:** Provides toast notification functionality.

---

## 12. User Experience Patterns

### 12.1 Loading States

| Scenario | Loading UX |
|---|---|
| Initial page load | `<Loader2>` spinner (centered, 8×8) |
| SWR background refresh | No visible loading (stale data shown) |
| Creating snippet | Button shows spinner + disabled state |
| Search debouncing | No explicit loading (results update after 300ms) |

### 12.2 Error States

| Scenario | Error UX |
|---|---|
| API request fails | "Failed to load snippets" red text |
| No results | "No snippets found" with empty state icon |
| No snippets at all | "No snippets yet" with Code2 icon |

### 12.3 Copy-to-Clipboard Pattern

```
User clicks Copy
  ├── navigator.clipboard.writeText(content)
  ├── setCopied(true)
  ├── Icon morphs: Clipboard → Checkmark (green)
  ├── setTimeout(() => setCopied(false), 2000)
  └── After 2s: Icon reverts to Clipboard
```

### 12.4 Optimistic UX with SWR

When a user creates/updates/deletes a snippet:
1. The API call is made
2. On success, `mutate()` is called
3. SWR re-fetches in the background
4. The UI updates with fresh data

This is not true "optimistic UI" (we wait for server confirmation), but SWR's caching makes it feel fast because:
- The previous data stays visible during re-fetch
- Only the changed snippet card updates

---

## 13. Performance Optimizations

### 13.1 Current Optimizations

| Technique | Benefit | Where |
|---|---|---|
| **Next.js code splitting** | Each page loads only its own JS | Automatic |
| **SWR caching** | Re-renders from cache, fetches in background | Dashboard |
| **Debounced search** | 1 API call per 300ms, not per keystroke | Search input |
| **Font self-hosting** | No external requests to Google Fonts | `next/font/google` |
| **Tree-shaking** | Lucide icons individually imported, not full bundle | All components |
| **`useCallback`** | Memoized `handleSaveSnippet` to prevent child re-renders | DashboardPage |
| **`useMemo`** | Memoized diff computation (expensive) | DiffViewer |
| **Conditional fetching** | SWR only fetches versions when detail panel is open | SnippetDetailPanel |
| **Lazy rendering** | Code preview shows only first 6 lines | SnippetCard |
| **CSS variables** | Theme switching is CSS-only (no JS re-renders) | globals.css |

### 13.2 Bundle Size Considerations

| Library | Estimated Size (gzipped) | Justification |
|---|---|---|
| React + React DOM | ~45 KB | Core framework — unavoidable |
| Next.js runtime | ~25 KB | App Router runtime |
| SWR | ~4 KB | Tiny for the caching it provides |
| prism-react-renderer | ~12 KB | Essential for syntax highlighting |
| diff | ~3 KB | Essential for diff viewer |
| date-fns (tree-shaken) | ~2 KB | Only `format` and `formatDistanceToNow` used |
| lucide-react (tree-shaken) | ~1 KB | Only ~15 icons imported individually |
| Radix UI primitives | ~10 KB | Only imported components included |
| **Total estimated** | **~102 KB** | Lean for a full-featured app |

---

## 14. Accessibility (a11y)

### 14.1 Built-in Accessibility (via shadcn/ui + Radix)

| Feature | Component | How |
|---|---|---|
| **Keyboard navigation** | All interactive elements | Radix handles focus management |
| **Screen reader labels** | Dialog, Sheet, AlertDialog | `aria-label`, `aria-describedby` |
| **Focus trapping** | Dialog, AlertDialog | Focus stays inside modal when open |
| **Escape to close** | Dialog, Sheet, AlertDialog | Built into Radix |
| **Role attributes** | All Radix components | `role="dialog"`, `role="tab"`, etc. |
| **Color contrast** | Dark and light themes | oklch tokens chosen for WCAG AA |
| **Semantic HTML** | Landing page | `<header>`, `<main>`, `<footer>`, `<nav>` |

### 14.2 Custom Accessibility

| Feature | Implementation |
|---|---|
| Line numbers non-selectable | `select-none` on line number spans |
| Form field labels | Every input has an associated `<Label>` |
| Required field indication | `required` attribute on title input |
| Disabled state | Buttons disabled during submission |
| Focus visible | `outline-ring/50` applied globally |

---

## 15. File-by-File Reference

### Components (12 Custom + 57 UI Primitives)

| File | Lines | Purpose | Key Dependencies |
|---|---|---|---|
| `code-editor.tsx` | 119 | Syntax-highlighted code viewer/editor | prism-react-renderer |
| `dashboard-header.tsx` | ~70 | Top bar with user info | Button |
| `dashboard-sidebar.tsx` | 169 | Left nav with logo, languages, sign out | Button, ThemeToggle, Supabase Client |
| `diff-viewer.tsx` | 123 | Side-by-side version comparison | diff library, Badge |
| `language-filter.tsx` | ~50 | Language chip filter bar | Button |
| `snippet-card.tsx` | 94 | Grid card for one snippet | Card, Badge, CodeEditor, date-fns |
| `snippet-detail-panel.tsx` | 221 | Right-side detail sheet | Sheet, Tabs, AlertDialog, SWR |
| `snippet-dialog.tsx` | 223 | Create/edit modal form | Dialog, Input, Select, CodeEditor |
| `tag-filter.tsx` | ~80 | Tag selection/creation | Badge, Button |
| `theme-provider.tsx` | 10 | next-themes wrapper | next-themes |
| `theme-toggle.tsx` | ~25 | Dark/light toggle button | Button, useTheme |
| `version-history.tsx` | 118 | Timeline of versions | Badge, Button, date-fns |

### Pages

| File | Lines | Rendering | Purpose |
|---|---|---|---|
| `app/page.tsx` | 151 | SSR | Landing page with hero + features |
| `app/layout.tsx` | 54 | SSR | Root layout (fonts, theme, analytics) |
| `app/dashboard/page.tsx` | 194 | CSR | Main app: grid, search, filters |
| `app/dashboard/layout.tsx` | ~15 | SSR | Dashboard wrapper |

---

## 16. Known Limitations & Future Improvements

### Current Limitations

| Limitation | Impact | Fix |
|---|---|---|
| No loading skeletons | Spinner feels less polished than skeleton cards | Add `<Skeleton>` components |
| No error boundaries | Unhandled component error crashes the page | Add React Error Boundary |
| No keyboard shortcuts | Users can't use ⌘K for search, N for new | Add event listeners |
| Code editor is a textarea | No line numbers in edit mode, no auto-indent | Consider CodeMirror or Monaco |
| No drag-and-drop | Can't reorder snippets or tags | Add dnd-kit |
| No pagination | 1000+ snippets would load all at once | Add infinite scroll |
| No offline support | App requires internet connection | Add service worker + cache |
| Language filter not persisted | Refreshing resets filters | Sync to URL search params |
| No toast notifications on actions | No feedback on create/delete success | Wire up sonner toasts |

### What These Limitations Mean

For a class prototype demo with < 50 snippets, **none of these cause user-facing problems**. The app feels fast and responsive at this scale. These improvements become important only if the product grows beyond a prototype.

---

*Document End — SnippetVault Frontend Plan v1.0*
