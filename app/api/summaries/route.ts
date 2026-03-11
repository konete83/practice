import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { csrfCheck } from "@/lib/csrf";

function isValidGitHubUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && parsed.hostname === "github.com";
  } catch {
    return false;
  }
}

async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

// GET /api/summaries — list all saved summaries for the authenticated user
export async function GET() {
  const { supabase, user } = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("summaries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// POST /api/summaries — save a new summary
export async function POST(request: NextRequest) {
  const csrfError = csrfCheck(request);
  if (csrfError) return csrfError;
  const { supabase, user } = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { repo, github_url, summary } = body;

  if (!repo || !github_url || !summary) {
    return NextResponse.json(
      { error: "repo, github_url, and summary are required" },
      { status: 400 }
    );
  }

  if (!isValidGitHubUrl(github_url)) {
    return NextResponse.json(
      { error: "github_url must be a valid https://github.com URL" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("summaries")
    .insert({ repo, github_url, summary, user_id: user.id })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
