continue# Phase 3 Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 5 high-impact features — Snippet Pinning, Command Palette (⌘K), Public Sharing, Export as Code Image, and Collections/Folders — to SnippetVault.

**Architecture:** Each feature is independently deployable in the order listed. Features 1–2 are frontend-only with a lightweight API touch. Features 3 and 5 require Supabase SQL migrations run manually in the Supabase dashboard. Feature 4 requires one new npm package. Each feature is self-contained: finish one before starting the next.

**Tech Stack:** Next.js 16 App Router, TypeScript strict, Supabase (PostgreSQL + RLS), SWR, Tailwind CSS v4, shadcn/ui, `cmdk` (already installed), `html-to-image` (install in Feature 4), `zod`, `sonner`

---

> ⚠️ **Scope Note:** These 5 features are independent subsystems. Treat each H2 section as a mini-plan. Complete and commit each feature before starting the next. SQL migrations must be run in the Supabase SQL editor before touching code for that feature.

---

## Feature 1 — Snippet Pinning

**What it does:** Users can pin important snippets. Pinned snippets sort to the top of the grid and show a pin indicator on their card.

**Files touched:**
- Modify: `lib/types.ts` — add `is_pinned` to `Snippet`
- Modify: `app/api/snippets/route.ts` — dual-sort pinned first
- Modify: `app/api/snippets/[id]/route.ts` — add `PATCH` handler
- Modify: `components/snippet-card.tsx` — pin toggle button + visual indicator
- Modify: `app/dashboard/page.tsx` — `handlePin` callback

---

### Task 1: Run the DB migration

**Files:** Supabase SQL editor (manual step — not a code file)

- [x] **Step 1.1: Run this SQL in your Supabase dashboard → SQL Editor**

```sql
ALTER TABLE snippets ADD COLUMN is_pinned boolean NOT NULL DEFAULT false;
```

Expected: "Success. No rows returned."

- [x] **Step 1.2: Verify the column exists**

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'snippets' AND column_name = 'is_pinned';
```

Expected: one row showing `is_pinned | boolean | false`

---

### Task 2: Update types + API GET sort

**Files:**
- Modify: `lib/types.ts:1-10`
- Modify: `app/api/snippets/route.ts:30-33`

- [x] **Step 2.1: Add `is_pinned` to the `Snippet` interface in `lib/types.ts`**

```typescript
export interface Snippet {
  id: string
  user_id: string
  title: string
  description: string | null
  language: string
  current_content: string
  is_pinned: boolean
  created_at: string
  updated_at: string
}
```

- [x] **Step 2.2: Update the GET query in `app/api/snippets/route.ts` to sort pinned first**

Replace the existing `.order('updated_at', { ascending: false })` line with:

```typescript
  let query = supabase
    .from('snippets')
    .select('*, snippet_tags(tags(id, name))')
    .eq('user_id', user.id)
    .order('is_pinned', { ascending: false })
    .order('updated_at', { ascending: false })
```

- [x] **Step 2.3: Commit**

```bash
git add lib/types.ts app/api/snippets/route.ts
git commit -m "feat(pin): add is_pinned column migration + sort pinned first in GET"
```

---

### Task 3: Add PATCH endpoint for quick updates

**Files:**
- Modify: `app/api/snippets/[id]/route.ts` — append PATCH handler after the DELETE export

- [x] **Step 3.1: Add the `patchSchema` and `PATCH` handler at the bottom of `app/api/snippets/[id]/route.ts`**

```typescript
const patchSchema = z.object({
  is_pinned: z.boolean().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message || 'Invalid body' },
      { status: 400 }
    )
  }

  const { data: snippet, error } = await supabase
    .from('snippets')
    .update(parsed.data)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ snippet })
}
```

- [x] **Step 3.2: Commit**

```bash
git add app/api/snippets/[id]/route.ts
git commit -m "feat(pin): add PATCH /api/snippets/[id] for quick field updates"
```

---

### Task 4: Snippet card pin toggle UI

**Files:**
- Modify: `components/snippet-card.tsx`

- [x] **Step 4.1: Replace the full content of `components/snippet-card.tsx`**

```typescript
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Clock, Check, Pin, PinOff } from 'lucide-react'
import { SnippetWithTags, Language } from '@/lib/types'
import { CodeEditor } from './code-editor'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '@/lib/utils'

const languageColors: Record<string, string> = {
  javascript: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  typescript: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  python: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  rust: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  go: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  css: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
  html: 'bg-red-500/15 text-red-400 border-red-500/30',
  sql: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
}

interface SnippetCardProps {
  snippet: SnippetWithTags
  onClick: () => void
  onPin: (id: string, pinned: boolean) => void
}

