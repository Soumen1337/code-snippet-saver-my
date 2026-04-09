'use client'

import { useState, useEffect } from 'react'
import { Settings, LogOut, User, Palette, Trash2, Sun, Moon } from 'lucide-react'
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
import { Separator } from '@/components/ui/separator'
import { useTheme } from 'next-themes'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function SettingsSheet() {
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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Settings"
          className="text-muted-foreground hover:text-foreground hover:bg-secondary"
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md bg-card border-border overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-foreground text-lg font-bold">Settings</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* ── Profile ───────────────────────────────── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground uppercase tracking-wide">Profile</span>
            </div>

            <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-secondary/50 border border-border">
              <div className="h-11 w-11 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {initials || '??'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {displayName || 'No display name set'}
                </p>
                <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display-name" className="text-sm text-foreground">
                Display name
              </Label>
              <div className="flex gap-2">
                <Input
                  id="display-name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  placeholder="Your name"
                  className="border-border focus:border-primary"
                />
                <Button
                  onClick={handleSave}
                  disabled={saving || !displayName.trim()}
                  className="gradient-bg hover:opacity-90 text-white shrink-0"
                >
                  {saving ? 'Saving…' : 'Save'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Shown in your vault header. Email cannot be changed here.
              </p>
            </div>
          </section>

          <Separator className="bg-border" />

          {/* ── Appearance ────────────────────────────── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground uppercase tracking-wide">Appearance</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Theme</p>
                <p className="text-xs text-muted-foreground mt-0.5">Light or dark mode</p>
              </div>
              {mounted && (
                <div className="flex items-center gap-1 bg-secondary rounded-lg p-1 border border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTheme('light')}
                    className={`h-8 px-3 rounded-md text-xs gap-1.5 transition-all ${
                      theme === 'light'
                        ? 'bg-background shadow-sm text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Sun className="h-3.5 w-3.5" />
                    Light
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTheme('dark')}
                    className={`h-8 px-3 rounded-md text-xs gap-1.5 transition-all ${
                      theme === 'dark'
                        ? 'bg-background shadow-sm text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Moon className="h-3.5 w-3.5" />
                    Dark
                  </Button>
                </div>
              )}
            </div>
          </section>

          <Separator className="bg-border" />

          {/* ── Account ───────────────────────────────── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <LogOut className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground uppercase tracking-wide">Account</span>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full border-border text-foreground hover:bg-secondary justify-start gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign out of SnippetVault
            </Button>
          </section>

          <Separator className="bg-border" />

          {/* ── Danger zone ───────────────────────────── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Trash2 className="h-4 w-4 text-destructive" />
              <span className="text-sm font-semibold text-destructive uppercase tracking-wide">Danger zone</span>
            </div>
            <Button
              variant="outline"
              disabled
              className="w-full border-destructive/25 text-destructive/40 justify-start gap-2 cursor-not-allowed"
            >
              <Trash2 className="h-4 w-4" />
              Delete account
              <span className="ml-auto text-xs bg-secondary px-2 py-0.5 rounded text-muted-foreground font-normal">
                Coming soon
              </span>
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Permanently deletes your account and all snippets.
            </p>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}
