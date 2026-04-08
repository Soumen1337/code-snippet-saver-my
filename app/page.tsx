import { Button } from '@/components/ui/button'
import { Code2, History, Search, Tag } from 'lucide-react'
import Link from 'next/link'
import { LandingHeader } from '@/components/landing-header'

export default function HomePage() {
  return (
    <div className="min-h-svh bg-background">
      <LandingHeader />

      <main>
        {/* Hero */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              {/* Hero text */}
              <div>
                <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-[1.08]">
                  Your code.<br />Your vault.<br />
                  <span className="text-primary">Organized.</span>
                </h1>
                <p className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed">
                  Save snippets in 20+ languages, tag them, search instantly, and track every edit with built-in version history.
                </p>
                <div className="mt-10 flex items-center gap-4">
                  <Button size="lg" asChild className="gradient-bg hover:opacity-90 text-white">
                    <Link href="/auth/sign-up">Start for free →</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/auth/login">View demo</Link>
                  </Button>
                </div>
              </div>

              {/* Code preview card */}
              <div className="hidden md:block">
                <div className="bg-[#0d1117] rounded-2xl border border-white/10 p-5 shadow-2xl">
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
            <h2 className="text-3xl font-bold text-foreground mb-4">How it works</h2>
            <p className="text-muted-foreground mb-16 max-w-xl">
              Three steps from snippet to searchable, versioned knowledge base.
            </p>
            <div className="grid md:grid-cols-3 gap-12">
              <div>
                <div className="text-6xl font-bold text-muted-foreground/20 mb-4 font-mono leading-none">01</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Save</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Write once, keep forever. Paste any code snippet with a title, language, and tags.
                </p>
              </div>
              <div>
                <div className="text-6xl font-bold text-muted-foreground/20 mb-4 font-mono leading-none">02</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Organize</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Filter by language, search by keyword, or browse by tag. Find anything in seconds.
                </p>
              </div>
              <div>
                <div className="text-6xl font-bold text-muted-foreground/20 mb-4 font-mono leading-none">03</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Track</h3>
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
            <h2 className="text-3xl font-bold text-foreground mb-4">Built for developers</h2>
            <p className="text-muted-foreground mb-16 max-w-xl">
              Everything you need to maintain a personal library of reusable code.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-xl p-6 space-y-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Code2 className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground">20+ Languages</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Syntax highlighting for JavaScript, TypeScript, Python, Rust, Go, and more. Every language looks sharp.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 space-y-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <History className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground">Version History</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Automatic versioning on every save with optional commit messages. Compare any two versions with a side-by-side diff viewer.
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 space-y-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Search className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-foreground">Instant Search</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Search by title, language, or tags. Results update as you type — no waiting, no full-page reloads.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border py-24 px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold text-foreground tracking-tight">
              Stop losing good snippets.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Free forever. No credit card required.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild className="gradient-bg hover:opacity-90 text-white">
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
