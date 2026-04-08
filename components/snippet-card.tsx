'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Clock, Check } from 'lucide-react'
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
}

export function SnippetCard({ snippet, onClick }: SnippetCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(snippet.current_content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const previewContent = snippet.current_content.split('\n').slice(0, 6).join('\n')

  return (
    <Card
      className="glass border-white/10 cursor-pointer hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 group"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-medium text-card-foreground truncate">
              {snippet.title}
            </CardTitle>
            {snippet.description && (
              <p className="mt-1 text-sm text-muted-foreground truncate">
                {snippet.description}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 glass border border-white/10 hover:border-primary/50"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
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
              <span key={tag.id} className="text-xs px-2 py-0.5 rounded-full glass border border-white/10 text-muted-foreground shrink-0">
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
