'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Code2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push('/dashboard')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="glass rounded-2xl border border-white/10 p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Code2 className="h-8 w-8 text-primary" />
          <span className="text-xl font-semibold gradient-text">SnippetVault</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Welcome back</h1>
        <p className="text-sm text-muted-foreground mb-6">Enter your credentials to login</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="developer@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn('bg-input/50 backdrop-blur-sm border-border focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all')}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn('bg-input/50 backdrop-blur-sm border-border focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all')}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            type="submit"
            disabled={isLoading}
            className="gradient-bg hover:opacity-90 text-white w-full"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          {"Don't have an account? "}
          <Link href="/auth/sign-up" className="text-primary underline underline-offset-4 hover:text-primary/70">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
