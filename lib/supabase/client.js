import { createBrowserClient } from "@supabase/ssr"
import { getSupabaseBrowserEnv } from "@/lib/supabase/env"

export function createClient() {
  const { url, key } = getSupabaseBrowserEnv()

  return createBrowserClient(url, key)
}
