import Link from "next/link";
import { jobsList } from "@/jobsData";

export default function Home() {
  const openRoles = Object.entries(jobsList).map(([id, job]) => ({ id, ...job }));

  return (
    <div className="flex flex-1 flex-col bg-sky-50 w-full px-[15%] py-12">
      <main className="w-full">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">
            Careers
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
            OceanSource AI
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Join our remote team and help build high-quality AI and data operations. Browse open
            roles below and apply to the position that fits your skills.
          </p>
        </div>

        <div className="space-y-4">
          {openRoles.map((job) => (
            <article
              key={job.id}
              className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm shadow-sky-100/50 transition hover:border-sky-200 hover:shadow-md"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-slate-900">{job.title}</h2>
                  <p className="text-sm font-medium text-sky-600">{job.hourlyRate}</p>
                  <p className="text-sm leading-relaxed text-slate-600">{job.overview}</p>
                </div>
                <Link
                  href={`/jobs/${job.id}`}
                  className="inline-flex shrink-0 items-center justify-center rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
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
