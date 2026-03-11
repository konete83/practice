import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const ALLOWED_REDIRECTS = ["/api-keys", "/"];

function getSafeRedirect(next: string | null): string {
  if (!next) return "/api-keys";
  if (next.includes("//") || next.includes("@") || !next.startsWith("/")) {
    return "/api-keys";
  }
  if (ALLOWED_REDIRECTS.includes(next)) return next;
  return "/api-keys";
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeRedirect(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Could+not+authenticate`);
}
