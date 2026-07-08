"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { jobsList } from "@/jobsData";
import { countriesList } from "@/countriesData";
import BrandLogo from "@/components/BrandLogo";

const defaultCountry =
  countriesList.find((country) => country.code === "US") ??
  countriesList[0] ?? { name: "United States", code: "US", dialCode: "+1" };

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId;

  const [jobData, setJobData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    explanation: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (jobId && jobsList[jobId]) {
      setJobData(jobsList[jobId]);
    } else {
      setJobData(null);
    }
  }, [jobId]);

  const handleCountryChange = (event) => {
    const countryName = event.target.value;
    const countryObj = countriesList.find((country) => country.name === countryName);

    if (countryObj) {
      setSelectedCountry(countryObj);

      if (!formData.phone.startsWith("+")) {
        setFormData((prev) => ({ ...prev, phone: `${countryObj.dialCode} ` }));
      }
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
      ];

      if (
        !allowedTypes.includes(selectedFile.type) &&
        !selectedFile.name.endsWith(".docx") &&
        !selectedFile.name.endsWith(".doc")
      ) {
        setMessage({
          type: "error",
          text: "Unsupported format. Please upload a PDF or Word (.docx/.doc) document.",
        });
        event.target.value = null;
        setFile(null);
        return;
      }

      if (selectedFile.size > 500 * 1024) {
        setMessage({
          type: "error",
          text: "CV file size exceeds the 500KB free-tier safety limit.",
        });
        event.target.value = null;
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setMessage({ type: "", text: "" });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage({ type: "error", text: "Please upload your CV before submitting." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${jobId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("oceansourceai-application-form")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("oceansourceai-application-form").getPublicUrl(filePath);

      const { error: dbError } = await supabase.from("applicants").insert([
        {
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          country: selectedCountry.name,
          explanation: formData.explanation,
          job_id: jobId,
          cv_url: publicUrl,
        },
      ]);

      if (dbError) {
        throw dbError;
      }

      setShowSuccessModal(true);
      setMessage({ type: "", text: "" });
      setFormData({ fullName: "", email: "", phone: "", explanation: "" });
      setFile(null);
      setSelectedCountry(defaultCountry);

      const fileInput = document.getElementById("cv-file-input");
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Submission error context:", error);
      setMessage({
        type: "error",
        text:
          error.message ||
          "A network error occurred while sending your application. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!jobData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-sky-50 p-8">
        <h1 className="mb-4 text-3xl font-extrabold text-slate-800">Position Not Found</h1>
        <p className="mb-6 text-slate-600">
          The requested job listing does not exist or has been archived.
        </p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-lg bg-sky-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-sky-700"
        >
          Return to Positions List
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-sky-50 px-[15%] py-10 font-sans text-slate-800">
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-sky-100 hover:text-sky-700"
        >
          ← Back to Positions
        </Link>
      </div>

      <header className="sticky top-0 z-50 mb-10 flex items-center justify-between bg-sky-50/80 py-4 backdrop-blur-md">
        <Link href="/" className="flex items-center">
          <BrandLogo className="h-[80px] w-auto object-contain" />
        </Link>
        <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-600">
          Partner Workspace Portal
        </span>
      </header>

      {jobData.isOffPlatform && (
        <div className="mb-8 flex items-start space-x-3 rounded-xl border border-sky-200 bg-sky-100/80 p-4 text-sm text-sky-900 shadow-sm">
          <span className="text-lg">🌐</span>
          <div>
            <strong className="font-semibold">Off-Platform Notice:</strong> This project is
            managed and executed entirely off-platform. While your registration, screening, and
            onboarding progress are tracked securely here at OceanSourceAI, the live training
            annotations and evaluation workloads will be completed outside this website on
            designated client sandbox work networks.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
        <div className="space-y-6 rounded-2xl border border-sky-100 bg-white p-8 shadow-sm lg:col-span-7">
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-sky-500">
              Contract Opportunity
            </span>
            <h1 className="mb-2 mt-1 text-3xl font-extrabold text-slate-900">{jobData.title}</h1>
            <div className="text-2xl font-bold text-sky-600">
              {jobData.hourlyRate || "$20.00 / hr"}
            </div>
          </div>

          <div className="border-t border-sky-100 pt-5">
            <h3 className="mb-3 text-lg font-bold text-slate-900">Project Overview</h3>
            <p className="text-sm leading-relaxed text-slate-600">{jobData.overview}</p>
          </div>

          <div className="border-t border-sky-100 pt-5">
            <h3 className="mb-3 text-lg font-bold text-slate-900">Task Workflow & Sequence</h3>
            <ol className="list-inside list-decimal space-y-3 text-sm leading-relaxed text-slate-600">
              {jobData.workflow.map((step, index) => (
                <li key={index} className="pl-1">
                  <span className="font-medium text-slate-700">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="border-t border-sky-100 pt-5">
            <h3 className="mb-3 text-lg font-bold text-slate-900">Minimum Requirements</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              {jobData.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="font-bold text-sky-500">✓</span>
                  <span>{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white p-8 shadow-sm lg:col-span-5">
          <h2 className="mb-6 text-2xl font-extrabold text-slate-900">Apply Online</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-600">
                Full Name
              </label>
              <input
                required
                type="text"
                placeholder="John Doe"
                className="w-full rounded-xl border border-sky-100 bg-sky-50/30 p-3 text-sm transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={formData.fullName}
                onChange={(event) =>
                  setFormData({ ...formData, fullName: event.target.value })
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-600">
                Email Address
              </label>
              <input
                required
                type="email"
                placeholder="john@example.com"
                className="w-full rounded-xl border border-sky-100 bg-sky-50/30 p-3 text-sm transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-600">
                Country of Residence
              </label>
              <select
                required
                className="w-full rounded-xl border border-sky-100 bg-sky-50/30 p-3 text-sm transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={selectedCountry.name}
                onChange={handleCountryChange}
              >
                {countriesList.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.name} ({country.dialCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-600">
                Phone Number
              </label>
              <div className="relative flex overflow-hidden rounded-xl border border-sky-100 bg-sky-50/30 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-400">
                <span className="flex min-w-[50px] items-center justify-center border-r border-sky-100 bg-sky-100/50 px-3 py-3 text-xs font-semibold text-slate-500">
                  {selectedCountry.dialCode}
                </span>
                <input
                  required
                  type="tel"
                  placeholder="555-123-4567"
                  className="w-full bg-transparent p-3 text-sm focus:outline-none"
                  value={formData.phone}
                  onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-600">
                Why are you a fit for this position?
              </label>
              <textarea
                required
                rows={4}
                placeholder="Briefly detail your experience, interests, or writing abilities..."
                className="w-full resize-none rounded-xl border border-sky-100 bg-sky-50/30 p-3 text-sm transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={formData.explanation}
                onChange={(event) =>
                  setFormData({ ...formData, explanation: event.target.value })
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-600">
                Attach Resume (PDF/Word, Max 500KB)
              </label>
              <input
                id="cv-file-input"
                required
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                className="w-full text-xs text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-sky-100 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-sky-700 transition hover:file:bg-sky-200"
              />
            </div>

            {message.text && message.type === "error" && (
              <div className="rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-800 shadow-sm">
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-sky-500 p-3 font-bold text-white shadow-md transition hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? "Submitting File..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-modal-title"
            className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-3xl">
              🎉
            </div>
            <h2 id="success-modal-title" className="text-2xl font-extrabold text-slate-900">
              Application Received!
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              Thank you for applying. Your application files have been successfully received. We
              will communicate with you via email within 2 business days with the next steps.
            </p>

            <div className="mt-6 rounded-2xl bg-sky-50 p-5">
              <p className="text-sm font-medium text-slate-700">
                While you wait, join fellow taskers in our Discord community!
              </p>
              <a
                href="https://discord.gg/a93Tpmky9k"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-sky-600"
              >
                Join Discord Community
              </a>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
                router.push("/");
              }}
              className="mt-4 w-full rounded-xl px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-sky-100 hover:text-sky-700"
            >
              Back to Homepage
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
