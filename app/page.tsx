import { Button } from '@/components/ui/button'
import { Code2, History, Search, Tag, Copy, UserCog, GitCommit, MonitorSmartphone, Layers } from 'lucide-react'
import Link from 'next/link'
import { LandingHeader } from '@/components/landing-header'

export default function HomePage() {
  return (
    <div className="min-h-svh bg-background">
      <LandingHeader />

      <main>
        {/* Hero */}
        <section className="pt-24 pb-20 px-6">
          <div className="mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">

              <div>
                <div className="hero-in hero-d-1 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/25 text-sm text-primary mb-8 font-medium">
                  <Code2 className="h-3.5 w-3.5" />
                  Personal code vault for developers
                </div>

                <h1 className="hero-in hero-d-2 tracking-tight leading-[1.06]">
                  <span className="block font-semibold text-foreground text-5xl sm:text-6xl lg:text-[4.25rem]">
                    Code snippets with history
                  </span>
                  <span className="block font-black text-foreground text-5xl sm:text-6xl lg:text-[4.25rem]">
                    you actually control.
                  </span>
                </h1>

                <p className="hero-in hero-d-3 mt-7 max-w-md text-lg text-muted-foreground leading-relaxed">
                  Save in 20+ languages, tag and search instantly, and track every edit with automatic version history. All free, forever.
                </p>

                <div className="hero-in hero-d-4 mt-10 flex flex-wrap items-center gap-3">
                  <Button size="lg" asChild className="gradient-bg hover:opacity-90 text-white rounded-lg px-6 font-semibold text-base">
                    <Link href="/auth/sign-up">Get started for free</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg text-base">
                    <Link href="/auth/login">Sign in</Link>
                  </Button>
                </div>

                <p className="hero-in hero-d-4 mt-5 text-xs text-muted-foreground/70">
                  No credit card. Unlimited snippets. Free forever.
                </p>
              </div>

              {/* Code preview card */}
              <div className="hidden md:block hero-in hero-d-3">
                <div className="rounded-2xl border border-white/8 overflow-hidden shadow-2xl shadow-black/50" style={{ background: '#0d1117' }}>
                  <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                    <span className="ml-3 text-xs text-gray-500 font-mono">debounce.ts</span>
                    <span className="ml-auto flex items-center gap-2">
                      <span className="text-xs text-emerald-500/70 font-mono">v3</span>
                      <span className="text-xs text-gray-600 font-mono">of 5 versions</span>
                    </span>
                  </div>
                  <div className="px-5 py-4">
                    <pre className="text-sm font-mono leading-[1.7] overflow-hidden">
                      <span className="text-violet-400">function </span>
                      <span className="text-blue-300">debounce</span>
                      <span className="text-slate-300">{'<T extends (...args: unknown[]) => void>'}(</span>{'\n'}
                      <span className="text-slate-300">  fn: T, delay: </span>
                      <span className="text-orange-300">number</span>{'\n'}
                      <span className="text-slate-300">): T {'{'}</span>{'\n'}
                      <span className="text-slate-300">  </span>
                      <span className="text-violet-400">let </span>
                      <span className="text-slate-300">timer: ReturnType&lt;</span>
                      <span className="text-violet-400">typeof </span>
                      <span className="text-blue-300">setTimeout</span>
                      <span className="text-slate-300">&gt;;</span>{'\n'}
                      <span className="text-slate-300">  </span>
                      <span className="text-violet-400">return function </span>
                      <span className="text-slate-300">(...args) {'{'}</span>{'\n'}
                      <span className="text-slate-300">    </span>
                      <span className="text-blue-300">clearTimeout</span>
                      <span className="text-slate-300">(timer);</span>{'\n'}
                      <span className="text-slate-300">    timer = </span>
                      <span className="text-blue-300">setTimeout</span>
                      <span className="text-slate-300">(() =&gt; </span>
                      <span className="text-blue-300">fn</span>
                      <span className="text-slate-300">(...args), delay);</span>{'\n'}
                      <span className="text-slate-300">  {'}'} </span>
                      <span className="text-violet-400">as </span>
                      <span className="text-slate-300">T;</span>{'\n'}
                      <span className="text-slate-300">{'}'}</span>
                    </pre>
                  </div>
                  <div className="px-5 py-3 border-t border-white/5 flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/25">typescript</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400/80 border border-orange-500/20">utility</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/8">performance</span>
                    <span className="ml-auto text-xs text-gray-600">Saved just now</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Tech stack bar */}
        <div className="border-y border-border py-5 px-6">
          <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs text-muted-foreground/60 font-mono">
            <span>Built with</span>
            <span className="text-muted-foreground/80">Next.js 16</span>
            <span className="hidden sm:block w-px h-3 bg-border" />
            <span className="text-muted-foreground/80">Supabase</span>
            <span className="hidden sm:block w-px h-3 bg-border" />
            <span className="text-muted-foreground/80">TypeScript</span>
            <span className="hidden sm:block w-px h-3 bg-border" />
            <span className="text-muted-foreground/80">Vercel</span>
            <span className="hidden sm:block w-px h-3 bg-border" />
            <span className="text-muted-foreground/80">Tailwind CSS v4</span>
            <span className="hidden sm:block w-px h-3 bg-border" />
            <span className="text-primary/70">Free and open</span>
          </div>
        </div>

        {/* How it works */}
        <section id="how-it-works" className="py-24 px-6">
          <div className="mx-auto max-w-6xl">
            <div className="scroll-reveal inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/25 text-sm text-primary mb-6 font-medium">
              Simple workflow
            </div>
            <h2 className="scroll-reveal text-4xl font-black text-foreground mb-3 tracking-tight">
              How it works
            </h2>
            <p className="scroll-reveal text-muted-foreground mb-16 max-w-lg text-lg">
              Three steps from raw snippet to a searchable, versioned library.
            </p>

            <div className="grid md:grid-cols-3 gap-0">
              <div className="scroll-reveal scroll-reveal-delay-1 flex gap-5 md:pr-10 pb-10 md:pb-0 border-b md:border-b-0 md:border-r border-border">
                <div className="text-4xl font-black text-primary/25 font-mono leading-none shrink-0 w-10">01</div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Save</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Paste any snippet, set the language, add a description and tags. Syntax highlighting applies instantly across 20+ languages.
                  </p>
                </div>
              </div>

              <div className="scroll-reveal scroll-reveal-delay-2 flex gap-5 md:px-10 pt-10 md:pt-0 pb-10 md:pb-0 border-b md:border-b-0 md:border-r border-border">
                <div className="text-4xl font-black text-primary/25 font-mono leading-none shrink-0 w-10">02</div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Organize</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Filter by language, search by keyword, or click a tag in the sidebar to narrow results. Find anything in seconds.
                  </p>
                </div>
              </div>

              <div className="scroll-reveal scroll-reveal-delay-3 flex gap-5 md:pl-10 pt-10 md:pt-0">
                <div className="text-4xl font-black text-primary/25 font-mono leading-none shrink-0 w-10">03</div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Track changes</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Every save creates a version. Open the history panel and compare any version to the one before with a side-by-side diff viewer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t border-border py-24 px-6">
          <div className="mx-auto max-w-6xl">
            <div className="scroll-reveal inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/25 text-sm text-primary mb-6 font-medium">
              Built for developers
            </div>
            <h2 className="scroll-reveal text-4xl font-black text-foreground mb-3 tracking-tight">
              Everything you need
            </h2>
            <p className="scroll-reveal text-muted-foreground mb-16 max-w-lg text-lg">
              A personal library of reusable code that works the way developers think.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

              <div className="scroll-reveal scroll-reveal-delay-1 group bg-card border border-border rounded-xl p-6 space-y-3 hover:border-primary/40 transition-colors duration-200">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 transition-colors">
                  <Code2 className="h-[1.1rem] w-[1.1rem]" />
                </div>
                <h3 className="font-bold text-foreground">20+ Languages</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Syntax highlighting for JavaScript, TypeScript, Python, Rust, Go, SQL and more. Every snippet looks sharp with color-coded language badges.
                </p>
              </div>

              <div className="scroll-reveal scroll-reveal-delay-2 group bg-card border border-border rounded-xl p-6 space-y-3 hover:border-primary/40 transition-colors duration-200">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 transition-colors">
                  <History className="h-[1.1rem] w-[1.1rem]" />
                </div>
                <h3 className="font-bold text-foreground">Version History</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every save is versioned automatically. Compare any version to the previous one side by side. Green lines added, red lines removed.
                </p>
              </div>

              <div className="scroll-reveal scroll-reveal-delay-3 group bg-card border border-border rounded-xl p-6 space-y-3 hover:border-primary/40 transition-colors duration-200">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 transition-colors">
                  <GitCommit className="h-[1.1rem] w-[1.1rem]" />
                </div>
                <h3 className="font-bold text-foreground">Commit Messages</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Add a short note when you save a snippet, like a git commit. Write "fixed edge case" or "refactored for clarity" so future you knows exactly what changed.
                </p>
              </div>

              <div className="scroll-reveal scroll-reveal-delay-1 group bg-card border border-border rounded-xl p-6 space-y-3 hover:border-primary/40 transition-colors duration-200">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 transition-colors">
                  <Search className="h-[1.1rem] w-[1.1rem]" />
                </div>
                <h3 className="font-bold text-foreground">Instant Search</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Search by title, language, or tags. Results update as you type, debounced and fast, with no full-page reloads.
                </p>
              </div>

              <div className="scroll-reveal scroll-reveal-delay-2 group bg-card border border-border rounded-xl p-6 space-y-3 hover:border-primary/40 transition-colors duration-200">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 transition-colors">
                  <Tag className="h-[1.1rem] w-[1.1rem]" />
                </div>
                <h3 className="font-bold text-foreground">Tags and Filtering</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Create custom tags like{' '}
                  <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded border border-border">react</span>
                  {' '}or{' '}
                  <span className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded border border-border">interview-prep</span>
                  . Click any tag in the sidebar to filter your vault instantly.
                </p>
              </div>

              <div className="scroll-reveal scroll-reveal-delay-3 group bg-card border border-border rounded-xl p-6 space-y-3 hover:border-primary/40 transition-colors duration-200">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 transition-colors">
                  <Copy className="h-[1.1rem] w-[1.1rem]" />
                </div>
                <h3 className="font-bold text-foreground">One-click Copy</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Hover any snippet card and copy the full code to your clipboard instantly. No selecting, no scrolling, no friction.
                </p>
              </div>

              <div className="scroll-reveal scroll-reveal-delay-1 group bg-card border border-border rounded-xl p-6 space-y-3 hover:border-primary/40 transition-colors duration-200">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 transition-colors">
                  <MonitorSmartphone className="h-[1.1rem] w-[1.1rem]" />
                </div>
                <h3 className="font-bold text-foreground">Cross-device Sync</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your entire vault is stored securely in Supabase. Sign in on your laptop, desktop, or any browser and all your snippets are right there.
                </p>
              </div>

              <div className="scroll-reveal scroll-reveal-delay-2 group bg-card border border-border rounded-xl p-6 space-y-3 hover:border-primary/40 transition-colors duration-200">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 transition-colors">
                  <Layers className="h-[1.1rem] w-[1.1rem]" />
                </div>
                <h3 className="font-bold text-foreground">Descriptions and Context</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every snippet supports a plain-text description. Write what the snippet does, when to use it, or what problem it solves, so the context never gets lost.
                </p>
              </div>

              <div className="scroll-reveal scroll-reveal-delay-3 group bg-card border border-border rounded-xl p-6 space-y-3 hover:border-primary/40 transition-colors duration-200">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 transition-colors">
                  <UserCog className="h-[1.1rem] w-[1.1rem]" />
                </div>
                <h3 className="font-bold text-foreground">Profile and Settings</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Set a display name, switch between light and dark mode, and manage your account from the settings panel inside your vault.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border py-28 px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="scroll-reveal text-5xl font-black text-foreground tracking-tight leading-[1.1]">
              Stop losing<br />good snippets.
            </h2>
            <p className="scroll-reveal mt-5 text-lg text-muted-foreground">
              Free forever. No credit card. No limits on snippets.
            </p>
            <div className="scroll-reveal mt-10">
              <Button size="lg" asChild className="gradient-bg hover:opacity-90 text-white rounded-lg px-10 font-semibold text-base">
                <Link href="/auth/sign-up">Create your vault for free</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 px-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">SnippetVault</span>
          </div>
          <p>2026 SnippetVault. Built for developers. Free forever.</p>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="hover:text-foreground transition-colors">Sign in</Link>
            <Link href="/auth/sign-up" className="hover:text-foreground transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
