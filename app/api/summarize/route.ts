import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parseGitHubUrl, fetchGitHubReport } from "@/lib/github";
import { rateLimit } from "@/lib/rate-limit";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const { allowed } = rateLimit(`summarize:${ip}`, 10, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { github_url, api_key } = body;

    if (!github_url || !api_key) {
      return NextResponse.json(
        { error: "Both 'github_url' and 'api_key' are required" },
        { status: 400 }
      );
    }

    // Validate API key
    const supabase = getSupabase();
    const { data: keyRecord, error: keyError } = await supabase
      .from("api_keys")
      .select("id, is_active")
      .eq("key", api_key)
      .single();

    if (keyError || !keyRecord) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    if (!keyRecord.is_active) {
      return NextResponse.json(
        { error: "API key has been revoked" },
        { status: 401 }
      );
    }

    // Update last_used_at
    await supabase
      .from("api_keys")
      .update({ last_used_at: new Date().toISOString() })
      .eq("id", keyRecord.id);

    // Parse GitHub URL
    let owner: string, repo: string;
    try {
      ({ owner, repo } = parseGitHubUrl(github_url));
    } catch {
      return NextResponse.json(
        { error: "Invalid GitHub URL. Expected format: https://github.com/owner/repo" },
        { status: 400 }
      );
    }

    // Fetch GitHub data
    const report = await fetchGitHubReport(owner, repo);

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("not found")
      ? 404
      : message.includes("rate limit")
        ? 429
        : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
