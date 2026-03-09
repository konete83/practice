"use client";

import { useState } from "react";
import Link from "next/link";

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
  top_contributors: { username: string; avatar: string; contributions: number }[];
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
      <p className="text-2xl font-bold text-zinc-900 dark:text-white">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{label}</p>
    </div>
  );
}

function RepoReport({ data }: { data: RepoData }) {
  const topLangs = Object.entries(data.language_percentages).slice(0, 8);

  return (
    <div className="mt-8 space-y-6">
      {/* Header */}
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
          {data.license && (
            <span className="shrink-0 rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
              {data.license}
            </span>
          )}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Stars" value={formatNumber(data.stars)} />
        <StatCard label="Forks" value={formatNumber(data.forks)} />
        <StatCard label="Open Issues" value={formatNumber(data.open_issues)} />
        <StatCard label="Watchers" value={formatNumber(data.watchers)} />
      </div>

      {/* Dates */}
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

      {/* Languages */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
          Languages
        </h3>

        {/* Progress bar */}
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

        {/* Legend */}
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

      {/* Top Contributors */}
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

interface ReadmeData {
  repo: string;
  filename: string;
  path: string;
  size_bytes: number;
  url: string;
  download_url: string;
  content: string;
}

function ReadmeViewer({ data }: { data: ReadmeData }) {
  return (
    <div className="mt-8 space-y-4">
      {/* Header */}
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

      {/* README Content */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <pre className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
          {data.content}
        </pre>
      </div>
    </div>
  );
}

export default function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState<"summarize" | "readme">("summarize");
  const [githubUrl, setGithubUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [result, setResult] = useState<RepoData | null>(null);
  const [readmeResult, setReadmeResult] = useState<ReadmeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setReadmeResult(null);
    setLoading(true);

    const endpoint = activeTab === "summarize" ? "/api/summarize" : "/api/readme";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ github_url: githubUrl, api_key: apiKey }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Something went wrong");
      } else if (activeTab === "summarize") {
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

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-zinc-900 dark:text-white">
            <span className="text-blue-600">Git</span>Summarizer
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/api-keys"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          API Playground
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Paste any public GitHub repo URL and your API key to get data.
        </p>

        {/* Tabs */}
        <div className="mt-8 flex gap-1 rounded-lg border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-900">
          <button
            onClick={() => { setActiveTab("summarize"); setResult(null); setReadmeResult(null); setError(null); }}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "summarize"
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            Repo Summary
          </button>
          <button
            onClick={() => { setActiveTab("readme"); setResult(null); setReadmeResult(null); setError(null); }}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "readme"
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
            <p className="mt-1 text-xs text-zinc-500">
              Don&apos;t have a key?{" "}
              <Link href="/api-keys" className="text-blue-600 underline">
                Create one in the Dashboard
              </Link>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Fetching..."
              : activeTab === "summarize"
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

        {result && <RepoReport data={result} />}
        {readmeResult && <ReadmeViewer data={readmeResult} />}
      </div>
    </div>
  );
}
