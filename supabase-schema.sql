-- Run this in your Supabase Dashboard → SQL Editor

CREATE TABLE api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  name TEXT NOT NULL,
  key TEXT NOT NULL UNIQUE,
  last_used_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true NOT NULL
);
