import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Code2, Mail } from 'lucide-react'
import Link from 'next/link'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2 text-foreground">
            <Code2 className="h-8 w-8 text-emerald-500" />
            <span className="text-xl font-semibold">SnippetVault</span>
          </div>
          <Card className="border-border bg-card">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                <Mail className="h-6 w-6 text-emerald-500" />
              </div>
              <CardTitle className="text-2xl text-card-foreground">
                Check your email
              </CardTitle>
              <CardDescription>
                We&apos;ve sent you a confirmation link
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                Please check your email and click the confirmation link to activate your account.
                Once confirmed, you can start saving your code snippets.
              </p>
              <div className="mt-6">
                <Link
                  href="/auth/login"
                  className="text-sm text-emerald-500 underline underline-offset-4 hover:text-emerald-400"
                >
                  Back to login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
