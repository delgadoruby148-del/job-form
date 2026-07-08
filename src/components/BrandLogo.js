"use client";

import { useState } from "react";

export default function BrandLogo({ className = "h-[60px] w-auto object-contain" }) {
  const [logoFailed, setLogoFailed] = useState(false);

  if (logoFailed) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500 text-lg font-bold text-white shadow-md">
          O
        </div>
        <span className="text-2xl font-bold tracking-tight text-slate-900">
          OceanSource <span className="text-sky-500">AI</span>
        </span>
      </div>
    );
  }

  return (
    <img
      src="/oceansourceai-logo.png"
      alt="OceanSource AI"
      className={className}
      onError={() => setLogoFailed(true)}
    />
  );
}
