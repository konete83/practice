"use client";

import { useState, useEffect, useCallback } from "react";
import { ApiKeysClient } from "./api-keys-client";
import type { ApiKey } from "./api-keys-client";

interface RepoData {
  repo: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
  license: string | null;
  topics: string[];
  created_at: string;
  last_push: string;
  languages: Record<string, number>;
  language_percentages: Record<string, string>;
  top_contributors: {
    username: string;
    avatar: string;
    contributions: number;
  }[];
}

interface ReadmeData {
  repo: string;
  filename: string;
  path: string;
  size_bytes: number;
  url: string;
  download_url: string;
  content: string;
}

interface SavedSummary {
  id: string;
  repo: string;
  github_url: string;
  summary: RepoData;
  created_at: string;
  updated_at: string;
}

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const LANG_COLORS: Record<string, string> = {
  JavaScript: "bg-yellow-400",
  TypeScript: "bg-blue-500",
  Python: "bg-green-500",
  Rust: "bg-orange-600",
  Go: "bg-cyan-500",
  Java: "bg-red-500",
  "C++": "bg-pink-600",
  C: "bg-gray-500",
  Ruby: "bg-red-600",
  PHP: "bg-indigo-500",
  Swift: "bg-orange-500",
  Kotlin: "bg-purple-500",
  CSS: "bg-purple-400",
  HTML: "bg-orange-400",
  Shell: "bg-green-600",
  Dart: "bg-teal-500",
};

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-2xl font-bold text-zinc-900 dark:text-white">
        {value}
      </p>
      <p className="mt-1 text-xs text-zinc-500">{label}</p>
    </div>
  );
}

