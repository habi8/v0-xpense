"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export default function ThemeToggle() {
  const [theme, setTheme] = useState("classic")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Get theme from localStorage on mount
    const savedTheme = localStorage.getItem("xpense-theme") || "classic"
    setTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  function applyTheme(themeName) {
    const html = document.documentElement
    if (themeName === "comfort") {
      html.classList.add("comfort-mode")
    } else {
      html.classList.remove("comfort-mode")
    }
  }

  function handleThemeToggle() {
    const newTheme = theme === "classic" ? "comfort" : "classic"
    setTheme(newTheme)
    localStorage.setItem("xpense-theme", newTheme)
    applyTheme(newTheme)
  }

  if (!mounted) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleThemeToggle}
      className="text-muted-foreground hover:text-foreground hover:bg-secondary/20 transition-colors"
      title={`Switch to ${theme === "classic" ? "Comfort" : "Classic"} Mode`}
    >
      {theme === "classic" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="ml-2 text-xs font-medium hidden sm:inline">
        {theme === "classic" ? "Comfort" : "Classic"}
      </span>
    </Button>
  )
}
