'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Code2, Plus, Search, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { SettingsSheet } from '@/components/settings-sheet'

interface DashboardHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onNewSnippet: () => void
}

export function DashboardHeader({
  searchQuery,
  onSearchChange,
  onNewSnippet,
}: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2 shrink-0">
          <Code2 className="h-7 w-7 text-primary" />
          <span className="text-lg font-semibold text-foreground hidden sm:inline">SnippetVault</span>
        </div>

        <div className="flex flex-1 max-w-md items-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search snippets..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button onClick={onNewSnippet} className="gradient-bg hover:opacity-90 text-white">
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">New Snippet</span>
          </Button>
          <div className="w-px h-5 bg-border mx-1" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
            className="text-muted-foreground hover:text-foreground"
          >
            {mounted ? (
              theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
            ) : (
              <div className="h-4 w-4" />
            )}
          </Button>
          <SettingsSheet />
        </div>
      </div>
    </header>
  )
}
