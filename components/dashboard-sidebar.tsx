'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Code2,
  Plus,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Language, SUPPORTED_LANGUAGES } from '@/lib/types'
import { cn } from '@/lib/utils'
import { SettingsSheet } from '@/components/settings-sheet'
import { createClient } from '@/lib/supabase/client'

interface DashboardSidebarProps {
  selectedLanguage: Language | null
  onLanguageSelect: (language: Language | null) => void
  onNewSnippet: () => void
}

const SIDEBAR_LANGUAGES: Language[] = [
  'javascript',
  'typescript',
  'python',
  'rust',
  'go',
  'css',
  'html',
  'c',
  'cpp',
  'java',
]

export function DashboardSidebar({
  selectedLanguage,
  onLanguageSelect,
  onNewSnippet,
}: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email ?? '')
        setDisplayName(user.user_metadata?.display_name ?? '')
      }
    }
    fetchUser()
  }, [])

  const initials = (displayName || userEmail).slice(0, 2).toUpperCase()
  const label = displayName || userEmail.split('@')[0] || 'Account'

  return (
    <aside
      className={cn(
        'flex flex-col h-svh bg-sidebar border-r border-sidebar-border transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <div className={cn('flex items-center gap-2', isCollapsed && 'justify-center w-full')}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Code2 className="h-4 w-4" />
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-foreground">SnippetVault</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-7 w-7 text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent',
            isCollapsed && 'hidden'
          )}
          onClick={() => setIsCollapsed(true)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-12 top-4 h-7 w-7 text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => setIsCollapsed(false)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* New Snippet Button */}
      <div className="p-3">
        <Button
          onClick={onNewSnippet}
          className={cn(
            'w-full gradient-bg hover:opacity-90 text-white font-medium hover:shadow-lg hover:shadow-primary/30',
            isCollapsed ? 'px-0' : 'justify-start'
          )}
        >
          <Plus className={cn('h-4 w-4', !isCollapsed && 'mr-2')} />
          {!isCollapsed && 'New Snippet'}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="px-3 pb-3">
        <Button
          variant="ghost"
          onClick={() => onLanguageSelect(null)}
          className={cn(
            'w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent',
            selectedLanguage === null && 'bg-primary/10 border-l-2 border-primary',
            isCollapsed && 'justify-center px-0'
          )}
        >
          <LayoutGrid className={cn('h-4 w-4', !isCollapsed && 'mr-2')} />
          {!isCollapsed && 'All Snippets'}
        </Button>
      </nav>

      {/* Languages */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto px-3">
          <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-sidebar-muted">
            Languages
          </div>
          <div className="space-y-1">
            {SIDEBAR_LANGUAGES.map((lang) => {
              const langInfo = SUPPORTED_LANGUAGES.find(l => l.value === lang)
              return (
                <Button
                  key={lang}
                  variant="ghost"
                  onClick={() => onLanguageSelect(lang === selectedLanguage ? null : lang)}
                  className={cn(
                    'w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent font-normal',
                    selectedLanguage === lang && 'bg-primary/10 border-l-2 border-primary'
                  )}
                >
                  <Code2 className="h-3.5 w-3.5 mr-2 text-sidebar-muted" />
                  {langInfo?.label || lang}
                </Button>
              )
            })}
          </div>
        </div>
      )}

      {/* Footer — profile card */}
      <div className="mt-auto border-t border-sidebar-border p-3">
        {isCollapsed ? (
          /* Collapsed: just the avatar as the settings trigger */
          <SettingsSheet
            trigger={
              <button
                className="w-full flex justify-center"
                aria-label="Settings"
                title={label}
              >
                <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {initials || '?'}
                </div>
              </button>
            }
          />
        ) : (
          /* Expanded: avatar + name/email + gear icon */
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-sidebar-foreground truncate leading-tight">
                {label}
              </p>
              {displayName && (
                <p className="text-[10px] text-sidebar-muted truncate leading-tight mt-0.5">
                  {userEmail}
                </p>
              )}
            </div>
            <SettingsSheet />
          </div>
        )}
      </div>
    </aside>
  )
}
