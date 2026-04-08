import { Button } from '@/components/ui/button'
import { Code2, Mail } from 'lucide-react'
import Link from 'next/link'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="glass rounded-2xl border border-white/10 p-8 w-full max-w-md shadow-2xl text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Code2 className="h-8 w-8 text-primary" />
          <span className="text-xl font-semibold gradient-text">SnippetVault</span>
        </div>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Check your email</h1>
        <p className="text-sm text-muted-foreground mb-2">We&apos;ve sent you a confirmation link</p>
        <p className="text-sm text-muted-foreground mb-6">
          Please check your email and click the confirmation link to activate your account.
          Once confirmed, you can start saving your code snippets.
        </p>
        <Link
          href="/auth/login"
          className="text-sm text-primary underline underline-offset-4 hover:text-primary/70"
        >
          Back to login
        </Link>
      </div>
    </div>
  )
}
