import { Button } from '@/components/ui/button'
import { Code2, History, Search, Tag, Lock } from 'lucide-react'
import Link from 'next/link'
import { LandingHeader } from '@/components/landing-header'

export default function HomePage() {
  return (
    <div className="min-h-svh bg-background">
      <LandingHeader />

      <main>
        {/* ─── Hero ─────────────────────────────────────────────── */}
        <section className="py-28 px-6">
          <div className="mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">

              {/* Left — text */}
              <div>
                <div className="hero-in hero-d-1 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/25 text-sm text-primary mb-8 font-medium">
                  <Code2 className="h-3.5 w-3.5" />
                  Personal code vault for developers
                </div>

                {/* n8n-style headline: first line lighter, second line heavier */}
                <h1 className="hero-in hero-d-2 text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.06]">
                  <span className="block font-semibold text-foreground">Code snippets with history</span>
                  <span className="block font-black text-foreground">you actually control.</span>
                </h1>

                <p className="hero-in hero-d-3 mt-7 max-w-md text-lg text-muted-foreground leading-relaxed">
                  Save in 20+ languages, tag them, search instantly, and track every edit with automatic version history and a side-by-side diff viewer.
                </p>

                <div className="hero-in hero-d-4 mt-10 flex items-center gap-3">
                  <Button size="lg" asChild className="gradient-bg hover:opacity-90 text-white rounded-lg px-6 font-semibold">
                    <Link href="/auth/sign-up">Get started for free</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="border-border text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg">
                    <Link href="/auth/login">Sign in</Link>
                  </Button>
                </div>
              </div>

              {/* Right — code card */}
              <div className="hidden md:block hero-in hero-d-3">
                <div className="bg-[#0d1117] rounded-2xl border border-white/8 p-5 shadow-2xl shadow-black/50">
                  <div className="flex items-center gap-1.5 mb-4">
                    <span className="h-3 w-3 rounded-full bg-red-500/70" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                    <span className="h-3 w-3 rounded-full bg-green-500/70" />
                    <span className="ml-3 text-xs text-gray-500 font-mono">debounce.ts</span>
                    <span className="ml-auto text-xs text-gray-600 font-mono">v3 of 5</span>
                  </div>
                  <pre className="text-sm font-mono leading-relaxed overflow-hidden">
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
                  <div className="mt-4 flex items-center gap-2 flex-wrap border-t border-white/5 pt-4">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/25">typescript</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">utility</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">performance</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── How it works ─────────────────────────────────────── */}
        <section id="how-it-works" className="border-t border-border py-24 px-6">
          <div className="mx-auto max-w-6xl">
            <div className="scroll-reveal inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/25 text-sm text-primary mb-6 font-medium">
              Simple workflow
            </div>
            <h2 className="scroll-reveal text-4xl font-black text-foreground mb-3 tracking-tight">How it works</h2>
            <p className="scroll-reveal text-muted-foreground mb-16 max-w-lg text-lg">
              Three steps from raw snippet to a searchable, versioned library.
            </p>

            <div className="grid md:grid-cols-3 gap-0">
              {/* Step 1 */}
              <div className="scroll-reveal scroll-reveal-delay-1 flex gap-5 pr-8 pb-8 border-b md:border-b-0 md:border-r border-border">
                <div className="flex-shrink-0">
                  <div className="text-4xl font-black text-primary/30 font-mono leading-none">01</div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Save</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Paste any code snippet with a title, language, and optional tags. Syntax highlighting applies instantly.
                  </p>
                </div>
              </div>
              {/* Step 2 */}
              <div className="scroll-reveal scroll-reveal-delay-2 flex gap-5 md:px-8 py-8 md:py-0 border-b md:border-b-0 md:border-r border-border">
                <div className="flex-shrink-0">
                  <div className="text-4xl font-black text-primary/30 font-mono leading-none">02</div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Organize</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Filter by language, search by keyword, or click any tag to narrow results. Find anything in seconds.
                  </p>
                </div>
              </div>
              {/* Step 3 */}
              <div className="scroll-reveal scroll-reveal-delay-3 flex gap-5 pt-8 md:pt-0 md:pl-8">
                <div className="flex-shrink-0">
                  <div className="text-4xl font-black text-primary/30 font-mono leading-none">03</div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">Track changes</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Every save creates a version automatically. Compare any two versions side-by-side with a built-in diff viewer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Features ─────────────────────────────────────────── */}
        <section id="features" className="border-t border-border py-24 px-6">
          <div className="mx-auto max-w-6xl">
            <div className="scroll-reveal inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/25 text-sm text-primary mb-6 font-medium">
              Built for developers
            </div>
            <h2 className="scroll-reveal text-4xl font-black text-foreground mb-3 tracking-tight">Everything you need</h2>
            <p className="scroll-reveal text-muted-foreground mb-16 max-w-lg text-lg">
              A personal library of reusable code that works the way developers think.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="scroll-reveal scroll-reveal-delay-1 bg-card border border-border rounded-xl p-6 space-y-3 hover:border-primary/35 transition-colors duration-200">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Code2 className="h-4.5 w-4.5" />
                </div>
                <h3 className="font-bold text-foreground">20+ Languages</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Syntax highlighting for JavaScript, TypeScript, Python, Rust, Go, SQL, and more. Every snippet looks sharp.
                </p>
              </div>

              <div className="scroll-reveal scroll-reveal-delay-2 bg-card border border-border rounded-xl p-6 space-y-3 hover:border-primary/35 transition-colors duration-200">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <History className="h-4.5 w-4.5" />
                </div>
                <h3 className="font-bold text-foreground">Version History</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every save is versioned automatically with an optional commit message. Compare any version to the previous one with a side-by-side diff.
                </p>
              </div>

              <div className="scroll-reveal scroll-reveal-delay-3 bg-card border border-border rounded-xl p-6 space-y-3 hover:border-primary/35 transition-colors duration-200">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Search className="h-4.5 w-4.5" />
                </div>
                <h3 className="font-bold text-foreground">Instant Search</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Search by title, language, or tags. Results update as you type — no full-page reloads, no waiting.
                </p>
              </div>

              <div className="scroll-reveal scroll-reveal-delay-1 bg-card border border-border rounded-xl p-6 space-y-3 hover:border-primary/35 transition-colors duration-200">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Tag className="h-4.5 w-4.5" />
                </div>
                <h3 className="font-bold text-foreground">Tags & Filtering</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Create custom tags like <span className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">react</span> or <span className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">interview-prep</span>. Click any tag in your sidebar to filter instantly.
                </p>
              </div>

              <div className="scroll-reveal scroll-reveal-delay-2 bg-card border border-border rounded-xl p-6 space-y-3 hover:border-primary/35 transition-colors duration-200">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <h3 className="font-bold text-foreground">Private by Default</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Every snippet is private to your account — no one else can see your code. Sign in on any device and your vault is there.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA ──────────────────────────────────────────────── */}
        <section className="border-t border-border py-28 px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="scroll-reveal text-4xl font-black text-foreground tracking-tight leading-tight">
              Stop losing good snippets.
            </h2>
            <p className="scroll-reveal mt-4 text-lg text-muted-foreground">
              Free forever. No credit card. No limits on snippets.
            </p>
            <div className="scroll-reveal mt-10">
              <Button size="lg" asChild className="gradient-bg hover:opacity-90 text-white rounded-lg px-10 font-semibold">
                <Link href="/auth/sign-up">Create your vault for free →</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 SnippetVault — Built for developers. Free forever.
          </p>
        </div>
      </footer>
    </div>
  )
}
