'use client'

import { useEffect } from 'react'
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput,
  CommandItem, CommandList, CommandSeparator, CommandShortcut,
} from '@/components/ui/command'
import { SnippetWithTags } from '@/lib/types'
import { FileCode, Plus, Pin } from 'lucide-react'

const langColor: Record<string, string> = {
  javascript: 'text-amber-400', typescript: 'text-blue-400',
  python: 'text-sky-400', rust: 'text-orange-400',
  go: 'text-cyan-400', css: 'text-pink-400',
  html: 'text-red-400', sql: 'text-violet-400',
}

interface Props {
  snippets: SnippetWithTags[]
  onSelectSnippet: (snippet: SnippetWithTags) => void
  onNewSnippet: () => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ snippets, onSelectSnippet, onNewSnippet, open, onOpenChange }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onOpenChange])

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} showCloseButton={false}
      title="Command Palette" description="Search snippets or run an action">
      <CommandInput placeholder="Search snippets..." />
      <CommandList>
        <CommandEmpty>No snippets found.</CommandEmpty>
        {snippets.length > 0 && (
          <CommandGroup heading="Snippets">
            {snippets.map(s => (
              <CommandItem
                key={s.id}
                value={`${s.title} ${s.language} ${s.tags.map(t => t.name).join(' ')}`}
                onSelect={() => { onSelectSnippet(s); onOpenChange(false) }}
                className="gap-3"
              >
                <FileCode className={`h-4 w-4 shrink-0 ${langColor[s.language] ?? 'text-muted-foreground'}`} />
                <span className="flex-1 truncate">{s.title}</span>
                {s.is_pinned && <Pin className="h-3 w-3 text-primary shrink-0" />}
                <span className="text-xs text-muted-foreground shrink-0">{s.language}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => { onNewSnippet(); onOpenChange(false) }} className="gap-3">
            <Plus className="h-4 w-4 text-muted-foreground" />
            <span>New Snippet</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
