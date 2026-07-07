"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { jobsList } from "@/jobsData";

const MAX_FILE_SIZE = 500 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const ALLOWED_EXTENSIONS = [".pdf", ".docx"];
const STORAGE_BUCKET = "oceansourceai-application-form";

const COUNTRIES = [
  { name: "United States", dialCode: "+1" },
  { name: "United Kingdom", dialCode: "+44" },
  { name: "Canada", dialCode: "+1" },
  { name: "Australia", dialCode: "+61" },
  { name: "India", dialCode: "+91" },
  { name: "Germany", dialCode: "+49" },
  { name: "France", dialCode: "+33" },
  { name: "Philippines", dialCode: "+63" },
  { name: "Pakistan", dialCode: "+92" },
  { name: "Nigeria", dialCode: "+234" },
  { name: "South Africa", dialCode: "+27" },
  { name: "Mexico", dialCode: "+52" },
  { name: "Brazil", dialCode: "+55" },
  { name: "Spain", dialCode: "+34" },
  { name: "Italy", dialCode: "+39" },
  { name: "Netherlands", dialCode: "+31" },
  { name: "Ireland", dialCode: "+353" },
  { name: "New Zealand", dialCode: "+64" },
  { name: "Singapore", dialCode: "+65" },
  { name: "United Arab Emirates", dialCode: "+971" },
  { name: "Kenya", dialCode: "+254" },
  { name: "Ghana", dialCode: "+233" },
  { name: "Bangladesh", dialCode: "+880" },
  { name: "Indonesia", dialCode: "+62" },
  { name: "Malaysia", dialCode: "+60" },
  { name: "Poland", dialCode: "+48" },
  { name: "Portugal", dialCode: "+351" },
  { name: "Romania", dialCode: "+40" },
  { name: "Sweden", dialCode: "+46" },
  { name: "Switzerland", dialCode: "+41" },
  { name: "Turkey", dialCode: "+90" },
  { name: "Ukraine", dialCode: "+380" },
  { name: "Vietnam", dialCode: "+84" },
  { name: "Argentina", dialCode: "+54" },
  { name: "Colombia", dialCode: "+57" },
  { name: "Egypt", dialCode: "+20" },
  { name: "Israel", dialCode: "+972" },
  { name: "Japan", dialCode: "+81" },
  { name: "South Korea", dialCode: "+82" },
  { name: "China", dialCode: "+86" },
];

const fieldClassName =
  "w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-indigo-400";

function applyDialCodePrefix(currentPhone, previousDialCode, newDialCode) {
  let localNumber = currentPhone.trim();

  if (previousDialCode && localNumber.startsWith(previousDialCode)) {
    localNumber = localNumber.slice(previousDialCode.length).trimStart();
  } else {
    localNumber = localNumber.replace(/^\+\d{1,4}\s*/, "");
  }

  return localNumber ? `${newDialCode} ${localNumber}` : `${newDialCode} `;
}

function validateCvFile(file) {
  if (!file) {
    return "Please upload your CV.";
  }

  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return "CV must be a PDF or DOCX file.";
  }

  if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
    return "CV must be a PDF or DOCX file.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "CV must be smaller than 500KB.";
  }

  return null;
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function JobDetailSection({ title, children }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
      <div className="whitespace-pre-line text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {children}
      </div>
    </section>
  );
}

export default function JobApplicationPage() {
  const params = useParams();
  const jobId = params.jobId;
  const job = jobsList[jobId] ?? null;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [explanation, setExplanation] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  function handleCountryChange(event) {
    const countryName = event.target.value;
    const selectedCountry = COUNTRIES.find((entry) => entry.name === countryName);
    const previousCountry = COUNTRIES.find((entry) => entry.name === country);

    setCountry(countryName);

    if (selectedCountry) {
      setPhone(
        applyDialCodePrefix(phone, previousCountry?.dialCode ?? null, selectedCountry.dialCode),
      );
    }
  }

  if (!job) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-12 dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950">
        <main className="w-full max-w-lg text-center">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Job not found</h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            This role may no longer be available.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Back to home
          </Link>
        </main>
      </div>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const fileError = validateCvFile(cvFile);
    if (fileError) {
      setStatus("error");
      setMessage(fileError);
      return;
    }

    try {
      const extension = cvFile.name.slice(cvFile.name.lastIndexOf(".")).toLowerCase();
      const storagePath = `${Date.now()}-${crypto.randomUUID()}${extension}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, cvFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: cvFile.type || undefined,
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(uploadData.path);

      const { error: insertError } = await supabase.from("applicants").insert({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        country: country.trim(),
        cv_url: publicUrl,
        explanation: explanation.trim(),
        job_id: jobId,
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setStatus("success");
      setMessage("Application submitted successfully. We'll be in touch soon.");
      setFullName("");
      setEmail("");
      setCountry("");
      setPhone("");
      setExplanation("");
      setCvFile(null);
      event.target.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-12 dark:from-zinc-950 dark:via-zinc-900 dark:to-indigo-950">
      <main className="w-full max-w-2xl">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            ← Back to open roles
          </Link>
          <div className="mt-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              OceanSource AI
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {job.title}
            </h1>
            <p className="mt-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
              {job.hourlyRate}
            </p>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              Review the role details below, then submit your application.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
            <div className="space-y-8">
              <JobDetailSection title="Project Overview">{job.overview}</JobDetailSection>
              <JobDetailSection title="Workflow">
                <ol className="list-decimal space-y-2 pl-5">
                  {job.workflow.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </JobDetailSection>
              <JobDetailSection title="Minimum Requirements">
                <ul className="list-disc space-y-2 pl-5">
                  {job.requirements.map((requirement) => (
                    <li key={requirement}>{requirement}</li>
                  ))}
                </ul>
              </JobDetailSection>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
            {message && (
              <div
                role="alert"
                className={`mb-6 rounded-xl px-4 py-3 text-sm ${
                  status === "success"
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300"
                    : "border border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Jane Doe"
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-indigo-400"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="jane@example.com"
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-indigo-400"
                />
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  required
                  value={country}
                  onChange={handleCountryChange}
                  className={fieldClassName}
                >
                  <option value="" disabled>
                    Select your country
                  </option>
                  {COUNTRIES.map((entry) => (
                    <option key={entry.name} value={entry.name}>
                      {entry.name} ({entry.dialCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className={fieldClassName}
                />
              </div>

              <div>
                <label
                  htmlFor="explanation"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Please give a brief explanation into why you fit for this specific job
                </label>
                <textarea
                  id="explanation"
                  name="explanation"
                  required
                  rows={5}
                  value={explanation}
                  onChange={(event) => setExplanation(event.target.value)}
                  placeholder="Tell us about your relevant experience, attention to detail, and availability for this role."
                  className="w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:focus:border-indigo-400"
                />
              </div>

              <div>
                <label
                  htmlFor="cv"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  CV (PDF or DOCX, max 500KB)
                </label>
                <input
                  id="cv"
                  name="cv"
                  type="file"
                  required
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(event) => setCvFile(event.target.files?.[0] ?? null)}
                  className="w-full rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-indigo-500 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400"
                />
                {cvFile && (
                  <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                    Selected: {cvFile.name} ({Math.round(cvFile.size / 1024)} KB)
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "loading" ? (
                  <>
                    <Spinner />
                    Submitting…
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