export function SnippetCard({ snippet, onClick, onPin }: SnippetCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(snippet.current_content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation()
    onPin(snippet.id, !snippet.is_pinned)
  }

  const previewContent = snippet.current_content.split('\n').slice(0, 6).join('\n')

  return (
    <Card
      className={cn(
        'bg-card border rounded-xl cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 group',
        snippet.is_pinned
          ? 'border-primary/40 shadow-sm shadow-primary/10'
          : 'border-border hover:border-primary/40 hover:bg-card/80'
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              {snippet.is_pinned && (
                <Pin className="h-3 w-3 text-primary shrink-0" />
              )}
              <CardTitle className="text-base font-medium text-card-foreground truncate">
                {snippet.title}
              </CardTitle>
            </div>
            {snippet.description && (
              <p className="mt-1 text-sm text-muted-foreground truncate">
                {snippet.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-8 w-8 transition-opacity duration-200 border',
                snippet.is_pinned
                  ? 'opacity-100 border-primary/30 text-primary hover:bg-primary/10'
                  : 'opacity-0 group-hover:opacity-100 border-border hover:border-primary/50'
              )}
              onClick={handlePin}
              title={snippet.is_pinned ? 'Unpin' : 'Pin to top'}
            >
              {snippet.is_pinned ? (
                <PinOff className="h-3.5 w-3.5" />
              ) : (
                <Pin className="h-3.5 w-3.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-border hover:border-primary/50"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="mb-3 h-32 overflow-hidden rounded-md">
          <CodeEditor
            value={previewContent}
            language={snippet.language as Language}
            readOnly
            className="h-full text-xs"
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className={cn('text-xs px-2 py-0.5 rounded-full border shrink-0', languageColors[snippet.language.toLowerCase()] ?? 'bg-secondary text-secondary-foreground border-border')}>
              {snippet.language}
            </span>
            {snippet.tags.slice(0, 2).map((tag) => (
              <span key={tag.id} className="text-xs px-2 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground shrink-0">
                {tag.name}
              </span>
            ))}
            {snippet.tags.length > 2 && (
              <span className="text-xs text-muted-foreground">
                +{snippet.tags.length - 2}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Clock className="h-3 w-3" />
            <span>{formatDistanceToNow(new Date(snippet.updated_at), { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

---

### Task 5: Wire pin handler in dashboard

**Files:**
- Modify: `app/dashboard/page.tsx`

- [x] **Step 5.1: Add `handlePinSnippet` in `app/dashboard/page.tsx` after `handleDeleteSnippet`**

```typescript
  const handlePinSnippet = async (id: string, pinned: boolean) => {
    const res = await fetch(`/api/snippets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_pinned: pinned }),
    })
    if (res.ok) {
      mutate()
    } else {
      toast.error('Failed to update pin')
    }
  }
```

- [x] **Step 5.2: Pass `onPin` to every `SnippetCard` in the grid**

Find the `<SnippetCard` usage and update it:

```typescript
              {snippets.map((snippet) => (
                <SnippetCard
                  key={snippet.id}
                  snippet={snippet}
                  onClick={() => setSelectedSnippet(snippet)}
                  onPin={handlePinSnippet}
                />
              ))}
```

- [x] **Step 5.3: Commit**

```bash
git add components/snippet-card.tsx app/dashboard/page.tsx
git commit -m "feat(pin): pin toggle on cards, pinned sort to top"
```

---

## Feature 2 — Command Palette (⌘K)

**What it does:** Press `⌘K` / `Ctrl+K` anywhere on the dashboard to open a fuzzy-search palette. Type to filter snippets by title or language. Hit Enter (or click) to open a snippet. Includes quick actions for New Snippet.

**Files touched:**
- Create: `components/command-palette.tsx`
- Modify: `app/dashboard/page.tsx` — render `<CommandPalette />`

---

### Task 6: Create command-palette component

**Files:**
- Create: `components/command-palette.tsx`

- [x] **Step 6.1: Create `components/command-palette.tsx`**

```typescript
'use client'

import { useEffect, useState } from 'react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { SnippetWithTags } from '@/lib/types'
import { Code2, Plus, FileCode } from 'lucide-react'

const languageColors: Record<string, string> = {
  javascript: 'text-amber-400',
  typescript: 'text-blue-400',
  python: 'text-sky-400',
  rust: 'text-orange-400',
  go: 'text-cyan-400',
  css: 'text-pink-400',
  html: 'text-red-400',
  sql: 'text-violet-400',
}

interface CommandPaletteProps {
  snippets: SnippetWithTags[]
  onSelectSnippet: (snippet: SnippetWithTags) => void
  onNewSnippet: () => void
}

export function CommandPalette({
  snippets,
  onSelectSnippet,
  onNewSnippet,
}: CommandPaletteProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleSelectSnippet = (snippet: SnippetWithTags) => {
    onSelectSnippet(snippet)
    setOpen(false)
  }

  const handleNewSnippet = () => {
    onNewSnippet()
    setOpen(false)
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command Palette"
      description="Search snippets or run an action"
      showCloseButton={false}
      className="bg-card border-border"
    >
      <CommandInput placeholder="Search snippets..." />
      <CommandList>
        <CommandEmpty>No snippets found.</CommandEmpty>

        {snippets.length > 0 && (
          <CommandGroup heading="Snippets">
            {snippets.map((snippet) => (
              <CommandItem
                key={snippet.id}
                value={`${snippet.title} ${snippet.language} ${snippet.tags.map(t => t.name).join(' ')}`}
                onSelect={() => handleSelectSnippet(snippet)}
                className="gap-3"
              >
                <FileCode className={`h-4 w-4 shrink-0 ${languageColors[snippet.language] ?? 'text-muted-foreground'}`} />
                <span className="flex-1 truncate">{snippet.title}</span>
                <span className="text-xs text-muted-foreground shrink-0">{snippet.language}</span>
                {snippet.is_pinned && (
                  <span className="text-xs text-primary shrink-0">pinned</span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem onSelect={handleNewSnippet} className="gap-3">
            <Plus className="h-4 w-4 text-muted-foreground" />
            <span>New Snippet</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
```

---

### Task 7: Wire command palette into dashboard

**Files:**
- Modify: `app/dashboard/page.tsx`

- [x] **Step 7.1: Import `CommandPalette` at the top of `app/dashboard/page.tsx`**

```typescript
import { CommandPalette } from '@/components/command-palette'
```

- [x] **Step 7.2: Render `<CommandPalette />` just before the closing `</div>` of the root element in `DashboardPage`**

Place it after `</SnippetDetailPanel>`, before the final `</div>`:

```typescript
      <CommandPalette
        snippets={snippets}
        onSelectSnippet={setSelectedSnippet}
        onNewSnippet={handleNewSnippet}
      />
```

- [x] **Step 7.3: Commit**

```bash
git add components/command-palette.tsx app/dashboard/page.tsx
git commit -m "feat(cmd): add ⌘K command palette with snippet search and quick actions"
```

---

## Feature 3 — Public Sharing

**What it does:** Each snippet can be made public. Sharing generates a short unique slug. The URL `/s/[slug]` shows a beautiful public page (no login required). Users can copy the shareable link from the detail panel.

**Files touched:**
- Supabase SQL migrations (manual)
- Modify: `lib/types.ts` — add `is_public`, `share_slug`
- Modify: `app/api/snippets/[id]/route.ts` — extend PATCH schema, handle slug generation
- Modify: `components/snippet-detail-panel.tsx` — share toggle + copy link UI
- Create: `app/s/[slug]/page.tsx` — public read-only page (Server Component)
- Create: `app/s/[slug]/not-found.tsx` — 404 page for invalid slugs (optional but clean)

---

### Task 8: DB migration for public sharing

- [x] **Step 8.1: Run this SQL in Supabase SQL Editor**

```sql
ALTER TABLE snippets
  ADD COLUMN is_public boolean NOT NULL DEFAULT false,
  ADD COLUMN share_slug text UNIQUE;

-- Allow anyone (including unauthenticated) to read public snippets
CREATE POLICY "Public snippets are readable by anyone"
  ON snippets
  FOR SELECT
  USING (is_public = true);
```

- [x] **Step 8.2: Verify**

```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'snippets' AND column_name IN ('is_public', 'share_slug');
```

Expected: 2 rows.

---

### Task 9: Update types + extend PATCH endpoint

**Files:**
- Modify: `lib/types.ts`
- Modify: `app/api/snippets/[id]/route.ts`

- [x] **Step 9.1: Add `is_public` and `share_slug` to `Snippet` in `lib/types.ts`**

```typescript
export interface Snippet {
  id: string
  user_id: string
  title: string
  description: string | null
  language: string
  current_content: string
  is_pinned: boolean
  is_public: boolean
  share_slug: string | null
  created_at: string
  updated_at: string
}
```

- [x] **Step 9.2: Extend `patchSchema` in `app/api/snippets/[id]/route.ts` to handle `is_public`**

Replace the existing `patchSchema` with:

```typescript
const patchSchema = z.object({
  is_pinned: z.boolean().optional(),
  is_public: z.boolean().optional(),
})
```

Replace the existing `PATCH` handler body with:

```typescript
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message || 'Invalid body' },
      { status: 400 }
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: Record<string, any> = {}

  if (parsed.data.is_pinned !== undefined) {
    updates.is_pinned = parsed.data.is_pinned
  }

  if (parsed.data.is_public !== undefined) {
    updates.is_public = parsed.data.is_public
    if (parsed.data.is_public) {
      // Generate slug only if one doesn't exist yet
      const { data: existing } = await supabase
        .from('snippets')
        .select('share_slug')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()
      if (!existing?.share_slug) {
        updates.share_slug = Math.random().toString(36).slice(2, 12)
      }
    }
  }

  const { data: snippet, error } = await supabase
    .from('snippets')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ snippet })
}
```

- [x] **Step 9.3: Commit**

```bash
git add lib/types.ts app/api/snippets/[id]/route.ts
git commit -m "feat(share): add is_public + share_slug to types and PATCH endpoint"
```

---

### Task 10: Share toggle UI in detail panel

**Files:**
- Modify: `components/snippet-detail-panel.tsx`

- [x] **Step 10.1: Add share state and handler inside `SnippetDetailPanel`**

After the `clearDiffSelection` function, add:

```typescript
  const handleToggleShare = async () => {
    if (!snippet) return
    const newValue = !snippet.is_public
    const res = await fetch(`/api/snippets/${snippet.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_public: newValue }),
    })
    if (res.ok) {
      const { snippet: updated } = await res.json()
      // Optimistically update the selected snippet in parent
      // The parent's SWR mutate will be called via onShare callback
      if (newValue) {
        toast.success('Snippet is now public')
      } else {
        toast.success('Snippet is now private')
      }
      onShareToggle?.(updated)
    } else {
      toast.error('Failed to update sharing')
    }
  }

  const shareUrl = snippet?.share_slug
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/s/${snippet.share_slug}`
    : null

  const handleCopyLink = async () => {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    toast.success('Link copied!')
  }
```

- [x] **Step 10.2: Add `onShareToggle` to `SnippetDetailPanelProps`**

```typescript
interface SnippetDetailPanelProps {
  snippet: SnippetWithTags | null
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
  onShareToggle?: (updated: SnippetWithTags) => void
}
```

Update the function signature to include it:

```typescript
export function SnippetDetailPanel({
  snippet,
  onClose,
  onEdit,
  onDelete,
  onShareToggle,
}: SnippetDetailPanelProps) {
```

- [x] **Step 10.3: Add the share UI section below the action buttons in the SheetHeader (after the `updated` timestamp row)**

```typescript
                {/* Share row */}
                <div className="flex items-center justify-between pt-1 mt-1 border-t border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {snippet.is_public ? 'Public link active' : 'Private'}
                    </span>
                    <button
                      onClick={handleToggleShare}
                      className={[
                        'relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200',
                        snippet.is_public ? 'bg-primary' : 'bg-muted',
                      ].join(' ')}
                      role="switch"
                      aria-checked={snippet.is_public}
                    >
                      <span
                        className={[
                          'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg transition-transform duration-200',
                          snippet.is_public ? 'translate-x-4' : 'translate-x-0',
                        ].join(' ')}
                      />
                    </button>
                  </div>
                  {snippet.is_public && shareUrl && (
                    <button
                      onClick={handleCopyLink}
                      className="text-xs text-primary hover:underline"
                    >
                      Copy link
                    </button>
                  )}
                </div>
```

- [x] **Step 10.4: Wire `onShareToggle` in `app/dashboard/page.tsx`**

In `SnippetDetailPanel` JSX in the dashboard, add:

```typescript
      <SnippetDetailPanel
        snippet={selectedSnippet}
        onClose={() => setSelectedSnippet(null)}
        onEdit={() => selectedSnippet && handleEditSnippet(selectedSnippet)}
        onDelete={() => selectedSnippet && handleDeleteSnippet(selectedSnippet.id)}
        onShareToggle={(updated) => {
          setSelectedSnippet(updated as SnippetWithTags)
          mutate()
        }}
      />
```

- [x] **Step 10.5: Commit**

```bash
git add components/snippet-detail-panel.tsx app/dashboard/page.tsx
git commit -m "feat(share): share toggle + copy link in detail panel"
```

---

### Task 11: Public page /s/[slug]

**Files:**
- Create: `app/s/[slug]/page.tsx`

- [x] **Step 11.1: Create `app/s/[slug]/page.tsx`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Highlight, themes } from 'prism-react-renderer'
import { Code2 } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('snippets')
    .select('title, description, language')
    .eq('share_slug', slug)
    .eq('is_public', true)
    .single()

  if (!data) return { title: 'Snippet not found' }
  return {
    title: `${data.title} — SnippetVault`,
    description: data.description ?? `A ${data.language} snippet shared from SnippetVault`,
  }
}

const languageMap: Record<string, string> = {
  javascript: 'javascript', typescript: 'typescript', python: 'python',
  rust: 'rust', go: 'go', css: 'css', html: 'markup', sql: 'sql',
  bash: 'bash', java: 'java', cpp: 'cpp', c: 'c', csharp: 'csharp',
  ruby: 'ruby', php: 'php', swift: 'swift', kotlin: 'kotlin',
  json: 'json', yaml: 'yaml', markdown: 'markdown', text: 'markup',
}

export default async function PublicSnippetPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: snippet } = await supabase
    .from('snippets')
    .select('id, title, description, language, current_content, created_at, updated_at')
    .eq('share_slug', slug)
    .eq('is_public', true)
    .single()

  if (!snippet) notFound()

  const prismLang = languageMap[snippet.language] || 'markup'

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-300 flex flex-col">
      {/* Nav */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white font-semibold text-sm hover:opacity-80 transition-opacity">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/20 text-primary">
            <Code2 className="h-4 w-4" />
          </div>
          SnippetVault
        </Link>
        <Link
          href="/auth/sign-up"
          className="text-xs px-3 py-1.5 rounded-md bg-primary text-white font-medium hover:opacity-90 transition-opacity"
        >
          Save your own snippets →
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white mb-2">{snippet.title}</h1>
          {snippet.description && (
            <p className="text-slate-400 text-sm">{snippet.description}</p>
          )}
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-slate-300">
              {snippet.language}
            </span>
            <span className="text-xs text-slate-500">
              Shared via SnippetVault
            </span>
          </div>
        </div>

        {/* Code block */}
        <div className="rounded-xl border border-white/10 overflow-hidden bg-[#0d1117]">
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
            <span className="ml-3 text-xs text-slate-500 font-mono">{snippet.title}.{snippet.language === 'typescript' ? 'ts' : snippet.language === 'javascript' ? 'js' : snippet.language}</span>
          </div>

          <Highlight theme={themes.nightOwl} code={snippet.current_content} language={prismLang}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className={`${className} p-6 text-sm font-mono overflow-x-auto`}
                style={{ ...style, background: 'transparent', margin: 0 }}
              >
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })} className="flex">
                    <span className="select-none pr-6 text-slate-600 text-right min-w-[2.5rem]">
                      {i + 1}
                    </span>
                    <span>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </span>
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>
      </main>

      <footer className="border-t border-white/10 px-6 py-4 text-center">
        <p className="text-xs text-slate-600">
          Shared with{' '}
          <Link href="/" className="text-slate-500 hover:text-slate-400">
            SnippetVault
          </Link>
        </p>
      </footer>
    </div>
  )
}
```

- [x] **Step 11.2: Commit**

```bash
git add app/s/
git commit -m "feat(share): public /s/[slug] page with syntax-highlighted code"
```

---

## Feature 4 — Export as Code Image

**What it does:** An "Export Image" button in the detail panel opens a modal showing a carbon.now.sh-style preview of the snippet. Clicking Download saves a PNG.

**Files touched:**
- Install: `html-to-image` package
- Create: `components/export-image-modal.tsx`
- Modify: `components/snippet-detail-panel.tsx` — add Export Image button

---

### Task 12: Install html-to-image

- [x] **Step 12.1: Install the package**

```bash
npm install html-to-image
```

Expected output: `added 1 package`

- [x] **Step 12.2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install html-to-image for code export"
```

---

### Task 13: Create export-image-modal component

**Files:**
- Create: `components/export-image-modal.tsx`

- [x] **Step 13.1: Create `components/export-image-modal.tsx`**

```typescript
'use client'

import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Highlight, themes } from 'prism-react-renderer'
import { Download, Loader2 } from 'lucide-react'
import { SnippetWithTags, Language } from '@/lib/types'

const languageMap: Record<string, string> = {
  javascript: 'javascript', typescript: 'typescript', python: 'python',
  rust: 'rust', go: 'go', css: 'css', html: 'markup', sql: 'sql',
  bash: 'bash', java: 'java', cpp: 'cpp', c: 'c', csharp: 'csharp',
  ruby: 'ruby', php: 'php', swift: 'swift', kotlin: 'kotlin',
  json: 'json', yaml: 'yaml', markdown: 'markdown', text: 'markup',
}

const BG_PRESETS = [
  { label: 'Midnight', value: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' },
  { label: 'Ocean', value: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)' },
  { label: 'Ember', value: 'linear-gradient(135deg, #200122, #6f0000)' },
  { label: 'Forest', value: 'linear-gradient(135deg, #0a3d0a, #1a6b3c)' },
  { label: 'Slate', value: 'linear-gradient(135deg, #1c1c2e, #2e2e4e)' },
]

interface ExportImageModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  snippet: SnippetWithTags
}

export function ExportImageModal({ open, onOpenChange, snippet }: ExportImageModalProps) {
  const codeRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [bgIndex, setBgIndex] = useState(0)

  const prismLang = languageMap[snippet.language] || 'markup'
  const bg = BG_PRESETS[bgIndex].value

  const handleDownload = async () => {
    if (!codeRef.current) return
    setDownloading(true)
    try {
      const dataUrl = await toPng(codeRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: undefined,
      })
      const link = document.createElement('a')
      link.download = `${snippet.title.replace(/\s+/g, '-').toLowerCase()}.png`
      link.href = dataUrl
      link.click()
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Export as Image</DialogTitle>
        </DialogHeader>

        {/* Background picker */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-muted-foreground">Background:</span>
          {BG_PRESETS.map((preset, i) => (
            <button
              key={preset.label}
              onClick={() => setBgIndex(i)}
              title={preset.label}
              className={[
                'h-6 w-6 rounded-full transition-all',
                i === bgIndex ? 'ring-2 ring-primary ring-offset-2 ring-offset-card' : '',
              ].join(' ')}
              style={{ background: preset.value }}
            />
          ))}
        </div>

        {/* Preview (this div is what gets exported) */}
        <div
          ref={codeRef}
          className="rounded-2xl p-8"
          style={{ background: bg }}
        >
          {/* Window chrome */}
          <div className="rounded-xl overflow-hidden shadow-2xl bg-[#0d1117]">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
              <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <div className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-xs text-slate-500 font-mono select-none">
                {snippet.title}
              </span>
              <span className="ml-auto text-xs text-slate-600 font-mono select-none">
                {snippet.language}
              </span>
            </div>
            <div className="overflow-x-auto">
              <Highlight theme={themes.nightOwl} code={snippet.current_content} language={prismLang}>
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre
                    className={`${className} p-5 text-sm font-mono`}
                    style={{ ...style, background: 'transparent', margin: 0 }}
                  >
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })} className="flex">
                        <span className="select-none pr-5 text-slate-600 text-right min-w-[2rem]">
                          {i + 1}
                        </span>
                        <span>
                          {line.map((token, key) => (
                            <span key={key} {...getTokenProps({ token })} />
                          ))}
                        </span>
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <Button
            onClick={handleDownload}
            disabled={downloading}
            className="gradient-bg hover:opacity-90 text-white"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {downloading ? 'Generating…' : 'Download PNG'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

---

### Task 14: Add Export Image button to detail panel

**Files:**
- Modify: `components/snippet-detail-panel.tsx`

- [x] **Step 14.1: Import `ExportImageModal` and `ImageDown` in `snippet-detail-panel.tsx`**

Add to imports:
```typescript
import { ExportImageModal } from './export-image-modal'
import { Copy, Edit, Trash2, Check, Clock, X, ImageDown } from 'lucide-react'
```

- [x] **Step 14.2: Add `showExport` state after the existing state declarations**

```typescript
  const [showExport, setShowExport] = useState(false)
```

- [x] **Step 14.3: Add the Export button to the action row (after the Edit button)**

```typescript
                  <Button onClick={() => setShowExport(true)} variant="outline" size="sm" className="hover:border-primary/50 transition-colors">
                    <ImageDown className="h-4 w-4 mr-2" />
                    Export
                  </Button>
```

- [x] **Step 14.4: Render `<ExportImageModal />` inside the `<>` fragment, after the `<AlertDialog>`**

```typescript
      {snippet && (
        <ExportImageModal
          open={showExport}
          onOpenChange={setShowExport}
          snippet={snippet}
        />
      )}
```

- [x] **Step 14.5: Commit**

```bash
git add components/export-image-modal.tsx components/snippet-detail-panel.tsx package.json package-lock.json
git commit -m "feat(export): carbon-style code image export with background presets"
```

---

## Feature 5 — Collections / Folders

**What it does:** Users can create named, color-coded collections (folders). Snippets can belong to one collection. The sidebar shows all collections with color badges. Clicking a collection filters the grid.

**Files touched:**
- Supabase SQL (manual migration)
- Modify: `lib/types.ts` — add `Collection`, update `Snippet` and `SnippetWithTags`
- Create: `app/api/collections/route.ts` — GET + POST
- Create: `app/api/collections/[id]/route.ts` — PUT + DELETE
- Modify: `app/api/snippets/route.ts` — join collections, filter by collection_id
- Modify: `app/api/snippets/[id]/route.ts` — accept collection_id in PUT
- Modify: `components/snippet-dialog.tsx` — collection picker
- Modify: `components/dashboard-sidebar.tsx` — collections section
- Modify: `app/dashboard/page.tsx` — fetch collections, filter state, pass to dialog

---

### Task 15: DB migration for collections

- [x] **Step 15.1: Run in Supabase SQL Editor**

```sql
CREATE TABLE collections (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  color text NOT NULL DEFAULT '#f97316',
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE snippets
  ADD COLUMN collection_id uuid REFERENCES collections(id) ON DELETE SET NULL;

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own collections"
  ON collections FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

- [x] **Step 15.2: Verify**

```sql
SELECT table_name FROM information_schema.tables
WHERE table_name IN ('collections');
```

Expected: 1 row.

---

### Task 16: Update types

**Files:**
- Modify: `lib/types.ts`

- [x] **Step 16.1: Add `Collection` interface and `collection_id` to `Snippet`, and `collection` to `SnippetWithTags`**

```typescript
export interface Collection {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
}

export interface Snippet {
  id: string
  user_id: string
  title: string
  description: string | null
  language: string
  current_content: string
  is_pinned: boolean
  is_public: boolean
  share_slug: string | null
  collection_id: string | null
  created_at: string
  updated_at: string
}

export interface SnippetWithTags extends Snippet {
  tags: Tag[]
  collection: Collection | null
}
```

- [x] **Step 16.2: Commit**

```bash
git add lib/types.ts
git commit -m "feat(collections): add Collection type, collection_id to Snippet"
```

---

### Task 17: Collections API routes

**Files:**
- Create: `app/api/collections/route.ts`
- Create: `app/api/collections/[id]/route.ts`

- [x] **Step 17.1: Create `app/api/collections/route.ts`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const collectionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a hex color').optional().default('#f97316'),
})

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: collections, error } = await supabase
    .from('collections')
    .select('*')
    .eq('user_id', user.id)
    .order('name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ collections })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = collectionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 })
  }

  const { data: collection, error } = await supabase
    .from('collections')
    .insert({ user_id: user.id, name: parsed.data.name, color: parsed.data.color })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ collection })
}
```

- [x] **Step 17.2: Create `app/api/collections/[id]/route.ts`**

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const updateSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 })
  }

  const { data: collection, error } = await supabase
    .from('collections')
    .update(parsed.data)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ collection })
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
```

- [x] **Step 17.3: Commit**

```bash
git add app/api/collections/
git commit -m "feat(collections): GET/POST /api/collections and PUT/DELETE /api/collections/[id]"
```

---

### Task 18: Update snippets API to include collection data

**Files:**
- Modify: `app/api/snippets/route.ts`
- Modify: `app/api/snippets/[id]/route.ts`

- [x] **Step 18.1: Update the SELECT query in `app/api/snippets/route.ts` to join collection**

Change the `.select(...)` line to:

```typescript
    .select('*, snippet_tags(tags(id, name)), collections(id, name, color, user_id, created_at)')
```

Update the result mapping to include `collection`:

```typescript
  let result = (snippets ?? []).map((s: any) => ({
    ...s,
    tags: (s.snippet_tags ?? []).map((st: any) => st.tags).filter(Boolean),
    collection: s.collections ?? null,
    snippet_tags: undefined,
    collections: undefined,
  }))
```

- [x] **Step 18.2: Add `collection_id` to the `snippetSchema` in `app/api/snippets/[id]/route.ts`**

In the existing `snippetSchema` at the top of the file:

```typescript
const snippetSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  language: z.string().min(1, 'Language is required'),
  content: z.string().min(1, 'Content is required'),
  description: z.string().optional(),
  commitMessage: z.string().optional(),
  tagIds: z.array(z.string().uuid()).optional().default([]),
  collectionId: z.string().uuid().nullable().optional(),
})
```

In the `PUT` handler, add `collectionId` to destructuring and the update query:

```typescript
  const { title, description, language, content, commitMessage, tagIds, collectionId } = parsed.data

  const { data: snippet, error } = await supabase
    .from('snippets')
    .update({
      title,
      description: description || null,
      language,
      current_content: content,
      collection_id: collectionId !== undefined ? collectionId : undefined,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()
```

- [x] **Step 18.3: Also update `app/api/snippets/route.ts` POST to accept `collectionId`**

In the existing `snippetSchema` in `route.ts`:

```typescript
const snippetSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  language: z.string().min(1, 'Language is required'),
  content: z.string().min(1, 'Content is required'),
  description: z.string().optional(),
  commitMessage: z.string().optional(),
  tagIds: z.array(z.string().uuid()).optional().default([]),
  collectionId: z.string().uuid().nullable().optional(),
})
```

In the POST handler's insert:

```typescript
  const { data: snippet, error } = await supabase
    .from('snippets')
    .insert({
      user_id: user.id,
      title,
      description: description || null,
      language,
      current_content: content,
      collection_id: collectionId ?? null,
    })
    .select()
    .single()
```

- [x] **Step 18.4: Commit**

```bash
git add app/api/snippets/route.ts app/api/snippets/[id]/route.ts
git commit -m "feat(collections): join collection in snippets GET, accept collectionId in PUT/POST"
```

---

### Task 19: Snippet dialog — collection picker

**Files:**
- Modify: `components/snippet-dialog.tsx`

- [x] **Step 19.1: Add `Collection` import and `collections` prop to `SnippetDialogProps`**

```typescript
import { SnippetWithTags, Language, SUPPORTED_LANGUAGES, Tag, Collection } from '@/lib/types'

interface SnippetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  snippet?: SnippetWithTags | null
  onSave: (data: {
    title: string
    description: string
    language: Language
    content: string
    commitMessage: string
    tagIds: string[]
    collectionId: string | null
  }) => Promise<void>
  availableTags: Tag[]
  availableCollections: Collection[]
}
```

- [x] **Step 19.2: Add `collectionId` state and reset logic inside `SnippetDialog`**

After `const [isLoading, setIsLoading] = useState(false)`:
```typescript
  const [collectionId, setCollectionId] = useState<string | null>(null)
```

Inside `useEffect`, add:
```typescript
      setCollectionId(snippet.collection_id ?? null)
```
And in the `else` branch:
```typescript
      setCollectionId(null)
```

- [x] **Step 19.3: Add `collectionId` to `handleSubmit`**

```typescript
      await onSave({
        title: title.trim(),
        description: description.trim(),
        language,
        content,
        commitMessage: commitMessage.trim() || (isEditing ? 'Updated snippet' : 'Initial version'),
        tagIds: selectedTagIds,
        collectionId,
      })
```

- [x] **Step 19.4: Add collection picker UI in the form (after the tags section)**

```typescript
          {availableCollections.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label>Collection</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCollectionId(null)}
                  className={collectionId === null ? 'gradient-bg text-white border-transparent hover:opacity-90' : 'bg-secondary border-border hover:border-primary/50'}
                >
                  None
                </Button>
                {availableCollections.map((col) => (
                  <Button
                    key={col.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCollectionId(col.id)}
                    className={collectionId === col.id ? 'text-white border-transparent hover:opacity-90' : 'bg-secondary border-border hover:border-primary/50'}
                    style={collectionId === col.id ? { backgroundColor: col.color } : {}}
                  >
                    <span
                      className="inline-block h-2 w-2 rounded-full mr-1.5"
                      style={{ backgroundColor: col.color }}
                    />
                    {col.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
```

- [x] **Step 19.5: Commit**

```bash
git add components/snippet-dialog.tsx
git commit -m "feat(collections): collection picker in snippet create/edit dialog"
```

---

### Task 20: Sidebar — collections section

**Files:**
- Modify: `components/dashboard-sidebar.tsx`

- [x] **Step 20.1: Add `Collection` import and new props to `DashboardSidebarProps`**

```typescript
import { Language, SUPPORTED_LANGUAGES, Collection } from '@/lib/types'

interface DashboardSidebarProps {
  selectedLanguage: Language | null
  onLanguageSelect: (language: Language | null) => void
  onNewSnippet: () => void
  collections: Collection[]
  selectedCollectionId: string | null
  onCollectionSelect: (id: string | null) => void
}
```

Update the function signature:
```typescript
export function DashboardSidebar({
  selectedLanguage,
  onLanguageSelect,
  onNewSnippet,
  collections,
  selectedCollectionId,
  onCollectionSelect,
}: DashboardSidebarProps) {
```

- [x] **Step 20.2: Add collections section inside the `{!isCollapsed && (...)}` block, after the Languages section**

```typescript
          {collections.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-muted">
                Collections
              </div>
              <div className="space-y-1">
                {collections.map((col) => (
                  <Button
                    key={col.id}
                    variant="ghost"
                    onClick={() => onCollectionSelect(col.id === selectedCollectionId ? null : col.id)}
                    className={cn(
                      'w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent font-normal',
                      selectedCollectionId === col.id && 'bg-primary/10 border-l-2 border-primary'
                    )}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full mr-2 shrink-0"
                      style={{ backgroundColor: col.color }}
                    />
                    <span className="truncate">{col.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
```

- [x] **Step 20.3: Commit**

```bash
git add components/dashboard-sidebar.tsx
git commit -m "feat(collections): collections section in sidebar with color badges"
```

---

### Task 21: Wire collections into dashboard page

**Files:**
- Modify: `app/dashboard/page.tsx`

- [x] **Step 21.1: Add collections SWR fetch and filter state**

After the existing `useSWR` for snippets, add:

```typescript
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null)

  const { data: collectionsData, mutate: mutateCollections } = useSWR<{ collections: Collection[] }>(
    '/api/collections',
    fetcher
  )
  const collections = collectionsData?.collections || []
```

Add `Collection` to the imports from `@/lib/types`.

- [x] **Step 21.2: Filter snippets by collection client-side**

After `const snippets = data?.snippets || []`, add:

```typescript
  const filteredSnippets = selectedCollectionId
    ? snippets.filter((s) => s.collection_id === selectedCollectionId)
    : snippets
```

Replace all uses of `snippets` in the JSX grid/count with `filteredSnippets`.

`snippetCount` becomes `filteredSnippets.length`.

The map becomes `{filteredSnippets.map(...)}`.

- [x] **Step 21.3: Update `handleSaveSnippet` to pass `collectionId`**

```typescript
  const handleSaveSnippet = useCallback(async (snippetData: {
    title: string
    description: string
    language: Language
    content: string
    commitMessage: string
    tagIds: string[]
    collectionId: string | null
  }) => {
```

The body JSON already spreads `snippetData`, but ensure `collectionId` is included:

```typescript
      body: JSON.stringify({
        title: snippetData.title,
        description: snippetData.description,
        language: snippetData.language,
        content: snippetData.content,
        commitMessage: snippetData.commitMessage,
        tagIds: snippetData.tagIds,
        collectionId: snippetData.collectionId,
      }),
```

- [x] **Step 21.4: Pass collections props to `DashboardSidebar` and `SnippetDialog`**

```typescript
      <DashboardSidebar
        selectedLanguage={selectedLanguage}
        onLanguageSelect={setSelectedLanguage}
        onNewSnippet={handleNewSnippet}
        collections={collections}
        selectedCollectionId={selectedCollectionId}
        onCollectionSelect={setSelectedCollectionId}
      />
```

```typescript
      <SnippetDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        snippet={editingSnippet}
        onSave={handleSaveSnippet}
        availableTags={tags}
        availableCollections={collections}
      />
```

- [x] **Step 21.5: Commit**

```bash
git add app/dashboard/page.tsx
git commit -m "feat(collections): wire collections fetch, filter, and picker into dashboard"
```

---

### Task 22: Final build check

- [x] **Step 22.1: Run build and confirm zero errors**

```bash
npm run build
```

Expected: `✓ Compiled successfully` with no TypeScript errors.

- [x] **Step 22.2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no output (zero errors).

- [x] **Step 22.3: Commit if any lint fixes were needed, then tag**

```bash
git commit -m "chore: phase 3 features complete — pin, cmd-k, share, export, collections"
```

---

## Execution Order Summary

| # | Feature | Tasks | DB Migration? | New Package? |
|---|---------|-------|---------------|--------------|
| 1 | Snippet Pinning | 1–5 | Yes (Task 1) | No |
| 2 | Command Palette | 6–7 | No | No |
| 3 | Public Sharing | 8–11 | Yes (Task 8) | No |
| 4 | Export as Code Image | 12–14 | No | Yes (`html-to-image`) |
| 5 | Collections | 15–22 | Yes (Task 15) | No |

Each feature is independently deployable. Finish and verify one before starting the next.
