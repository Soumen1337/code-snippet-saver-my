import { Button } from '@/components/ui/button'
import { Code2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="glass rounded-2xl border border-white/10 p-8 w-full max-w-md shadow-2xl text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Code2 className="h-8 w-8 text-primary" />
          <span className="text-xl font-semibold gradient-text">SnippetVault</span>
        </div>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-4">Authentication Error</h1>
        {params?.error ? (
          <p className="text-sm text-muted-foreground mb-6">Error: {params.error}</p>
        ) : (
          <p className="text-sm text-muted-foreground mb-6">
            An unexpected error occurred during authentication.
          </p>
        )}
        <Button asChild className="gradient-bg hover:opacity-90 text-white w-full">
          <Link href="/auth/login">Try again</Link>
        </Button>
      </div>
    </div>
  )
}
