import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { randomBytes } from "crypto";
import { csrfCheck } from "@/lib/csrf";

async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

// GET /api/keys — list all API keys for the authenticated user
export async function GET() {
  const { supabase, user } = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("api_keys")
    .select("id, name, key, created_at, last_used_at, is_active")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// POST /api/keys — create a new API key
export async function POST(request: NextRequest) {
  const csrfError = csrfCheck(request);
  if (csrfError) return csrfError;
  const { supabase, user } = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const name = body.name?.trim();

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const key = `sk_${randomBytes(32).toString("hex")}`;

  const { data, error } = await supabase
    .from("api_keys")
    .insert({ name, key, user_id: user.id })
    .select("id, name, key, created_at, last_used_at, is_active")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
