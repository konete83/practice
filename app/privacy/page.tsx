import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <nav className="border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-xl font-bold text-zinc-900 dark:text-white"
          >
            <span className="text-blue-600">Git</span>Summarizer
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="mt-10 space-y-8 text-zinc-700 dark:text-zinc-300">
          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              1. Information We Collect
            </h2>
            <p className="mt-3 leading-relaxed">
              When you sign in with Google, we receive and store your{" "}
              <strong>email address</strong> and <strong>display name</strong>{" "}
              from your Google account. We do not access your contacts, Google
              Drive, calendar, or any other Google services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              2. How We Use Your Information
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
              <li>To authenticate you and manage your account</li>
              <li>To associate API keys with your account</li>
              <li>To save your repository summaries</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              3. Data Storage
            </h2>
            <p className="mt-3 leading-relaxed">
              Your data is stored securely in Supabase (hosted on AWS). We store
              your email address, API keys you create, and any repository
              summaries you save. We do not store your Google password.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              4. Data Sharing
            </h2>
            <p className="mt-3 leading-relaxed">
              We do not sell, trade, or share your personal information with
              third parties. Your data is only used to provide the GitSummarizer
              service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              5. Data Deletion
            </h2>
            <p className="mt-3 leading-relaxed">
              You can delete your API keys and saved summaries at any time from
              the dashboard. To request complete account deletion, contact us at
              the email below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              6. Cookies
            </h2>
            <p className="mt-3 leading-relaxed">
              We use essential cookies only to maintain your authentication
              session. We do not use tracking cookies or third-party analytics.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              7. Contact
            </h2>
            <p className="mt-3 leading-relaxed">
              If you have questions about this privacy policy, please contact us
              at{" "}
              <a
                href="mailto:konete83@gmail.com"
                className="text-blue-600 underline"
              >
                konete83@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
