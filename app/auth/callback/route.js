import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")
  const error_description = searchParams.get("error_description")

  if (error) {
    console.error("[v0] OAuth error:", error, error_description)
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(error_description || error)}`, request.url),
    )
  }

  if (code) {
    try {
      const supabase = createClient()
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error("[v0] Exchange code error:", exchangeError)
        return NextResponse.redirect(
          new URL(`/auth/login?error=${encodeURIComponent(exchangeError.message)}`, request.url),
        )
      }

      return NextResponse.redirect(new URL("/dashboard", request.url))
    } catch (err) {
      console.error("[v0] Callback error:", err)
      return NextResponse.redirect(new URL(`/auth/login?error=${encodeURIComponent(err.message)}`, request.url))
    }
  }

  return NextResponse.redirect(new URL("/auth/login", request.url))
}