function RepoReport({
  data,
  githubUrl,
  onSave,
  saving,
}: {
  data: RepoData;
  githubUrl?: string;
  onSave?: () => void;
  saving?: boolean;
}) {
  const topLangs = Object.entries(data.language_percentages).slice(0, 8);

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-bold text-blue-600 hover:underline"
            >
              {data.repo}
            </a>
            {data.description && (
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                {data.description}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {data.license && (
              <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
                {data.license}
              </span>
            )}
            {onSave && (
              <button
                onClick={onSave}
                disabled={saving}
                className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Summary"}
              </button>
            )}
          </div>
        </div>
        {data.topics.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {data.topics.map((t) => (
              <span
                key={t}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Stars" value={formatNumber(data.stars)} />
        <StatCard label="Forks" value={formatNumber(data.forks)} />
        <StatCard label="Open Issues" value={formatNumber(data.open_issues)} />
        <StatCard label="Watchers" value={formatNumber(data.watchers)} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-900 dark:text-white">
            {formatDate(data.created_at)}
          </p>
          <p className="mt-1 text-xs text-zinc-500">Created</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-900 dark:text-white">
            {formatDate(data.last_push)}
          </p>
          <p className="mt-1 text-xs text-zinc-500">Last Push</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-900 dark:text-white">
            {data.default_branch}
          </p>
          <p className="mt-1 text-xs text-zinc-500">Default Branch</p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Languages
        </h3>
        <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          {topLangs.map(([lang, pct]) => (
            <div
              key={lang}
              className={`${LANG_COLORS[lang] || "bg-zinc-400"}`}
              style={{ width: pct }}
              title={`${lang}: ${pct}`}
            />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {topLangs.map(([lang, pct]) => (
            <div key={lang} className="flex items-center gap-2">
              <span
                className={`h-3 w-3 shrink-0 rounded-full ${LANG_COLORS[lang] || "bg-zinc-400"}`}
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">
                {lang}
              </span>
              <span className="text-sm text-zinc-400">{pct}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Top Contributors
        </h3>
        <div className="mt-4 space-y-3">
          {data.top_contributors.map((c, i) => (
            <div key={c.username} className="flex items-center gap-4">
              <span className="w-5 text-center text-sm font-medium text-zinc-400">
                {i + 1}
              </span>
              <img
                src={c.avatar}
                alt={c.username}
                className="h-9 w-9 rounded-full"
              />
              <div className="flex-1">
                <a
                  href={`https://github.com/${c.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-zinc-900 hover:text-blue-600 dark:text-zinc-100"
                >
                  {c.username}
                </a>
              </div>
              <span className="text-sm text-zinc-500">
                {formatNumber(c.contributions)} commits
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReadmeViewer({ data }: { data: ReadmeData }) {
  return (
    <div className="mt-8 space-y-4">
      <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <div>
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-bold text-blue-600 hover:underline"
            >
              {data.repo}
            </a>
            <p className="mt-1 text-xs text-zinc-500">
              {data.filename} &middot; {(data.size_bytes / 1024).toFixed(1)} KB
            </p>
          </div>
          <a
            href={data.download_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            View Raw
          </a>
        </div>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <pre className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
          {data.content}
        </pre>
      </div>
    </div>
  );
}

function ExploreReposTab() {
  const [repoTab, setRepoTab] = useState<"summarize" | "readme">("summarize");
  const [githubUrl, setGithubUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [result, setResult] = useState<RepoData | null>(null);
  const [readmeResult, setReadmeResult] = useState<ReadmeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setReadmeResult(null);
    setSaveMsg(null);
    setLoading(true);

    const endpoint =
      repoTab === "summarize" ? "/api/summarize" : "/api/readme";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ github_url: githubUrl }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Something went wrong");
      } else if (repoTab === "summarize") {
        setResult(json.data as RepoData);
      } else {
        setReadmeResult(json.data as ReadmeData);
      }
    } catch {
      setError("Failed to connect to the API");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveSummary() {
    if (!result) return;
    setSaving(true);
    setSaveMsg(null);

    try {
      const res = await fetch("/api/summaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo: result.repo,
          github_url: githubUrl,
          summary: result,
        }),
      });

      if (res.ok) {
        setSaveMsg("Summary saved! View it in the Saved Summaries tab.");
      } else {
        const json = await res.json();
        setSaveMsg(`Error: ${json.error}`);
      }
    } catch {
      setSaveMsg("Failed to save summary");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <p className="text-zinc-600 dark:text-zinc-400">
        Paste any public GitHub repo URL and your API key to fetch data.
      </p>

      <div className="mt-6 flex gap-1 rounded-lg border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-900">
        <button
          onClick={() => {
            setRepoTab("summarize");
            setResult(null);
            setReadmeResult(null);
            setError(null);
            setSaveMsg(null);
          }}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            repoTab === "summarize"
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          Repo Summary
        </button>
        <button
          onClick={() => {
            setRepoTab("readme");
            setResult(null);
            setReadmeResult(null);
            setError(null);
            setSaveMsg(null);
          }}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            repoTab === "readme"
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          Fetch README
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="github-url"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            GitHub Repository URL
          </label>
          <input
            id="github-url"
            type="url"
            required
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/konete83/practice"
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
          />
        </div>

        <div>
          <label
            htmlFor="api-key"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            API Key
          </label>
          <input
            id="api-key"
            type="text"
            required
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk_your_api_key_here"
            className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 font-mono text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? "Fetching..."
            : repoTab === "summarize"
              ? "Summarize Repository"
              : "Fetch README"}
        </button>
      </form>

      {error && (
        <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
          <p className="text-sm font-medium text-red-700 dark:text-red-300">
            Error: {error}
          </p>
        </div>
      )}

      {saveMsg && (
        <div
          className={`mt-4 rounded-lg border p-3 text-sm font-medium ${
            saveMsg.startsWith("Error")
              ? "border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
              : "border-green-300 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
          }`}
        >
          {saveMsg}
        </div>
      )}

      {result && (
        <RepoReport
          data={result}
          githubUrl={githubUrl}
          onSave={handleSaveSummary}
          saving={saving}
        />
      )}
      {readmeResult && <ReadmeViewer data={readmeResult} />}
    </div>
  );
}

function SavedSummariesTab() {
  const [summaries, setSummaries] = useState<SavedSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const loadSummaries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/summaries");
      const json = await res.json();
      if (res.ok) {
        setSummaries(json.data);
      } else {
        setError(json.error);
      }
    } catch {
      setError("Failed to load summaries");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummaries();
  }, [loadSummaries]);

  async function handleDelete(id: string) {
    const res = await fetch(`/api/summaries/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSummaries((prev) => prev.filter((s) => s.id !== id));
    }
  }

  if (loading) {
    return (
      <div className="py-12 text-center text-zinc-500">
        Loading saved summaries...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
        <p className="text-sm font-medium text-red-700 dark:text-red-300">
          {error}
        </p>
      </div>
    );
  }

  if (summaries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 py-12 text-center dark:border-zinc-700">
        <p className="text-zinc-500">
          No saved summaries yet. Go to Explore Repos, summarize a repo, and
          click &quot;Save Summary&quot;.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {summaries.map((s) => (
        <div
          key={s.id}
          className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="flex items-center justify-between px-5 py-4">
            <div className="min-w-0 flex-1">
              <a
                href={s.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline"
              >
                {s.repo}
              </a>
              <p className="mt-0.5 text-xs text-zinc-400">
                Saved {formatDate(s.created_at)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setExpanded(expanded === s.id ? null : s.id)
                }
                className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                {expanded === s.id ? "Collapse" : "Expand"}
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
              >
                Delete
              </button>
            </div>
          </div>

          {expanded === s.id && (
            <div className="border-t border-zinc-200 px-5 pb-5 dark:border-zinc-800">
              <RepoReport data={s.summary} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function DashboardClient({ initialKeys }: { initialKeys: ApiKey[] }) {
  const [activeTab, setActiveTab] = useState<"keys" | "repos" | "saved">(
    "keys"
  );

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex gap-1 rounded-xl border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-900">
        <button
          onClick={() => setActiveTab("keys")}
          className={`flex-1 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
            activeTab === "keys"
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          Manage API Keys
        </button>
        <button
          onClick={() => setActiveTab("repos")}
          className={`flex-1 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
            activeTab === "repos"
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          Explore Repos
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`flex-1 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
            activeTab === "saved"
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          Saved Summaries
        </button>
      </div>

      <div className="mt-8">
        {activeTab === "keys" && (
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              API Keys
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Create and manage API keys to authenticate your requests.
            </p>
            <ApiKeysClient initialKeys={initialKeys} />
          </div>
        )}
        {activeTab === "repos" && <ExploreReposTab />}
        {activeTab === "saved" && <SavedSummariesTab />}
      </div>
    </div>
  );
}
