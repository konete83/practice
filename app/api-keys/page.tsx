import Link from "next/link";
import { getApiKeys } from "./actions";
import { DashboardClient } from "./dashboard-client";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "./sign-out-button";

export default async function ApiKeysPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const apiKeys = await getApiKeys();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-xl font-bold text-zinc-900 dark:text-white"
          >
            <span className="text-blue-600">Git</span>Summarizer
          </Link>
          <div className="flex items-center gap-3">
            {user && (
              <>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {user.email}
                </span>
                <SignOutButton />
              </>
            )}
          </div>
        </div>
      </nav>

      <DashboardClient initialKeys={apiKeys} />
    </div>
  );
}
