import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isValidUUID, invalidIdResponse } from "@/lib/validate";
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

// GET /api/summaries/:id — get a single saved summary
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!isValidUUID(id)) return invalidIdResponse();
  const { supabase, user } = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("summaries")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Summary not found" }, { status: 404 });
  }

  return NextResponse.json({ data });
}

// PATCH /api/summaries/:id — update a saved summary
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const csrfError = csrfCheck(request);
  if (csrfError) return csrfError;
  const { id } = await params;
  if (!isValidUUID(id)) return invalidIdResponse();
  const { supabase, user } = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const updates: Record<string, unknown> = {};

  if (body.repo) updates.repo = body.repo;
  if (body.github_url) {
    if (!isValidGitHubUrl(body.github_url)) {
      return NextResponse.json(
        { error: "github_url must be a valid https://github.com URL" },
        { status: 400 }
      );
    }
    updates.github_url = body.github_url;
  }
  if (body.summary) updates.summary = body.summary;
  updates.updated_at = new Date().toISOString();

  if (Object.keys(updates).length <= 1) {
    return NextResponse.json(
      { error: "No valid fields to update. Allowed: repo, github_url, summary" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("summaries")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Summary not found" }, { status: 404 });
  }

  return NextResponse.json({ data });
}

// DELETE /api/summaries/:id — delete a saved summary
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const csrfError = csrfCheck(request);
  if (csrfError) return csrfError;
  const { id } = await params;
  if (!isValidUUID(id)) return invalidIdResponse();
  const { supabase, user } = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { error } = await supabase
    .from("summaries")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Summary deleted" });
}
