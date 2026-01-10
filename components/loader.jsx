"use client"

import { Loader2 } from "lucide-react"

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-foreground text-lg font-medium">Processing...</p>
      </div>
    </div>
  )
}
