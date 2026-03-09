# GitSummarizer

A Micro-SaaS application that analyzes any public GitHub repository and returns a structured report with stats, languages, and top contributors.

Built with **Next.js 16**, **Supabase**, and **Tailwind CSS** as part of the Cursor Vibe Coding course.

## Features

- **GitHub Repo Analysis** — Paste any public GitHub URL and get a detailed report
- **API Key Management** — Create, revoke, and delete API keys from the dashboard
- **Interactive Playground** — Test the API directly in the browser with a visual report
- **Landing Page** — Modern SaaS landing page with feature highlights

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 16 | React framework (App Router) |
| TypeScript | Type-safe development |
| Tailwind CSS v4 | Styling |
| Supabase | Authentication & Database |
| GitHub REST API | Repository data fetching |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/cursor_course_naga.git
   cd cursor_course_naga
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Create the `api_keys` table in Supabase SQL Editor:
   ```sql
   CREATE TABLE api_keys (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     key TEXT NOT NULL UNIQUE,
     created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
     last_used_at TIMESTAMPTZ,
     is_active BOOLEAN DEFAULT true NOT NULL
   );
   ```

5. Run the dev server:
   ```bash
   npm run dev
   ```

6. Open [http://127.0.0.1:4000](http://127.0.0.1:4000)

## API Usage

### Summarize a Repository

```bash
POST /api/summarize
Content-Type: application/json

{
  "github_url": "https://github.com/facebook/react",
  "api_key": "sk_your_api_key"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "repo": "facebook/react",
    "description": "The library for web and native user interfaces",
    "stars": 232000,
    "forks": 47000,
    "languages": { "JavaScript": "55.1%", "TypeScript": "30.0%" },
    "top_contributors": [...]
  }
}
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/api-keys` | API key management dashboard |
| `/playground` | Interactive API testing playground |
| `/api/summarize` | API endpoint for repo analysis |

## Author

Built by Nagabhushanam as part of the Cursor Vibe Coding course.

## License

MIT
