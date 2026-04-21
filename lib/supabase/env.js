function requireEnv(value, name) {
  if (!value) {
    throw new Error(`Missing required Supabase environment variable: ${name}`)
  }

  return value
}

export function getSupabaseBrowserEnv() {
  return {
    url: requireEnv(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    key: requireEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, "NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  }
}

export function getSupabaseServerEnv() {
  return {
    url: requireEnv(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL, "SUPABASE_URL"),
    key: requireEnv(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.SUPABASE_PUBLISHABLE_KEY ||
        process.env.SUPABASE_ANON_KEY,
      "SUPABASE_PUBLISHABLE_KEY",
    ),
  }
}
