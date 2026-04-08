import { Button } from '@/components/ui/button'
import { Code2, GitBranch, Search, Tag, Copy, History } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Code2 className="h-7 w-7 text-primary" />
            <span className="text-lg font-semibold gradient-text">SnippetVault</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild className="gradient-bg hover:opacity-90 text-white">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="py-24 px-6">
          <div className="mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Hero text */}
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
                  <GitBranch className="h-4 w-4" />
                  <span>Version control for your code snippets</span>
                </div>
                <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Save, organize, and track
                  <span className="gradient-text"> code snippets</span>
                </h1>
                <p className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
                  Never lose track of your evolving code snippets. SnippetVault provides Git-like version history,
                  powerful search, and smart tagging to keep your code organized.
                </p>
                <div className="mt-10 flex items-center gap-4">
                  <Button size="lg" asChild className="gradient-bg hover:opacity-90 text-white">
                    <Link href="/auth/sign-up">Start saving snippets</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/auth/login">Sign in</Link>
                  </Button>
                </div>
              </div>

              {/* Code preview card */}
              <div className="hidden md:block">
                <div className="glass border-white/10 rounded-xl p-4 shadow-2xl shadow-primary/10">
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="h-3 w-3 rounded-full bg-red-500/70" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                    <span className="h-3 w-3 rounded-full bg-green-500/70" />
                    <span className="ml-2 text-xs text-muted-foreground font-mono">debounce.js</span>
                  </div>
                  <div className="bg-[#0d1117] rounded-lg p-4 overflow-hidden">
                    <pre className="text-sm font-mono leading-relaxed">
                      <span className="text-violet-400">function </span>
                      <span className="text-cyan-400">debounce</span>
                      <span className="text-slate-300">(fn, delay) {'{'}</span>{'\n'}
                      <span className="text-slate-300">  </span>
                      <span className="text-violet-400">let </span>
                      <span className="text-slate-300">timer;</span>{'\n'}
                      <span className="text-slate-300">  </span>
                      <span className="text-violet-400">return function </span>
                      <span className="text-slate-300">(...args) {'{'}</span>{'\n'}
                      <span className="text-slate-300">    </span>
                      <span className="text-cyan-400">clearTimeout</span>
                      <span className="text-slate-300">(timer);</span>{'\n'}
                      <span className="text-slate-300">    timer = </span>
                      <span className="text-cyan-400">setTimeout</span>
                      <span className="text-slate-300">(() =&gt; {'{'}</span>{'\n'}
                      <span className="text-slate-300">      fn.</span>
                      <span className="text-cyan-400">apply</span>
                      <span className="text-slate-300">(</span>
                      <span className="text-violet-400">this</span>
                      <span className="text-slate-300">, args);</span>{'\n'}
                      <span className="text-slate-300">    {'}'}, delay);</span>{'\n'}
                      <span className="text-slate-300">  {'}'};</span>{'\n'}
                      <span className="text-slate-300">{'}'}</span>
                    </pre>
                  </div>
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">javascript</span>
                    <span className="text-xs px-2 py-0.5 rounded-full glass border border-white/10 text-muted-foreground">utility</span>
                    <span className="text-xs px-2 py-0.5 rounded-full glass border border-white/10 text-muted-foreground">performance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border py-24 px-6">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold text-foreground">
              Everything you need to manage snippets
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Built for developers who reuse and evolve code snippets across projects.
            </p>

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<History className="h-6 w-6" />}
                title="Version History"
                description="Track every change to your snippets with Git-like version control. Compare versions and see exactly what changed."
              />
              <FeatureCard
                icon={<Tag className="h-6 w-6" />}
                title="Smart Tags"
                description="Organize snippets with custom tags. Filter and find related code instantly with multi-tag search."
              />
              <FeatureCard
                icon={<Search className="h-6 w-6" />}
                title="Powerful Search"
                description="Full-text search across titles, descriptions, and code content. Find any snippet in milliseconds."
              />
              <FeatureCard
                icon={<Code2 className="h-6 w-6" />}
                title="Syntax Highlighting"
                description="Beautiful syntax highlighting for JavaScript, TypeScript, HTML, CSS, JSON, and more."
              />
              <FeatureCard
                icon={<Copy className="h-6 w-6" />}
                title="Quick Copy"
                description="One-click copy to clipboard. Paste your snippets anywhere without friction."
              />
              <FeatureCard
                icon={<GitBranch className="h-6 w-6" />}
                title="Diff Viewer"
                description="Side-by-side diff comparison to see exactly what changed between versions."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border py-24 px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-foreground">
              Ready to organize your code?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join developers who trust SnippetVault to manage their code snippets.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild className="gradient-bg hover:opacity-90 text-white">
                <Link href="/auth/sign-up">Get started for free</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Code2 className="h-5 w-5" />
            <span className="text-sm">SnippetVault</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built for developers, by developers.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="glass rounded-lg p-6 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 font-semibold text-card-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
