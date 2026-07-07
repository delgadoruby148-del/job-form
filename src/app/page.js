import Link from "next/link";
import { jobsList } from "@/jobsData";

export default function Home() {
  const openRoles = Object.entries(jobsList).map(([id, job]) => ({ id, ...job }));

  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-12 dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950">
      <main className="w-full max-w-3xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Careers
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            OceanSource AI
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Join our remote team and help build high-quality AI and data operations. Browse open
            roles below and apply to the position that fits your skills.
          </p>
        </div>

        <div className="space-y-4">
          {openRoles.map((job) => (
            <article
              key={job.id}
              className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/50 transition hover:border-indigo-200 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none dark:hover:border-indigo-900"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                    {job.title}
                  </h2>
                  <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {job.hourlyRate}
                  </p>
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {job.overview}
                  </p>
                </div>
                <Link
                  href={`/jobs/${job.id}`}
                  className="inline-flex shrink-0 items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  View & Apply
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
