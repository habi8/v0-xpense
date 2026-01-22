"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [loadingGetStarted, setLoadingGetStarted] = useState(false)
  const [loadingLogin, setLoadingLogin] = useState(false)
  const router = useRouter()

  const handleGetStarted = () => {
    setLoadingGetStarted(true)
    router.push("/auth/signup")
  }

  const handleLogin = () => {
    setLoadingLogin(true)
    router.push("/auth/login")
  }

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
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold min-w-[140px]"
              onClick={handleGetStarted}
              disabled={loadingGetStarted || loadingLogin}
            >
              {loadingGetStarted ? <Loader2 className="h-5 w-5 animate-spin" /> : "Get Started"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent min-w-[140px]"
              onClick={handleLogin}
              disabled={loadingGetStarted || loadingLogin}
            >
              {loadingLogin ? <Loader2 className="h-5 w-5 animate-spin" /> : "Login"}
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
