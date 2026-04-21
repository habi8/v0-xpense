import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { getSupabaseServerEnv } from "@/lib/supabase/env"

export async function createClient() {
  const cookieStore = await cookies()
  const { url, key } = getSupabaseServerEnv()

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Ignore if called from Server Component
        }
      },
    },
  })
}
