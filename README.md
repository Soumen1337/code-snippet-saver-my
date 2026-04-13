# SnippetVault

A full-stack developer tool for saving, organizing, and versioning code snippets. Track edits through automatic version history with side-by-side diff viewing. Built as a production-ready prototype with 100% free-tier infrastructure.

## Features

- Sign up and authentication with Supabase Auth
- Create and save code snippets in 20+ programming languages
- Tag and organize snippets for easy discovery
- Full-text search with debounced filtering
- Automatic version history tracking with commit messages
- Side-by-side diff viewer to compare snippet versions
- Export snippets to image (PNG)
- Dark and light theme support
- Responsive design for desktop and mobile
- Role-based access control with Row-Level Security (RLS)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **Database:** Supabase (PostgreSQL with RLS)
- **Authentication:** Supabase Auth with @supabase/ssr
- **Data Fetching:** SWR (stale-while-revalidate)
- **Code Highlighting:** prism-react-renderer (Night Owl theme)
- **Diff Computation:** diff library (diffLines)
- **Fonts:** Inter (body), JetBrains Mono (code)
- **Notifications:** sonner (toast notifications)
- **Hosting:** Vercel (Hobby plan - free)
- **Validation:** Zod (input validation)

## Project Status

- **Phase 1 (Complete):** Full prototype with auth, snippets, versioning, and diff viewer
- **Phase 2 (In Progress):** Backend improvements and Apple + AI-native UI redesign
  - Backend: Zod validation, RLS verification, query optimization, toast notifications
  - UI: Color system refresh, glassmorphism design, redesigned components

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier available)
- Vercel account for deployment (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/snippetvault.git
cd snippetvault
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables. Create `.env.local` in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Get these values from your Supabase project: Dashboard > Settings > API

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build and Deployment

Build check before deployment:
```bash
npm run build
```

Lint check:
```bash
npm run lint
```

The project auto-deploys to Vercel when pushed to the main branch on GitHub.

## Project Structure

```
/
├── CLAUDE.md                 # Project instructions and conventions
├── middleware.ts             # Route protection and session refresh
├── app/
│   ├── layout.tsx           # Root layout with fonts and theme
│   ├── page.tsx             # Landing page
│   ├── globals.css          # Design tokens and Tailwind config
│   ├── auth/                # Login, sign-up, and auth error pages
│   ├── dashboard/           # Main application page
│   ├── api/                 # API routes for snippets and tags
│   └── s/[slug]/            # Public snippet sharing page
├── components/
│   ├── ui/                  # 50+ shadcn/ui primitive components
│   ├── code-editor.tsx      # Syntax-highlighted code editor
│   ├── snippet-card.tsx     # Snippet list card component
│   ├── snippet-detail-panel.tsx # Detail view panel
│   ├── diff-viewer.tsx      # Side-by-side diff viewer
│   ├── version-history.tsx  # Version history UI
│   └── ... (other components)
├── hooks/
│   ├── use-debounce.ts     # 300ms debounce hook for search
│   └── use-mobile.ts       # Mobile detection hook
├── lib/
│   ├── types.ts            # Shared TypeScript interfaces
│   ├── utils.ts            # Utility functions (cn helper)
│   └── supabase/
│       ├── client.ts       # Browser-side Supabase client
│       ├── server.ts       # Server-side Supabase client
│       └── middleware.ts   # Middleware Supabase client
├── docs/
│   ├── IMPLEMENTATION_PLAN.md # Step-by-step build plan (primary reference)
│   ├── PRD.md              # Product requirements document
│   ├── BACKEND_PLAN.md     # System architecture and API specs
│   ├── FRONTEND_PLAN.md    # Component and state management specs
│   └── UI_REDESIGN.md      # Design system and component redesign specs
└── scripts/
    └── 001_create_tables.sql # Database setup script
```

## Database Schema

```
auth.users (managed by Supabase Auth)
    ├── snippets
    │   ├── id
    │   ├── user_id
    │   ├── title
    │   ├── description
    │   ├── language
    │   ├── current_content
    │   ├── created_at
    │   └── updated_at
    │       ├── snippet_versions
    │       │   ├── id
    │       │   ├── snippet_id
    │       │   ├── version_number
    │       │   ├── content
    │       │   ├── commit_message
    │       │   └── created_at
    │       └── snippet_tags (junction table)
    │           ├── snippet_id
    │           └── tag_id
    └── tags
        ├── id
        ├── user_id
        ├── name
        └── created_at
```

All tables have Row-Level Security (RLS) enabled. All queries are automatically scoped by user_id for privacy and security.

## Development Guidelines

- Always use TypeScript with strict mode - no `any` types
- Use `cn()` helper from `lib/utils.ts` for Tailwind class composition
- Every API route must verify authentication via `supabase.auth.getUser()`
- Every database query must include `.eq('user_id', user.id)` for user-scoping
- Use browser client (`lib/supabase/client.ts`) in components
- Use server client (`lib/supabase/server.ts`) in API routes
- Call SWR `mutate()` after any create/update/delete operations
- Follow the implementation plan in `docs/IMPLEMENTATION_PLAN.md`

## Documentation

Complete project documentation is available in the `docs/` folder:

- `IMPLEMENTATION_PLAN.md` - Primary working document with step-by-step build plan
- `PRD.md` - Product requirements, features, and data model
- `BACKEND_PLAN.md` - System architecture, database schema, API specs
- `FRONTEND_PLAN.md` - Component hierarchy, state management, styling
- `UI_REDESIGN.md` - Design system and component redesign specifications

## Cost

This project is completely free to deploy and run. It uses only free-tier services:
- Supabase free tier (PostgreSQL database, auth, 5MB file storage)
- Vercel Hobby plan (free hosting with auto-deploy from GitHub)

## License

This project is open source and available under the MIT License.

## Contributing

When contributing, please:
1. Read the IMPLEMENTATION_PLAN.md for current development roadmap
2. Follow the development guidelines above
3. Use proper commit message format: `type(scope): description`
4. Test locally before pushing changes
5. Reference the PRD.md and relevant plan docs before implementing features
