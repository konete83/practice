"use server";

import { createClient } from "@/lib/supabase/server";
import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";

export type ApiKey = {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used_at: string | null;
  is_active: boolean;
};

function generateApiKey(): string {
  return `sk_${randomBytes(32).toString("hex")}`;
}

export async function getApiKeys(): Promise<ApiKey[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("api_keys")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createApiKey(
  formData: FormData
): Promise<{ key: string } | { error: string }> {
  const name = formData.get("name") as string;
  if (!name?.trim()) return { error: "Name is required" };

  const supabase = await createClient();
  const key = generateApiKey();
  const { error } = await supabase
    .from("api_keys")
    .insert({ name: name.trim(), key });

  if (error) return { error: error.message };

  revalidatePath("/api-keys");
  return { key };
}

export async function toggleApiKey(
  id: string,
  is_active: boolean
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("api_keys")
    .update({ is_active })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/api-keys");
  return {};
}

export async function deleteApiKey(id: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("api_keys").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/api-keys");
  return {};
}
