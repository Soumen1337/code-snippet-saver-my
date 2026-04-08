'use client'

import { Button } from '@/components/ui/button'
import { Code2, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'

export function LandingHeader() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Code2 className="h-7 w-7 text-primary" />
          <span className="text-lg font-semibold text-foreground">SnippetVault</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} suppressHydrationWarning>
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button asChild className="gradient-bg hover:opacity-90 text-white">
            <Link href="/auth/sign-up">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
