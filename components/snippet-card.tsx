'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Clock, Check } from 'lucide-react'
import { SnippetWithTags, Language } from '@/lib/types'
import { CodeEditor } from './code-editor'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'

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
            className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
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
            <Badge variant="secondary" className="shrink-0">
              {snippet.language}
            </Badge>
            {snippet.tags.slice(0, 2).map((tag) => (
              <Badge key={tag.id} variant="outline" className="shrink-0">
                {tag.name}
              </Badge>
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
