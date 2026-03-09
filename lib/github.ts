const GITHUB_API = "https://api.github.com";

export function parseGitHubUrl(url: string): { owner: string; repo: string } {
  const match = url
    .replace(/\/+$/, "")
    .match(/github\.com\/([^/]+)\/([^/]+)/);

  if (!match) throw new Error("Invalid GitHub URL");
  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

async function githubFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: { Accept: "application/vnd.github.v3+json" },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    if (res.status === 404) throw new Error("Repository not found");
    if (res.status === 403) throw new Error("GitHub API rate limit exceeded");
    throw new Error(`GitHub API error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

interface RepoMeta {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  default_branch: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  license: { name: string } | null;
  topics: string[];
}

interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
}

export interface GitHubReport {
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

export async function fetchGitHubReport(
  owner: string,
  repo: string
): Promise<GitHubReport> {
  const [meta, languages, contributors] = await Promise.all([
    githubFetch<RepoMeta>(`/repos/${owner}/${repo}`),
    githubFetch<Record<string, number>>(`/repos/${owner}/${repo}/languages`),
    githubFetch<Contributor[]>(
      `/repos/${owner}/${repo}/contributors?per_page=5`
    ),
  ]);

  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
  const languagePercentages: Record<string, string> = {};
  for (const [lang, bytes] of Object.entries(languages)) {
    languagePercentages[lang] = ((bytes / totalBytes) * 100).toFixed(1) + "%";
  }

  return {
    repo: meta.full_name,
    description: meta.description,
    url: meta.html_url,
    stars: meta.stargazers_count,
    forks: meta.forks_count,
    open_issues: meta.open_issues_count,
    watchers: meta.watchers_count,
    default_branch: meta.default_branch,
    license: meta.license?.name ?? null,
    topics: meta.topics ?? [],
    created_at: meta.created_at,
    last_push: meta.pushed_at,
    languages,
    language_percentages: languagePercentages,
    top_contributors: contributors.map((c) => ({
      username: c.login,
      avatar: c.avatar_url,
      contributions: c.contributions,
    })),
  };
}
