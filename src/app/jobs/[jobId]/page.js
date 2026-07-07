"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { jobsList } from "@/jobsData";
import { countriesList } from "@/countriesData";

const MAX_FILE_SIZE = 500 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const ALLOWED_EXTENSIONS = [".pdf", ".docx"];
const STORAGE_BUCKET = "oceansourceai-application-form";

const fieldClassName =
  "w-full rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20";

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
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="whitespace-pre-line text-sm leading-relaxed text-slate-600">{children}</div>
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

  const selectedCountry = countriesList.find((entry) => entry.name === country) ?? null;

  function handleCountryChange(event) {
    const countryName = event.target.value;
    const nextCountry = countriesList.find((entry) => entry.name === countryName);

    setCountry(countryName);

    if (nextCountry) {
      setPhone(applyDialCodePrefix(phone, selectedCountry?.dialCode ?? null, nextCountry.dialCode));
    }
  }

  if (!job) {
    return (
      <div className="flex flex-1 flex-col bg-sky-50 w-full px-[15%] py-12">
        <main className="w-full text-center">
          <h1 className="text-2xl font-bold text-slate-900">Job not found</h1>
          <p className="mt-3 text-slate-600">This role may no longer be available.</p>
          <Link
            href="/"
            className="mt-6 inline-block text-sm font-medium text-sky-600 hover:text-sky-700"
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
    <div className="flex flex-1 flex-col bg-sky-50 w-full px-[15%] py-12">
      <main className="w-full">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            ← Back to open roles
          </Link>
          <div className="mt-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-600">
              OceanSource AI
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {job.title}
            </h1>
            <p className="mt-2 text-sm font-medium text-sky-600">{job.hourlyRate}</p>
            <p className="mt-3 text-slate-600">
              Review the role details below, then submit your application.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-sky-100 bg-white p-8 shadow-sm shadow-sky-100/50">
            {job.isOffPlatform && (
              <div
                role="status"
                className="mb-8 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-relaxed text-sky-900"
              >
                <span className="font-semibold">🌐 Off-Platform Notice:</span> This project is
                managed off-platform. While your application is processed directly by OceanSourceAI,
                the training tasks and operations will be completed outside the OceanSourceAI
                website on secure client workspace systems.
              </div>
            )}
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

          <div className="rounded-2xl border border-sky-100 bg-white p-8 shadow-sm shadow-sky-100/50">
            {message && (
              <div
                role="alert"
                className={`mb-6 rounded-xl px-4 py-3 text-sm ${
                  status === "success"
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border border-red-200 bg-red-50 text-red-800"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
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
                  className={fieldClassName}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
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
                  className={fieldClassName}
                />
              </div>

              <div>
                <label
                  htmlFor="country"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
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
                  {countriesList.map((entry) => (
                    <option key={entry.code} value={entry.name}>
                      {entry.name} ({entry.dialCode})
                    </option>
                  ))}
                </select>
                {selectedCountry && (
                  <p className="mt-2 text-xs text-slate-500">
                    International dial code prefix:{" "}
                    <span className="font-semibold text-sky-600">{selectedCountry.dialCode}</span>
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
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
                  placeholder={
                    selectedCountry
                      ? `${selectedCountry.dialCode} (555) 000-0000`
                      : "Select a country first"
                  }
                  className={fieldClassName}
                />
              </div>

              <div>
                <label
                  htmlFor="explanation"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
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
                  className="w-full resize-y rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="cv"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
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
                  className="w-full rounded-xl border border-dashed border-sky-200 bg-sky-50/50 px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-sky-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-sky-600"
                />
                {cvFile && (
                  <p className="mt-2 text-xs text-slate-500">
                    Selected: {cvFile.name} ({Math.round(cvFile.size / 1024)} KB)
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-70"
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
