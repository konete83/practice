import Link from "next/link";

export default function TermsOfService() {
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
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="mt-10 space-y-8 text-zinc-700 dark:text-zinc-300">
          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              1. Acceptance of Terms
            </h2>
            <p className="mt-3 leading-relaxed">
              By accessing and using GitSummarizer, you agree to be bound by
              these Terms of Service. If you do not agree, please do not use the
              service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              2. Description of Service
            </h2>
            <p className="mt-3 leading-relaxed">
              GitSummarizer provides tools to analyze public GitHub repositories,
              including repository summaries, language breakdowns, contributor
              information, and README retrieval via API keys.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              3. User Responsibilities
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed">
              <li>Keep your API keys confidential and secure</li>
              <li>Do not use the service for any illegal or unauthorized purpose</li>
              <li>Do not abuse the GitHub API rate limits through our service</li>
              <li>You are responsible for all activity under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              4. API Usage
            </h2>
            <p className="mt-3 leading-relaxed">
              API keys are provided for legitimate use of the GitSummarizer
              service. We reserve the right to revoke API keys that are used in
              an abusive or unauthorized manner.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              5. Limitation of Liability
            </h2>
            <p className="mt-3 leading-relaxed">
              GitSummarizer is provided &quot;as is&quot; without warranties of
              any kind. We are not liable for any damages arising from the use
              or inability to use the service, including data loss or service
              interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              6. Changes to Terms
            </h2>
            <p className="mt-3 leading-relaxed">
              We may update these terms at any time. Continued use of the
              service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              7. Contact
            </h2>
            <p className="mt-3 leading-relaxed">
              For questions about these terms, contact us at{" "}
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
