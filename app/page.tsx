import Link from "next/link";

const features = [
  {
    icon: "🔗",
    title: "Paste Any GitHub URL",
    description:
      "Simply paste a public GitHub repository URL and get instant AI-powered analysis of the codebase.",
  },
  {
    icon: "🤖",
    title: "AI-Powered Insights",
    description:
      "Leverages LLMs to understand code structure, tech stack, purpose, and key patterns in any repository.",
  },
  {
    icon: "📊",
    title: "Structured JSON Reports",
    description:
      "Get clean, structured JSON reports with repo stats, language breakdown, and architectural insights.",
  },
  {
    icon: "🔑",
    title: "API Key Management",
    description:
      "Create and manage API keys from your dashboard. Integrate the summarizer into your own workflows.",
  },
  {
    icon: "⚡",
    title: "Fast & Reliable",
    description:
      "Built on Next.js and deployed on Vercel for lightning-fast performance and 99.9% uptime.",
  },
  {
    icon: "🔒",
    title: "Secure by Default",
    description:
      "Authentication powered by Supabase. Your API keys are encrypted and your data stays private.",
  },
];

const steps = [
  { step: "1", title: "Sign Up", description: "Create your free account in seconds." },
  { step: "2", title: "Get Your API Key", description: "Generate an API key from your dashboard." },
  { step: "3", title: "Summarize Repos", description: "Send a GitHub URL, get AI insights back." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-zinc-900 dark:text-white">
            <span className="text-blue-600">Git</span>Summarizer
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/playground"
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
            >
              Playground
            </Link>
            <Link
              href="/api-keys"
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/api-keys"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-20 pb-28">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5" />
        </div>
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
            Powered by AI
          </div>
          <h1 className="text-5xl leading-tight font-extrabold tracking-tight text-zinc-900 sm:text-6xl dark:text-white">
            Understand Any GitHub Repo{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              in Seconds
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Paste a GitHub URL, get AI-powered insights. GitSummarizer analyzes
            repositories and delivers structured reports on tech stack,
            architecture, and code quality.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/playground"
              className="rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/30"
            >
              Try It Now →
            </Link>
            <a
              href="#how-it-works"
              className="rounded-xl border border-zinc-300 px-8 py-3.5 text-base font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              How It Works
            </a>
          </div>

          {/* Demo Preview */}
          <div className="mx-auto mt-16 max-w-2xl overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950 shadow-2xl dark:border-zinc-800">
            <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="h-3 w-3 rounded-full bg-yellow-500" />
              <span className="h-3 w-3 rounded-full bg-green-500" />
              <span className="ml-2 text-xs text-zinc-500">API Response</span>
            </div>
            <pre className="p-6 text-left text-sm leading-relaxed text-green-400">
              <code>{`{
  "repo": "facebook/react",
  "summary": "A declarative, component-based 
    UI library for building user interfaces",
  "tech_stack": ["JavaScript", "TypeScript"],
  "stars": 232000,
  "health_score": 95,
  "ai_insights": [
    "Well-maintained with active contributors",
    "Comprehensive test coverage",
    "Strong documentation practices"
  ]
}`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-200 bg-zinc-50 px-6 py-24 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
              Everything You Need
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              A complete toolkit for understanding GitHub repositories at scale.
            </p>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-2xl dark:bg-blue-950">
                  {f.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-t border-zinc-200 px-6 py-24 dark:border-zinc-800">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
            How It Works
          </h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Get started in three simple steps.
          </p>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.step} className="flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-500/25">
                  {s.step}
                </div>
                <h3 className="mt-5 text-lg font-semibold text-zinc-900 dark:text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-200 bg-zinc-950 px-6 py-24 dark:border-zinc-800">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to Understand Code Faster?
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Join developers who use GitSummarizer to analyze repositories in
            seconds instead of hours.
          </p>
          <Link
            href="/api-keys"
            className="mt-8 inline-block rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 hover:shadow-xl"
          >
            Get Your API Key — Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} GitSummarizer. Built with Next.js,
            Supabase &amp; LangChain.
          </p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link href="/api-keys" className="hover:text-zinc-300">
              Dashboard
            </Link>
            <a href="#how-it-works" className="hover:text-zinc-300">
              How It Works
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
