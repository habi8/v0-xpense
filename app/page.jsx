import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-primary">XPENSE</h1>
          <p className="text-xl text-muted-foreground">Track your expenses and income with ease</p>
        </div>

        <div className="glass-card p-8 rounded-lg space-y-6">
          <p className="text-foreground leading-relaxed">
            Stop typing everything in notes. XPENSE helps you quickly record your daily expenses and income with proper
            categorization.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
            >
              <Link href="/auth/login">Login</Link>
            </Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mt-12">
          <div className="glass-card p-6 rounded-lg">
            <div className="text-3xl mb-2">💰</div>
            <h3 className="font-semibold text-primary mb-2">Track Money</h3>
            <p className="text-sm text-muted-foreground">Record cash and bKash transactions</p>
          </div>
          <div className="glass-card p-6 rounded-lg">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold text-primary mb-2">Categories</h3>
            <p className="text-sm text-muted-foreground">Organize by transport, food, visits, and more</p>
          </div>
          <div className="glass-card p-6 rounded-lg">
            <div className="text-3xl mb-2">📝</div>
            <h3 className="font-semibold text-primary mb-2">Quick Entry</h3>
            <p className="text-sm text-muted-foreground">Add details faster than typing notes</p>
          </div>
        </div>
      </div>
    </div>
  )
}
