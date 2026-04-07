# SnippetVault — UI Redesign Specification

**Version:** 1.0  
**Date:** April 7, 2026  
**Design Philosophy:** Apple-Inspired × AI-Native  
**Status:** Design Spec — Ready for Implementation

---

## Table of Contents

1. [Current UI Audit](#1-current-ui-audit)
2. [Design Vision](#2-design-vision)
3. [Design Principles](#3-design-principles)
4. [Color System](#4-color-system)
5. [Typography System](#5-typography-system)
6. [Spacing & Layout Grid](#6-spacing--layout-grid)
7. [Component Redesign](#7-component-redesign)
8. [Page-by-Page Redesign](#8-page-by-page-redesign)
9. [Animations & Micro-Interactions](#9-animations--micro-interactions)
10. [Glassmorphism & Effects](#10-glassmorphism--effects)
11. [AI Design Language](#11-ai-design-language)
12. [Responsive Design Strategy](#12-responsive-design-strategy)
13. [Design Tokens (CSS Variables)](#13-design-tokens-css-variables)
14. [Implementation Priority](#14-implementation-priority)

---

## 1. Current UI Audit

### What's Wrong with the Current Design

#### ❌ Pain Points

| Issue | Where | Impact |
|---|---|---|
| **Generic emerald green** | Buttons, accents, icons | Feels like a default template — no personality |
| **Flat, boxy cards** | Snippet grid | No depth, no visual hierarchy, looks amateurish |
| **No visual breathing room** | Overall layout | Elements feel cramped; insufficient whitespace |
| **Plain dark theme** | Background/cards | Dark gray on darker gray — monotonous, no gradient or texture |
| **No motion or life** | Everywhere | Static UI with no transitions, no hover polish, no delight |
| **Sidebar feels like a file explorer** | Left panel | No sophistication; just a flat list with icons |
| **No brand personality** | Header, landing page | Could be any CRUD app — nothing memorable |
| **Badge/tag design** | Snippet cards | Tiny, hard to read, no color coding |
| **Code preview area** | Card content | Fixed height, no smooth overflow, blunt overflow cut |
| **Copy button** | Card hover state | Appears abruptly, feels janky |

#### Current Color Palette (Problems)

```
Primary:     oklch(0.55 0.2 260) → A flat indigo-blue
Accent:      Same as primary → No accent differentiation
Emerald:     hardcoded bg-emerald-600 → Feels like default Tailwind
Background:  oklch(0.14 0.015 260) → Dull dark blue-gray
Card:        oklch(0.18 0.015 260) → Barely different from background
Border:      oklch(0.26 0.02 260) → Too visible, creates visual noise
```

**Verdict:** The current UI is functional but visually forgettable. It looks like a v0.dev boilerplate with no custom design work. For a class prototype showcase, this will **not** impress.

---

## 2. Design Vision

### The New SnippetVault: Apple × AI

We're reimagining SnippetVault with two design pillars:

#### Pillar 1: Apple Aesthetic
Apple's design language is defined by:
- **Generous whitespace** — content breathes
- **Subtle depth** — layered surfaces with soft shadows and blur
- **Refined typography** — SF Pro-inspired sizing and weight hierarchy
- **Restrained color** — neutral canvas with one bold accent
- **Fluid motion** — spring-based transitions, nothing is instant

#### Pillar 2: AI-Native Feel
Modern AI products (like ChatGPT, Cursor, v0) share a visual language:
- **Glowing accents** — purple/violet/cyan gradients that feel "intelligent"
- **Frosted glass panels** — glassmorphism with backdrop-blur
- **Subtle particle/gradient animations** — alive, not static
- **Gradient text for emphasis** — titles shimmer with multi-color gradients
- **Dark-first design** — dark mode is the primary, premium experience
- **Ambient glow effects** — soft colored halos behind key elements

### Mood Board Keywords

```
Premium • Intelligent • Minimal • Luminous • Fluid • Sophisticated
```

---

## 3. Design Principles

### P1: Depth Over Flatness
Every layer should communicate its z-position through subtle shadows, borders, and blur. Cards float above the background. Modals float above cards. Nothing is "flat on the page."

### P2: One Gradient, One Story
The primary gradient (violet → cyan) tells users: "this is an AI-powered tool." Use it sparingly — primary buttons, active states, the logo glow — never for decoration.

### P3: Content is King
Code snippets are the star. Give them generous space, beautiful syntax highlighting, and a premium code container with proper line numbers and rounded corners.

### P4: Motion = Polish
Every state change should be animated:
- Cards appear with a staggered fade-up
- Panels slide in with spring physics
- Buttons have hover scale and glow effects
- Copy confirmation has a satisfying checkmark animation

### P5: Whitespace is Luxury
Increase padding, margins, and gaps by 25-50% from the current design. Tight layouts feel cheap; spacious layouts feel premium.

---

## 4. Color System

### 4.1 Dark Mode (Primary — Default)

```css
/* 🌙 DARK THEME — The Premium Experience */

/* Canvas */
--background:         #0A0A0F;     /* Near-black with a hint of deep blue */
--background-subtle:  #0F0F18;     /* Slightly lighter for secondary areas */
--surface-1:          #14141F;     /* Cards, panels */
--surface-2:          #1A1A2E;     /* Elevated cards, popovers */
--surface-3:          #21213A;     /* Highest elevation — modals, dialogs */

/* Borders */
--border-subtle:      rgba(255, 255, 255, 0.06);   /* Barely visible dividers */
--border-default:     rgba(255, 255, 255, 0.10);   /* Card borders */
--border-strong:      rgba(255, 255, 255, 0.15);   /* Focused input borders */

/* Text */
--text-primary:       #F5F5F7;     /* Apple's signature gray-white */
--text-secondary:     #A1A1AA;     /* zinc-400 equivalent */
--text-tertiary:      #71717A;     /* zinc-500 — timestamps, hints */
--text-disabled:      #3F3F46;     /* zinc-700 — disabled states */

/* Primary Accent: AI Gradient (Violet → Cyan) */
--accent-violet:      #8B5CF6;     /* violet-500 */
--accent-purple:      #A855F7;     /* purple-500 */
--accent-cyan:        #06B6D4;     /* cyan-500 */
--accent-blue:        #3B82F6;     /* blue-500 */

/* Gradient definitions */
--gradient-primary:   linear-gradient(135deg, #8B5CF6, #06B6D4);
--gradient-hover:     linear-gradient(135deg, #7C3AED, #0891B2);
--gradient-text:      linear-gradient(135deg, #A78BFA, #67E8F9);
--gradient-glow:      linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.15));
--gradient-mesh:      radial-gradient(at 20% 80%, rgba(139,92,246,0.08) 0%, transparent 50%),
                      radial-gradient(at 80% 20%, rgba(6,182,212,0.08) 0%, transparent 50%);

/* Semantic Colors */
--success:            #22C55E;     /* green-500 */
--warning:            #F59E0B;     /* amber-500 */
--error:              #EF4444;     /* red-500 */
--info:               #3B82F6;     /* blue-500 */

/* Code Editor */
--code-bg:            #0D0D14;     /* Slightly darker than surface-1 */
--code-border:        rgba(255, 255, 255, 0.08);
--code-line-number:   #3F3F46;     /* zinc-700 */
--code-selection:     rgba(139, 92, 246, 0.2);     /* violet with low opacity */

/* Sidebar */
--sidebar-bg:         #0D0D14;
--sidebar-hover:      rgba(255, 255, 255, 0.04);
--sidebar-active:     rgba(139, 92, 246, 0.12);
--sidebar-divider:    rgba(255, 255, 255, 0.06);
```

### 4.2 Light Mode (Secondary)

```css
/* ☀️ LIGHT THEME — Clean & Crisp */

/* Canvas */
--background:         #FAFAFA;     /* Apple-warm white */
--background-subtle:  #F5F5F5;
--surface-1:          #FFFFFF;
--surface-2:          #FFFFFF;
--surface-3:          #FFFFFF;

/* Borders */
--border-subtle:      rgba(0, 0, 0, 0.05);
--border-default:     rgba(0, 0, 0, 0.08);
--border-strong:      rgba(0, 0, 0, 0.15);

/* Text */
--text-primary:       #1D1D1F;     /* Apple's dark text */
--text-secondary:     #6E6E73;     /* Apple's secondary text */
--text-tertiary:      #86868B;
--text-disabled:      #D1D1D6;

/* Accent: Deeper violet for legibility on white */
--accent-violet:      #7C3AED;     /* violet-600 */
--accent-purple:      #9333EA;     /* purple-600 */
--accent-cyan:        #0891B2;     /* cyan-600 */

/* Gradient (darker for contrast) */
--gradient-primary:   linear-gradient(135deg, #7C3AED, #0891B2);
--gradient-glow:      linear-gradient(135deg, rgba(124,58,237,0.08), rgba(8,145,178,0.08));

/* Code Editor */
--code-bg:            #F6F6F8;
--code-border:        rgba(0, 0, 0, 0.08);
--code-line-number:   #C7C7CC;
```

### 4.3 Language-Specific Colors

Each programming language gets a signature color for its badge, making the grid visually scannable:

```css
--lang-javascript:    #F7DF1E;  /* Yellow */
--lang-typescript:    #3178C6;  /* Blue */
--lang-python:        #3776AB;  /* Blue */
--lang-rust:          #DEA584;  /* Orange */
--lang-go:            #00ADD8;  /* Cyan */
--lang-html:          #E34F26;  /* Orange-red */
--lang-css:           #1572B6;  /* Blue */
--lang-java:          #ED8B00;  /* Orange */
--lang-cpp:           #00599C;  /* Blue */
--lang-ruby:          #CC342D;  /* Red */
--lang-swift:         #F05138;  /* Orange-red */
--lang-kotlin:        #7F52FF;  /* Purple */
--lang-sql:           #336791;  /* Blue-gray */
--lang-bash:          #4EAA25;  /* Green */
```

---

## 5. Typography System

### Font Stack

```css
/* Primary: SF Pro Display feel — using Inter (closest Google Font match) */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Code: JetBrains Mono (already in project — beautiful ligatures) */
--font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;
```

### Type Scale (Apple-Inspired)

```
Display:    48px / 1.1  / -0.03em / Bold     ← Landing page hero
Title 1:    28px / 1.2  / -0.02em / Semibold ← Page titles
Title 2:    22px / 1.3  / -0.02em / Semibold ← Section headers
Title 3:    18px / 1.4  / -0.01em / Medium   ← Card titles, dialog titles
Body:       16px / 1.5  / 0       / Regular  ← Default body text
Body Small: 14px / 1.5  / 0       / Regular  ← Descriptions, secondary text
Caption:    12px / 1.4  / 0       / Medium   ← Timestamps, badges, labels
Micro:      11px / 1.3  / 0.02em  / Medium   ← Tag pills, line numbers
```

### Weight Usage

```
Regular (400):  Body text, descriptions
Medium (500):   Labels, captions, code comments
Semibold (600): Titles, navigation items, button text
Bold (700):     Hero text, emphasis
```

---

## 6. Spacing & Layout Grid

### Spacing Scale (Base: 4px)

```
4px (1):   Micro gaps (icon to text inside a badge)
8px (2):   Tag gaps, badge padding
12px (3):  Between small elements
16px (4):  Card internal padding
20px (5):  Between cards in grid
24px (6):  Section padding
32px (8):  Between major sections
48px (12): Page section breaks
64px (16): Hero section vertical padding
```

### Layout Grid

```
Sidebar:              260px (expanded) / 72px (collapsed)
Main Content:         flex-1, max-width: 1440px
Content Padding:      32px (desktop) / 20px (mobile)
Card Grid:            repeat(auto-fill, minmax(340px, 1fr))
Card Gap:             20px
Detail Panel (Sheet): max-width: 700px
```

---

## 7. Component Redesign

### 7.1 Snippet Card (⭐ Most Critical)

**Current:** Flat card with cramped content, tiny badges, visible-on-hover copy button.

**New Design:**

```
┌─────────────────────────────────────────────────┐
│                                                   │
│  ┌─ Language Dot (●) + "TypeScript"              │
│  │                                    ⋮ (menu)   │
│  │                                                │
│  │  Merge Sort Implementation                    │
│  │  Classic divide-and-conquer sorting...        │
│  │                                                │
│  │  ┌───────────────────────────────────────┐    │
│  │  │  function mergeSort(arr: number[]) {  │    │
│  │  │    if (arr.length <= 1) return arr;    │    │
│  │  │    const mid = Math.floor(arr.len...  │    │
│  │  │    ...                                 │    │
│  │  │                          gradient fade │    │
│  │  └───────────────────────────────────────┘    │
│  │                                                │
│  │  ┌─────┐ ┌──────────┐ ┌──────┐               │
│  │  │sort │ │algorithm │ │utils │               │
│  │  └─────┘ └──────────┘ └──────┘               │
│  │                                                │
│  │  ⏰ 2h ago              📋 Copy    v3        │
│  └────────────────────────────────────────────── │
│                                                   │
└─────────────────────────────────────────────────┘
```

**New Card Properties:**
- Background: `var(--surface-1)` with 1px `var(--border-subtle)` border
- Border-radius: `16px` (Apple-rounded)
- Padding: `20px`
- Hover: Lift with `translateY(-2px)` + subtle glow shadow + border brightens
- Code preview: Fades out at the bottom with a gradient mask (no hard cutoff)
- Language indicator: Colored dot + text (language-specific color)
- Tags: Pill-shaped with individual colors (lowercase, rounded)
- Copy button: Always visible (subtle), not hover-only
- Transition: `all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`

### 7.2 Sidebar

**Current:** Flat dark panel, basic list.

**New Design:**
- Background: Frosted glass effect (`backdrop-filter: blur(20px)`)
- Logo: SnippetVault icon with a subtle violet glow behind it
- Active item: Left border accent (3px, gradient) + background highlight
- Hover: Smooth background shift with `rgba(255,255,255,0.04)`
- Language items: Include language-colored dots beside names
- Dividers: Use `var(--border-subtle)` (nearly invisible)
- Collapse animation: Smooth width transition with `cubic-bezier`

### 7.3 Search Bar

**Current:** Plain input with a search icon.

**New Design:**
- Full-width with rounded corners (`border-radius: 12px`)
- Frosted glass background (`backdrop-filter: blur(12px)`)
- Focus: Gradient border ring (violet → cyan) with outer glow
- Placeholder: "Search snippets..." with typing cursor animation
- Keyboard shortcut hint: `⌘K` or `Ctrl+K` badge on the right side
- Results: Inline dropdown with fuzzy-matched highlights

### 7.4 Primary Button (CTA)

**Current:** `bg-emerald-600` — flat, generic.

**New Design:**
- Gradient background: `var(--gradient-primary)` (violet → cyan)
- Border-radius: `12px`
- Hover: Slightly brighter gradient + subtle scale (`1.02`) + glow shadow
- Active: Scale down slightly (`0.98`)
- Text: White, semibold
- Icon: Left-aligned with 8px gap

### 7.5 Snippet Detail Panel (Sheet)

**Current:** Plain right-side sheet with basic tabs.

**New Design:**
- Width: `700px` max
- Background: `var(--surface-2)` with subtle backdrop blur
- Slide-in animation: Spring-based ease (`cubic-bezier(0.32, 0.72, 0, 1)`)
- Overlay: Dark scrim with blur (`backdrop-filter: blur(4px)`)
- Tabs: Pill-style with animated indicator that slides between tabs
- Code viewer: Full-featured with line numbers, copy button, and language badge
- Version history: Timeline-style with connecting line and commit dots

### 7.6 Snippet Dialog (Create/Edit)

**Current:** Basic dialog with form fields.

**New Design:**
- Center-modal with frosted glass background
- Smooth scale-up entrance animation
- Form fields: Large, spacious inputs with floating labels
- Code editor area: Resizable with drag handle, minimum 300px height
- Tag selector: Pill-style multi-select with inline creation ("+ New tag")
- Language dropdown: Visual dropdown with language colors and icons
- Save button: Full-width gradient CTA at the bottom
- Validation: Inline errors with smooth shake animation

### 7.7 Diff Viewer

**Current:** Basic colored lines.

**New Design:**
- Two-panel layout with synchronized scrolling
- Version labels in pill badges above each panel: "v1" ↔ "v3"
- Added lines: Soft green background with left green border
- Removed lines: Soft red background with left red border
- Unchanged lines: Dimmed text (`var(--text-tertiary)`)
- Line numbers: Styled in `var(--code-line-number)`
- Collapse unchanged regions: "... 15 unchanged lines ..." button

### 7.8 Tag Badges

**Current:** Tiny outline badges, hard to read.

**New Design:**
- Pill-shaped: `border-radius: 999px`
- Padding: `4px 12px`
- Font: `Caption` size (12px), medium weight
- Background: Semi-transparent color (each tag gets a generated hue)
- Hover: Brightness increases slightly
- Language badge: Uses the language-specific color as background with white text

---

## 8. Page-by-Page Redesign

### 8.1 Landing Page (`/`)

**Current:** Generic hero with emerald CTA buttons.

**New Design Concept:**

```
┌───────────────────────────────────────────────────────────────┐
│  HEADER (frosted glass, sticky)                                │
│  ┌─ ● SnippetVault ──────────  Login  │ Get Started (CTA) │  │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                 HERO SECTION                                    │
│                                                                  │
│  Background: Mesh gradient (violet/cyan/dark) with subtle       │
│  animated noise texture                                          │
│                                                                  │
│              ┌─────────────────────────────────┐                │
│              │  ⚡ AI-powered snippet manager   │  (pill badge)  │
│              └─────────────────────────────────┘                │
│                                                                  │
│           Save, organize & evolve                                │
│           your code snippets                                     │
│           ← gradient text (violet → cyan)                        │
│                                                                  │
│     Never lose track of your code. Git-like version             │
│     history, semantic search, and smart tagging.                │
│                                                                  │
│     ┌──────────────────┐  ┌──────────────┐                     │
│     │  Start for free  │  │  See demo →  │                     │
│     │  (gradient CTA)  │  │  (outline)   │                     │
│     └──────────────────┘  └──────────────┘                     │
│                                                                  │
│     ┌─────────────────────────────────────┐                     │
│     │  ✦ INTERACTIVE DEMO PREVIEW ✦       │                     │
│     │                                      │                     │
│     │  (screenshot or live embed of the   │                     │
│     │   dashboard with sample data)       │                     │
│     │                                      │                     │
│     │   Floats with subtle shadow,        │                     │
│     │   tilted slightly in 3D             │                     │
│     │   (CSS perspective transform)       │                     │
│     │                                      │                     │
│     └─────────────────────────────────────┘                     │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                 FEATURES SECTION                                │
│                                                                  │
│  6 feature cards in a 3×2 grid, each with:                      │
│  • Gradient icon background (individual colors)                 │
│  • Bold title                                                  │
│  • 2-line description                                          │
│  • Hover: lift + glow                                          │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                 STATS SECTION (new)                              │
│                                                                  │
│   25+ Languages   │   Git-like History   │   <500ms Search    │
│   supported        │   for every edit     │   response time    │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                 CTA SECTION                                      │
│                                                                  │
│  Background: subtle gradient mesh                                │
│                                                                  │
│           Ready to organize your code?                          │
│     ┌─────────────────────────────────────┐                     │
│     │       Get started for free →        │                     │
│     └─────────────────────────────────────┘                     │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│  FOOTER                                                         │
│  ● SnippetVault  │  Built for developers, by developers.      │
└───────────────────────────────────────────────────────────────┘
```

### 8.2 Dashboard (`/dashboard`)

**Key Changes:**
- Background: `var(--background)` with `var(--gradient-mesh)` ambient glow
- Card grid: `minmax(340px, 1fr)` with `20px` gap
- Loading state: Skeleton cards (not a spinner) with shimmer animation
- Empty state: Illustration + "Create your first snippet" CTA with purple glow
- Header: "My Snippets" with count badge, gradient "New Snippet" button
- Staggered card entrance animation (each card fades in 50ms after the previous)

### 8.3 Auth Pages (`/auth/login`, `/auth/sign-up`)

**New Design:**
- Centered card on a mesh gradient background
- Card: Frosted glass with `backdrop-filter: blur(20px)`
- Logo at the top with violet glow
- Inputs: Large, spacious, with floating labels
- CTA button: Full-width gradient
- Switch text: "Already have an account? Sign in" (linked)
- Subtle animated gradient orbs in the background (CSS only)

---

## 9. Animations & Micro-Interactions

### 9.1 Core Transitions

```css
/* Default transition for interactive elements */
--transition-default: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

/* Spring-like transition for modals, panels */
--transition-spring: all 0.4s cubic-bezier(0.32, 0.72, 0, 1);

/* Smooth fade */
--transition-fade: opacity 0.15s ease;

/* Scale bounce for buttons */
--transition-bounce: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
```

### 9.2 Specific Animations

| Element | Trigger | Animation |
|---|---|---|
| **Snippet cards** | Page load | Staggered fade-up (opacity 0→1, translateY 16px→0, each 50ms delay) |
| **Card** | Hover | `translateY(-2px)` + box-shadow glow + border brighten |
| **Card** | Click | Scale down to `0.98` then release |
| **Copy button** | Click | Icon morphs from clipboard → checkmark (300ms) |
| **Search input** | Focus | Border gradient appears with 200ms fade |
| **Detail panel** | Open | Slide from right with spring easing + overlay fade |
| **Create dialog** | Open | Scale from `0.95` → `1.0` + fade |
| **Tab indicator** | Switch | Slide horizontally with spring easing |
| **Sidebar** | Collapse/Expand | Width transition 300ms with content fade |
| **Toast** | Appear | Slide up from bottom + fade |
| **Delete dialog** | Open | Scale + slight blur on background |
| **Language filter chips** | Click | Subtle pulse with color fill |
| **Gradient mesh BG** | Ambient | Very slow (20s) shifting gradient positions |

### 9.3 CSS Keyframes

```css
/* Staggered card entrance */
@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Shimmer for loading skeletons */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Subtle glow pulse */
@keyframes glow-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* Background gradient shift */
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

---

## 10. Glassmorphism & Effects

### 10.1 Frosted Glass Card

```css
.glass-card {
  background: rgba(20, 20, 31, 0.6);       /* surface-1 with alpha */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}
```

### 10.2 Glow Shadow

```css
.glow-shadow {
  box-shadow:
    0 0 0 1px rgba(139, 92, 246, 0.1),      /* inner ring */
    0 4px 24px rgba(139, 92, 246, 0.08),     /* outer glow */
    0 1px 3px rgba(0, 0, 0, 0.3);            /* baseline shadow */
}
```

### 10.3 Gradient Text

```css
.gradient-text {
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### 10.4 Mesh Gradient Background

```css
.mesh-bg {
  background:
    radial-gradient(at 20% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
    radial-gradient(at 80% 20%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
    radial-gradient(at 50% 50%, rgba(168, 85, 247, 0.04) 0%, transparent 50%),
    var(--background);
}
```

### 10.5 Input Focus Glow

```css
input:focus {
  border-color: transparent;
  box-shadow:
    0 0 0 2px var(--accent-violet),
    0 0 0 4px rgba(139, 92, 246, 0.2);
  outline: none;
}
```

---

## 11. AI Design Language

### What Makes a UI Feel "AI"?

#### 11.1 Gradient Accents
The violet → cyan gradient is the universal "AI color." It's used by:
- ChatGPT (green → blue), Copilot (blue → purple), Cursor (purple → blue)
- We use: **Violet (#8B5CF6) → Cyan (#06B6D4)**

#### 11.2 Intelligent Micro-Copy
Replace generic labels with smarter language:

| Before | After |
|---|---|
| "Search snippets..." | "Search your code library..." |
| "New Snippet" | "+ New Snippet" |
| "Save" | "Save & Version" |
| "Delete" | "Delete Permanently" |
| "No snippets found" | "No matches found. Try a different search." |
| "No snippets yet" | "Your code library is empty. Save your first snippet to get started." |
| "Version 1" | "v1 · Initial version" |

#### 11.3 Smart Empty States
Instead of just text, show:
- An illustrated icon (code brackets with sparkles)
- A clear CTA button with gradient styling
- A subtle suggestion: "Tip: Use tags to organize snippets by project or topic"

#### 11.4 AI Feature Indicators
For future AI features, use these visual markers:
- ✨ Sparkle icon preceding AI-generated content
- Purple/violet tint for AI suggestions
- "AI" badge on auto-tagged items
- Pulsing dot indicator when AI is "thinking"

---

## 12. Responsive Design Strategy

### Breakpoints

```css
/* Mobile First */
sm:     640px    /* Small tablets */
md:     768px    /* Tablets */
lg:     1024px   /* Small laptops */
xl:     1280px   /* Standard laptops */
2xl:    1536px   /* Large screens */
```

### Layout Adaptations

| Breakpoint | Sidebar | Grid Columns | Detail Panel | Search |
|---|---|---|---|---|
| < 768px | Hidden (hamburger menu) | 1 column | Full-screen sheet | Below header |
| 768–1024px | Collapsed (icons only) | 2 columns | Overlay sheet | Full width |
| 1024–1280px | Expanded (260px) | 2 columns | Side sheet (600px) | Max 500px |
| > 1280px | Expanded (260px) | 3 columns | Side sheet (700px) | Max 600px |

---

## 13. Design Tokens (CSS Variables)

### Complete Token File (for globals.css)

Below is the ready-to-implement token set. This replaces the current `:root` and `.dark` blocks:

```css
:root {
  /* Color scheme: light */
  --background: #FAFAFA;
  --background-subtle: #F5F5F5;
  --surface-1: #FFFFFF;
  --surface-2: #FFFFFF;
  --surface-3: #FFFFFF;

  --text-primary: #1D1D1F;
  --text-secondary: #6E6E73;
  --text-tertiary: #86868B;

  --border-subtle: rgba(0, 0, 0, 0.05);
  --border-default: rgba(0, 0, 0, 0.08);
  --border-strong: rgba(0, 0, 0, 0.15);

  --accent-violet: #7C3AED;
  --accent-cyan: #0891B2;

  --gradient-primary: linear-gradient(135deg, #7C3AED, #0891B2);
  --gradient-glow: linear-gradient(135deg, rgba(124,58,237,0.08), rgba(8,145,178,0.08));

  --code-bg: #F6F6F8;
  --code-border: rgba(0, 0, 0, 0.08);

  --success: #16A34A;
  --error: #DC2626;
  --warning: #D97706;

  --radius: 12px;
  --radius-sm: 8px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 999px;
}

.dark {
  --background: #0A0A0F;
  --background-subtle: #0F0F18;
  --surface-1: #14141F;
  --surface-2: #1A1A2E;
  --surface-3: #21213A;

  --text-primary: #F5F5F7;
  --text-secondary: #A1A1AA;
  --text-tertiary: #71717A;

  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-default: rgba(255, 255, 255, 0.10);
  --border-strong: rgba(255, 255, 255, 0.15);

  --accent-violet: #8B5CF6;
  --accent-cyan: #06B6D4;

  --gradient-primary: linear-gradient(135deg, #8B5CF6, #06B6D4);
  --gradient-glow: linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.15));

  --code-bg: #0D0D14;
  --code-border: rgba(255, 255, 255, 0.08);

  --success: #22C55E;
  --error: #EF4444;
  --warning: #F59E0B;
}
```

---

## 14. Implementation Priority

### Phase 1: Foundation (Core Design Tokens) — Do First
1. ✏️ Update `globals.css` with new color tokens and variables
2. ✏️ Update border-radius values across all components
3. ✏️ Add gradient utility classes (`.gradient-text`, `.glass-card`, `.glow-shadow`)
4. ✏️ Update font weight hierarchy

### Phase 2: Key Components — High Impact
5. ✏️ Redesign **snippet card** (rounded corners, glow hover, gradient fade on code preview, language colors)
6. ✏️ Redesign **primary buttons** (gradient, hover scale + glow)
7. ✏️ Redesign **search bar** (rounded, frosted, focus glow)
8. ✏️ Redesign **sidebar** (glassmorphism, gradient active indicator, language dots)

### Phase 3: Pages — Visual Wow
9. ✏️ Redesign **landing page** (gradient hero, mesh background, 3D preview tilt)
10. ✏️ Redesign **auth pages** (centered frosted card, background orbs)
11. ✏️ Add **mesh gradient background** to dashboard

### Phase 4: Polish — Delight
12. ✏️ Add **staggered card entrance animation**
13. ✏️ Add **skeleton loading states** (shimmer effect)
14. ✏️ Add **sliding tab indicator**
15. ✏️ Add **spring-based panel/dialog transitions**
16. ✏️ Update **empty states** with illustrations and smarter copy

---

*Document End — SnippetVault UI Redesign Spec v1.0*
