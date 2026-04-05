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
            <Code2 className="h-7 w-7 text-emerald-500" />
            <span className="text-lg font-semibold text-foreground">SnippetVault</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="py-24 px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
              <GitBranch className="h-4 w-4" />
              <span>Version control for your code snippets</span>
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Save, organize, and track
              <span className="text-emerald-500"> code snippets</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
              Never lose track of your evolving code snippets. SnippetVault provides Git-like version history, 
              powerful search, and smart tagging to keep your code organized.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Link href="/auth/sign-up">Start saving snippets</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/login">Sign in</Link>
              </Button>
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
              <Button size="lg" asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
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
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
        {icon}
      </div>
      <h3 className="mb-2 font-semibold text-card-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
