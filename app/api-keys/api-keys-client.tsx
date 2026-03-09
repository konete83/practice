"use client";

import { useState } from "react";

export type ApiKey = {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used_at: string | null;
  is_active: boolean;
};

function maskKey(key: string) {
  return key.slice(0, 7) + "••••••••" + key.slice(-4);
}

function CreateKeyForm({ onCreated }: { onCreated: (key: ApiKey) => void }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Failed to create key");
        return;
      }

      onCreated(json.data);
      setName("");
    } catch {
      setError("Failed to connect to the API");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex gap-3">
      <input
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Key name (e.g. Production, Development)"
        className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Creating…" : "Create Key"}
      </button>
      {error && <p className="self-center text-sm text-red-500">{error}</p>}
    </form>
  );
}

function NewKeyBanner({
  fullKey,
  onDismiss,
}: {
  fullKey: string;
  onDismiss: () => void;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="mt-6 rounded-lg border border-green-300 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
      <p className="text-sm font-medium text-green-800 dark:text-green-300">
        Your new API key has been created. Copy it now — you won&apos;t see it
        again.
      </p>
      <div className="mt-3 flex items-center gap-2">
        <code className="flex-1 rounded bg-white px-3 py-2 font-mono text-sm text-zinc-900 select-all dark:bg-zinc-900 dark:text-zinc-100">
          {fullKey}
        </code>
        <button
          onClick={() => {
            navigator.clipboard.writeText(fullKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          onClick={onDismiss}
          className="rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:hover:text-zinc-300"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

function KeyRow({
  apiKey,
  onDelete,
  onToggle,
}: {
  apiKey: ApiKey;
  onDelete: (id: string) => void;
  onToggle: (id: string, active: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      const res = await fetch(`/api/keys/${apiKey.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !apiKey.is_active }),
      });
      if (res.ok) onToggle(apiKey.id, !apiKey.is_active);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/keys/${apiKey.id}`, { method: "DELETE" });
      if (res.ok) onDelete(apiKey.id);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white px-5 py-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium text-zinc-900 dark:text-zinc-100">
            {apiKey.name}
          </p>
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
              apiKey.is_active
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
            }`}
          >
            {apiKey.is_active ? "Active" : "Revoked"}
          </span>
        </div>
        <p className="mt-1 font-mono text-sm text-zinc-500">
          {maskKey(apiKey.key)}
        </p>
        <p className="mt-0.5 text-xs text-zinc-400">
          Created {new Date(apiKey.created_at).toLocaleDateString()}
          {apiKey.last_used_at &&
            ` · Last used ${new Date(apiKey.last_used_at).toLocaleDateString()}`}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            navigator.clipboard.writeText(apiKey.key);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          disabled={loading}
          onClick={handleToggle}
          className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          {apiKey.is_active ? "Revoke" : "Activate"}
        </button>

        {showConfirm ? (
          <div className="flex gap-1">
            <button
              disabled={loading}
              onClick={handleDelete}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              Confirm
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-700"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export function ApiKeysClient({ initialKeys }: { initialKeys: ApiKey[] }) {
  const [keys, setKeys] = useState(initialKeys);
  const [newFullKey, setNewFullKey] = useState<string | null>(null);

  return (
    <>
      <CreateKeyForm
        onCreated={(created) => {
          setKeys((prev) => [created, ...prev]);
          setNewFullKey(created.key);
        }}
      />

      {newFullKey && (
        <NewKeyBanner
          fullKey={newFullKey}
          onDismiss={() => setNewFullKey(null)}
        />
      )}

      <div className="mt-8 space-y-3">
        {keys.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-300 py-12 text-center dark:border-zinc-700">
            <p className="text-zinc-500">No API keys yet. Create one above.</p>
          </div>
        ) : (
          keys.map((k) => (
            <KeyRow
              key={k.id}
              apiKey={k}
              onDelete={(id) =>
                setKeys((prev) => prev.filter((x) => x.id !== id))
              }
              onToggle={(id, active) =>
                setKeys((prev) =>
                  prev.map((x) =>
                    x.id === id ? { ...x, is_active: active } : x
                  )
                )
              }
            />
          ))
        )}
      </div>
    </>
  );
}
