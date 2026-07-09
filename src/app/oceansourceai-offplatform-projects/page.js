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

const HERO_HIGHLIGHTS = [
  { label: "Fully remote micro-projects", tone: "bg-white text-slate-700" },
  { label: "Earn up to $48.00/hr", tone: "bg-sky-100 text-sky-800" },
  { label: "No security deposit", tone: "bg-white text-slate-700" },
];

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

function LocationBadges() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
        Europe
      </span>
      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
        USA
      </span>
    </div>
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
    <div className="relative min-h-screen w-full overflow-x-hidden bg-sky-50/50 px-[15%] py-12">
      <div
        className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-sky-200/50 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 top-24 h-[28rem] w-[28rem] rounded-full bg-cyan-100/60 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-100/70 blur-3xl"
        aria-hidden="true"
      />

      <main className="relative w-full">
        <header className="sticky top-0 z-50 mb-14 flex flex-col gap-6 py-4 backdrop-blur-md bg-sky-50/80 lg:flex-row lg:items-center lg:justify-between">
          <BrandLogo className="h-[80px] w-auto object-contain" />
          <div className="flex flex-col items-start gap-2 lg:items-end">
            <span className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-sky-600 shadow-sm">
              Partner Workspace Portal
            </span>
            <p className="max-w-md text-sm leading-relaxed text-slate-500 lg:text-right">
              Premium AI training contracts · Remote-first · Apply in minutes
            </p>
          </div>
        </header>

        <section className="mb-14 space-y-8">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-600">
              Careers Portal
            </p>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl md:leading-[1.05]">
                Build better AI with{" "}
                <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
                  flexible remote work
                </span>
              </h1>
              <p className="max-w-3xl text-lg leading-relaxed text-slate-600 md:text-xl">
                Select from our list of active, flexible, and fully remote micro-projects. Earn up to
                $48.00/hr completing annotation, fact-checking, and evaluation workloads. Please note
                that these projects are completed off our official platform, OceanSourceAI, require
                absolutely no security deposit, and allow you to work on your own schedule from
                anywhere.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {HERO_HIGHLIGHTS.map((item) => (
                <span
                  key={item.label}
                  className={`rounded-full px-4 py-2 text-sm font-medium shadow-sm ${item.tone}`}
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white/90 p-6 shadow-sm backdrop-blur-sm md:p-8">
            <div className="relative mb-5">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
                <SearchIcon />
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search roles by title, skill, or keyword..."
                className="w-full rounded-2xl bg-sky-50/70 py-4 pl-12 pr-4 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-sky-400"
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
                        : "bg-sky-50 text-slate-600 shadow-sm hover:bg-sky-100 hover:text-sky-700"
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mb-10 space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">Open Positions</h2>
          <p className="text-sm text-slate-500">
            Discover remote evaluation tracks designed for contributors across Europe and the USA.
          </p>
        </section>

        {filteredJobs.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm">
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
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
            {filteredJobs.map((job) => (
              <article
                key={job.id}
                className="group flex flex-col rounded-3xl bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:bg-sky-50/40 hover:shadow-lg"
              >
                <div className="mb-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        job.isOffPlatform
                          ? "bg-sky-100 text-sky-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {job.isOffPlatform ? "Off-Platform" : "Native Workspace"}
                    </span>
                    <span className="rounded-full bg-sky-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                      {job.hourlyRate}
                    </span>
                  </div>

                  <LocationBadges />
                </div>

                <h3 className="mb-3 text-xl font-bold leading-snug text-slate-900 transition group-hover:text-sky-700">
                  {job.title}
                </h3>

                <p className="mb-8 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
                  {job.overview}
                </p>

                <Link
                  href={`/oceansourceai-offplatform-projects/${job.id}`}
                  className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-5 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-sky-600 hover:shadow-lg"
                >
                  View & Apply
                </Link>
              </article>
            ))}
          </div>
        )}

        <footer className="mt-20 pb-4 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} OceanSource AI · Remote AI Training Opportunities
          </p>
        </footer>
      </main>
    </div>
  );
}
