'use client'

import { useState, useEffect } from 'react'
import { Settings, LogOut, Sun, Moon } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTheme } from 'next-themes'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface SettingsSheetProps {
  trigger?: React.ReactNode
}

export function SettingsSheet({ trigger }: SettingsSheetProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
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

  const handleSave = async () => {
    if (!displayName.trim()) return
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName.trim() },
    })
    setSaving(false)
    if (error) {
      toast.error('Failed to update display name')
    } else {
      toast.success('Display name updated')
    }
  }

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const initials = (displayName || userEmail).slice(0, 2).toUpperCase()

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Settings"
      className="h-8 w-8 text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent"
    >
      <Settings className="h-4 w-4" />
    </Button>
  )

  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger ?? defaultTrigger}
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-sm bg-card border-border flex flex-col p-0">
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-5 border-b border-border">
          <SheetTitle className="text-base font-semibold text-foreground">Settings</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {/* ── Profile ─────────────────────────────── */}
          <div className="px-6 py-5">
            {/* Avatar + identity */}
            <div className="flex items-center gap-4 mb-5">
              <div className="h-14 w-14 rounded-2xl gradient-bg flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg shadow-primary/20">
                {initials || '?'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate leading-snug">
                  {displayName || 'No name set'}
                </p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{userEmail}</p>
              </div>
            </div>

            {/* Display name field */}
            <div className="space-y-1.5">
              <Label htmlFor="display-name" className="text-xs text-muted-foreground font-medium">
                Display name
              </Label>
              <div className="flex gap-2">
                <Input
                  id="display-name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  placeholder="Your name"
                  className="h-9 text-sm border-border bg-input/50 focus:border-primary focus:ring-0"
                />
                <Button
                  onClick={handleSave}
                  disabled={saving || !displayName.trim()}
                  className="h-9 px-4 gradient-bg hover:opacity-90 text-white shrink-0 text-sm font-medium"
                >
                  {saving ? 'Saving…' : 'Save'}
                </Button>
              </div>
            </div>
          </div>

          <div className="mx-6 h-px bg-border" />

          {/* ── Appearance ──────────────────────────── */}
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Theme</p>
                <p className="text-xs text-muted-foreground mt-0.5">Choose your preferred look</p>
              </div>
              {mounted && (
                <div className="flex items-center gap-0.5 bg-secondary rounded-lg p-1 border border-border">
                  <button
                    onClick={() => setTheme('light')}
                    className={[
                      'flex items-center gap-1.5 px-3 h-7 rounded-md text-xs font-medium transition-all',
                      theme === 'light'
                        ? 'bg-background shadow-sm text-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    ].join(' ')}
                  >
                    <Sun className="h-3 w-3" />
                    Light
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={[
                      'flex items-center gap-1.5 px-3 h-7 rounded-md text-xs font-medium transition-all',
                      theme === 'dark'
                        ? 'bg-background shadow-sm text-foreground'
                        : 'text-muted-foreground hover:text-foreground',
                    ].join(' ')}
                  >
                    <Moon className="h-3 w-3" />
                    Dark
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mx-6 h-px bg-border" />

          {/* ── Sign out ────────────────────────────── */}
          <div className="px-6 py-5">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors group"
            >
              <LogOut className="h-4 w-4 shrink-0 group-hover:text-primary transition-colors" />
              Sign out
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
