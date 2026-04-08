'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Code2, Plus, LogOut, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2">
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
              className="w-full pl-10 bg-input"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={onNewSnippet}
            className="gradient-bg hover:opacity-90 text-white"
          >
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">New Snippet</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
