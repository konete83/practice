import { getApiKeys } from "./actions";
import { ApiKeysClient } from "./api-keys-client";

export default async function ApiKeysPage() {
  const apiKeys = await getApiKeys();

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="mx-auto max-w-3xl">
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
