import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function parseGitHubUrl(url: string): { owner: string; repo: string } {
  const match = url
    .replace(/\/+$/, "")
    .match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) throw new Error("Invalid GitHub URL");
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { github_url, api_key } = body;

    if (!github_url || !api_key) {
      return NextResponse.json(
        { error: "Both 'github_url' and 'api_key' are required" },
        { status: 400 }
      );
    }

    // Validate API key
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

    // Fetch README from GitHub API (returns decoded content)
    const readmeRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: { Accept: "application/vnd.github.v3+json" },
      }
    );

    if (!readmeRes.ok) {
      if (readmeRes.status === 404) {
        return NextResponse.json(
          { error: "README not found in this repository" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: `GitHub API error: ${readmeRes.status}` },
        { status: readmeRes.status }
      );
    }

    const readmeData = await readmeRes.json();

    // GitHub API returns base64-encoded content
    const content = Buffer.from(readmeData.content, "base64").toString("utf-8");

    return NextResponse.json({
      success: true,
      data: {
        repo: `${owner}/${repo}`,
        filename: readmeData.name,
        path: readmeData.path,
        size_bytes: readmeData.size,
        url: readmeData.html_url,
        download_url: readmeData.download_url,
        content,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
