'use client'

import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Highlight, themes } from 'prism-react-renderer'
import { Download, Loader2 } from 'lucide-react'
import { SnippetWithTags, Language } from '@/lib/types'

const langMap: Record<string, string> = {
  javascript: 'javascript', typescript: 'typescript', python: 'python',
  rust: 'rust', go: 'go', css: 'css', html: 'markup', sql: 'sql',
  bash: 'bash', java: 'java', cpp: 'cpp', c: 'c', csharp: 'csharp',
  ruby: 'ruby', php: 'php', swift: 'swift', kotlin: 'kotlin',
  json: 'json', yaml: 'yaml', markdown: 'markdown', text: 'markup',
}

const BG_PRESETS = [
  { label: 'Midnight', value: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)' },
  { label: 'Ocean',    value: 'linear-gradient(135deg,#0f2027,#203a43,#2c5364)' },
  { label: 'Ember',    value: 'linear-gradient(135deg,#200122,#6f0000)' },
  { label: 'Forest',   value: 'linear-gradient(135deg,#0a3d0a,#1a6b3c)' },
  { label: 'Slate',    value: 'linear-gradient(135deg,#1c1c2e,#2e2e4e)' },
]

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  snippet: SnippetWithTags
}

export function ExportImageModal({ open, onOpenChange, snippet }: Props) {
  const codeRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [bgIndex, setBgIndex] = useState(0)

  const prismLang = langMap[snippet.language] || 'markup'

  const handleDownload = async () => {
    if (!codeRef.current) return
    setDownloading(true)
    try {
      const dataUrl = await toPng(codeRef.current, { cacheBust: true, pixelRatio: 2 })
      const a = document.createElement('a')
      a.download = `${snippet.title.replace(/\s+/g, '-').toLowerCase()}.png`
      a.href = dataUrl
      a.click()
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Export as Image</DialogTitle>
        </DialogHeader>

        {/* Background picker */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-muted-foreground">Background</span>
          {BG_PRESETS.map((p, i) => (
            <button key={p.label} onClick={() => setBgIndex(i)} title={p.label}
              className={['h-6 w-6 rounded-full transition-all', i === bgIndex ? 'ring-2 ring-primary ring-offset-2 ring-offset-card' : ''].join(' ')}
              style={{ background: p.value }} />
          ))}
        </div>

        {/* Preview — this div is captured by html-to-image */}
        <div ref={codeRef} className="rounded-2xl p-6" style={{ background: BG_PRESETS[bgIndex].value }}>
          <div className="rounded-xl overflow-hidden shadow-2xl bg-[#0d1117]">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
              <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <div className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-xs text-slate-500 font-mono select-none">{snippet.title}</span>
              <span className="ml-auto text-xs text-slate-600 font-mono select-none">{snippet.language}</span>
            </div>
            <div className="overflow-x-auto">
              <Highlight theme={themes.nightOwl} code={snippet.current_content} language={prismLang}>
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre className={`${className} p-5 text-sm font-mono`}
                    style={{ ...style, background: 'transparent', margin: 0 }}>
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })} className="flex">
                        <span className="select-none pr-5 text-slate-600 min-w-[2rem] text-right">{i + 1}</span>
                        <span>{line.map((token, key) => <span key={key} {...getTokenProps({ token })} />)}</span>
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-1">
          <Button onClick={handleDownload} disabled={downloading} className="gradient-bg hover:opacity-90 text-white">
            {downloading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            {downloading ? 'Generating…' : 'Download PNG'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
