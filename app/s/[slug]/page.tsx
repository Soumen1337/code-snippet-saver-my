import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Highlight, themes } from 'prism-react-renderer'
import { Code2 } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

const langMap: Record<string, string> = {
  javascript: 'javascript', typescript: 'typescript', python: 'python',
  rust: 'rust', go: 'go', css: 'css', html: 'markup', sql: 'sql',
  bash: 'bash', java: 'java', cpp: 'cpp', c: 'c', csharp: 'csharp',
  ruby: 'ruby', php: 'php', swift: 'swift', kotlin: 'kotlin',
  json: 'json', yaml: 'yaml', markdown: 'markdown', text: 'markup',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('snippets').select('title, description, language')
    .eq('share_slug', slug).eq('is_public', true).single()
  if (!data) return { title: 'Snippet not found' }
  return {
    title: `${data.title} — SnippetVault`,
    description: data.description ?? `A ${data.language} snippet shared from SnippetVault`,
  }
}

export default async function PublicSnippetPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: snippet } = await supabase
    .from('snippets')
    .select('title, description, language, current_content')
    .eq('share_slug', slug).eq('is_public', true).single()

  if (!snippet) notFound()

  const prismLang = langMap[snippet.language] || 'markup'

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-300 flex flex-col">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white font-semibold text-sm hover:opacity-80 transition-opacity">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/20 text-primary">
            <Code2 className="h-4 w-4" />
          </div>
          SnippetVault
        </Link>
        <Link href="/auth/sign-up" className="text-xs px-3 py-1.5 rounded-md bg-primary text-white font-medium hover:opacity-90 transition-opacity">
          Save your own snippets →
        </Link>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white mb-2">{snippet.title}</h1>
          {snippet.description && <p className="text-slate-400 text-sm">{snippet.description}</p>}
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-slate-300">
              {snippet.language}
            </span>
            <span className="text-xs text-slate-500">Shared via SnippetVault</span>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
            <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-xs text-slate-500 font-mono">{snippet.title}</span>
          </div>
          <Highlight theme={themes.nightOwl} code={snippet.current_content} language={prismLang}>
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre className={`${className} p-6 text-sm font-mono overflow-x-auto`}
                style={{ ...style, background: 'transparent', margin: 0 }}>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })} className="flex">
                    <span className="select-none pr-6 text-slate-600 min-w-[2.5rem] text-right">{i + 1}</span>
                    <span>{line.map((token, key) => <span key={key} {...getTokenProps({ token })} />)}</span>
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>
      </main>

      <footer className="border-t border-white/10 px-6 py-4 text-center">
        <p className="text-xs text-slate-600">
          Shared with <Link href="/" className="text-slate-500 hover:text-slate-400">SnippetVault</Link>
        </p>
      </footer>
    </div>
  )
}
