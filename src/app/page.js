"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { jobsList } from "@/jobsData";
import BrandLogo from "@/components/BrandLogo";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "generalist", label: "Generalist & Safety" },
  { id: "stem", label: "STEM & Reasoning" },
  { id: "language", label: "Language & Writing" },
  { id: "media", label: "Media & Auditing" },
];

const JOB_CATEGORIES = {
  "ai-data-evaluator": "generalist",
  "fact-checker": "generalist",
  "safety-red-teamer": "generalist",
  "search-relevance-rater": "generalist",
  "logic-math-grader": "stem",
  "code-correction-grader": "stem",
  "medical-info-verifier": "stem",
  "legal-contract-verifier": "stem",
  "creative-evaluator": "language",
  "translation-auditor": "language",
  "audio-transcriber": "language",
  "prompt-fidelity-evaluator": "media",
  "image-alt-writer": "media",
  "video-segmentation-tagger": "media",
  "ui-layout-evaluator": "media",
};

const openRoles = Object.entries(jobsList).map(([id, job]) => ({
  id,
  category: JOB_CATEGORIES[id] ?? "generalist",
  ...job,
}));

function SearchIcon() {
  return (
    <svg
      className="h-5 w-5 text-slate-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
      />
    </svg>
  );
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredJobs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return openRoles.filter((job) => {
      const matchesFilter = activeFilter === "all" || job.category === activeFilter;
      const matchesSearch =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.overview.toLowerCase().includes(query) ||
        job.hourlyRate.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [searchQuery, activeFilter]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-sky-50/50 px-[15%] py-10">
      <div
        className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 top-40 h-80 w-80 rounded-full bg-cyan-100/50 blur-3xl"
        aria-hidden="true"
      />

      <main className="relative w-full">
        <header className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <BrandLogo className="h-[80px] w-auto object-contain" />
          <p className="max-w-md text-sm leading-relaxed text-slate-500 lg:text-right">
            Premium AI training contracts · Remote-first · Apply in minutes
          </p>
        </header>

        <section className="mb-12 space-y-6">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
              Careers Portal
            </p>
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
              Shape the next generation of{" "}
              <span className="bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent">
                intelligent systems
              </span>
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-slate-600">
              Select from our list of active, flexible, and fully remote micro-projects. Earn up to
              $48.00/hr completing annotation, fact-checking, and evaluation workloads. Please note
              that these projects are completed off our official platform, OceanSourceAI, require
              absolutely no security deposit, and allow you to work on your own schedule from
              anywhere.
            </p>
          </div>

          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
              <SearchIcon />
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search roles by title, skill, or keyword..."
              className="w-full rounded-2xl bg-white py-4 pl-12 pr-4 text-sm text-slate-800 shadow-md outline-none transition placeholder:text-slate-400 focus:ring-2 focus:ring-sky-400"
              aria-label="Search open roles"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter.id;

              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-sky-500 text-white shadow-md shadow-sky-200"
                      : "bg-white text-slate-600 shadow-sm hover:bg-sky-50 hover:text-sky-700"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Open Positions</h2>
        </section>

        {filteredJobs.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-800">No roles match your search</p>
            <p className="mt-2 text-sm text-slate-500">
              Try a different keyword or reset your category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
              }}
              className="mt-6 rounded-xl bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-sky-600"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredJobs.map((job) => (
              <article
                key={job.id}
                className="group flex flex-col rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      job.isOffPlatform
                        ? "bg-sky-100 text-sky-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {job.isOffPlatform ? "Off-Platform" : "Native Workspace"}
                  </span>
                  <span className="text-sm font-bold text-sky-600">{job.hourlyRate}</span>
                </div>

                <h3 className="mb-3 text-lg font-bold leading-snug text-slate-900 group-hover:text-sky-700">
                  {job.title}
                </h3>

                <p className="mb-6 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
                  {job.overview}
                </p>

                <Link
                  href={`/jobs/${job.id}`}
                  className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-sky-600"
                >
                  View & Apply
                </Link>
              </article>
            ))}
          </div>
        )}

        <footer className="mt-16 pb-6 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} OceanSource AI · Remote AI Training Opportunities
          </p>
        </footer>
      </main>
    </div>
  );
}
