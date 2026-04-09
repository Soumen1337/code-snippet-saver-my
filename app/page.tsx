import { Button } from '@/components/ui/button'
import { Code2, History, Search } from 'lucide-react'
import Link from 'next/link'
import { LandingHeader } from '@/components/landing-header'

export default function HomePage() {
  return (
    <div className="min-h-svh bg-background">
      <LandingHeader />

      <main>
        {/* Hero */}
        <section className="py-28 px-6">
          <div className="mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Hero text */}
              <div>
                <div className="hero-in hero-d-1 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/25 text-sm text-primary mb-8 font-medium">
                  <Code2 className="h-3.5 w-3.5" />
                  Personal code vault for developers
                </div>
                <h1 className="hero-in hero-d-2 text-5xl font-black tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-[1.05]">
                  Your code.<br />Your vault.<br />
                  <span className="text-primary">Organized.</span>
                </h1>
                <p className="hero-in hero-d-3 mt-7 max-w-xl text-lg text-muted-foreground leading-relaxed">
                  Save snippets in 20+ languages, tag them, search instantly, and track every edit with built-in version history.
                </p>
                <div className="hero-in hero-d-4 mt-10 flex items-center gap-4">
                  <Button size="lg" asChild className="gradient-bg hover:opacity-90 text-white rounded-lg px-6">
                    <Link href="/auth/sign-up">Get started for free →</Link>
                  </Button>
                  <Button size="lg" variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
                    <Link href="/auth/login">Sign in</Link>
                  </Button>
                </div>
              </div>

              {/* Code preview card */}
              <div className="hidden md:block hero-in hero-d-3">
                <div className="bg-[#0d1117] rounded-2xl border border-white/8 p-5 shadow-2xl shadow-black/40">
                  <div className="flex items-center gap-1.5 mb-4">
                    <span className="h-3 w-3 rounded-full bg-red-500/70" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                    <span className="h-3 w-3 rounded-full bg-green-500/70" />
                    <span className="ml-3 text-xs text-gray-500 font-mono">debounce.ts</span>
                  </div>
                  <pre className="text-sm font-mono leading-relaxed">
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
                    <span className="text-gray-500">  // Returns debounced wrapper</span>{'\n'}
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
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">typescript</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">utility</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">performance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-t border-border py-24 px-6">
          <div className="mx-auto max-w-6xl">
            <div className="scroll-reveal inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/25 text-sm text-primary mb-6 font-medium">
              Simple workflow
            </div>
            <h2 className="scroll-reveal text-3xl font-black text-foreground mb-4 tracking-tight">How it works</h2>
            <p className="scroll-reveal text-muted-foreground mb-16 max-w-xl">
              Three steps from snippet to searchable, versioned knowledge base.
            </p>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="scroll-reveal scroll-reveal-delay-1">
                <div className="text-5xl font-black text-primary/20 mb-5 font-mono leading-none">01</div>
                <h3 className="text-xl font-bold text-foreground mb-2">Save</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Write once, keep forever. Paste any code snippet with a title, language, and tags.
                </p>
              </div>
              <div className="scroll-reveal scroll-reveal-delay-2">
                <div className="text-5xl font-black text-primary/20 mb-5 font-mono leading-none">02</div>
                <h3 className="text-xl font-bold text-foreground mb-2">Organize</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Filter by language, search by keyword, or browse by tag. Find anything in seconds.
                </p>
              </div>
              <div className="scroll-reveal scroll-reveal-delay-3">
                <div className="text-5xl font-black text-primary/20 mb-5 font-mono leading-none">03</div>
                <h3 className="text-xl font-bold text-foreground mb-2">Track</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Every edit is versioned automatically. Compare any two versions side-by-side with a diff viewer.
                </p>
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
            <h2 className="scroll-reveal text-3xl font-black text-foreground mb-4 tracking-tight">Everything you need</h2>
            <p className="scroll-reveal text-muted-foreground mb-16 max-w-xl">
              A personal library of reusable code that works the way developers think.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="scroll-reveal scroll-reveal-delay-1 bg-card border border-border rounded-xl p-6 space-y-3 hover:border-primary/30 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Code2 className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-foreground">20+ Languages</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Syntax highlighting for JavaScript, TypeScript, Python, Rust, Go, and more. Every language looks sharp.
                </p>
              </div>
              <div className="scroll-reveal scroll-reveal-delay-2 bg-card border border-border rounded-xl p-6 space-y-3 hover:border-primary/30 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <History className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-foreground">Version History</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Automatic versioning on every save with optional commit messages. Compare any two versions with a side-by-side diff viewer.
                </p>
              </div>
              <div className="scroll-reveal scroll-reveal-delay-3 bg-card border border-border rounded-xl p-6 space-y-3 hover:border-primary/30 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Search className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-foreground">Instant Search</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Search by title, language, or tags. Results update as you type — no waiting, no full-page reloads.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border py-28 px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="scroll-reveal text-4xl font-black text-foreground tracking-tight">
              Stop losing good snippets.
            </h2>
            <p className="scroll-reveal mt-4 text-lg text-muted-foreground">
              Free forever. No credit card required.
            </p>
            <div className="scroll-reveal mt-8">
              <Button size="lg" asChild className="gradient-bg hover:opacity-90 text-white rounded-lg px-8">
                <Link href="/auth/sign-up">Create your vault →</Link>
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
