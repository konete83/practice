import Link from "next/link";
import { getApiKeys } from "./actions";
import { ApiKeysClient } from "./api-keys-client";

export default async function ApiKeysPage() {
  const apiKeys = await getApiKeys();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
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
              href="/playground"
              className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
            >
              Playground
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

      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          API Keys
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Create and manage API keys to authenticate your requests.
        </p>
        <ApiKeysClient initialKeys={apiKeys} />
      </div>
    </div>
  );
}
