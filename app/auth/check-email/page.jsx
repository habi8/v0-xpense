import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card border-primary/20">
        <CardHeader className="space-y-2 text-center">
          <div className="text-5xl mb-2">📧</div>
          <CardTitle className="text-2xl font-bold text-primary">Check Your Email</CardTitle>
          <CardDescription className="text-foreground/80">We've sent you a confirmation link</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground leading-relaxed">
            Please check your email and click the confirmation link to activate your account. Once confirmed, you can
            log in and start tracking your expenses.
          </p>
          <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/auth/login">Go to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
