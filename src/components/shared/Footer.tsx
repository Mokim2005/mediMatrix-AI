import Link from "next/link";
import { Activity, Shield, Lock, Brain } from "lucide-react";

const portalLinks = [
  { href: "/patient", label: "Patient Portal" },
  { href: "/patient/upload", label: "Upload Prescription" },
  { href: "/patient/records", label: "Medical Records" },
  { href: "/doctor", label: "Doctor Portal" },
  { href: "/doctor/dashboard", label: "Analytics Dashboard" },
  { href: "/admin", label: "Admin Console" },
];

const complianceItems = [
  { icon: Shield, label: "HIPAA Aligned Architecture" },
  { icon: Lock, label: "Local Storage — No Cloud Sync" },
  { icon: Brain, label: "AI-Powered Extraction" },
];

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/[0.06] bg-[#0F172A]">
      {/* Subtle top glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#10B981]/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#10B981]">
                <Activity className="h-4 w-4 text-[#020817]" strokeWidth={2.5} />
              </div>
              <span className="text-base font-bold text-[#E2E8F0]">
                MediMatrix <span className="text-[#10B981]">AI</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-[#94A3B8]">
              AI-Powered Prescription & Health Analytics Platform. Upload prescriptions,
              extract medical data, and track lifetime health analytics.
            </p>
            {/* Compliance badges */}
            <div className="space-y-2 pt-2">
              {complianceItems.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 text-[#10B981]" />
                  <span className="text-xs text-[#94A3B8]">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Portal links */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#10B981]">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {portalLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-[#94A3B8] transition-colors hover:text-[#E2E8F0]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech stack */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#10B981]">
              Technology
            </h4>
            <ul className="space-y-2.5">
              {["Next.js 16 App Router", "TypeScript (Strict)", "Google Gemini AI", "Tailwind CSS v4", "Framer Motion", "Local Storage"].map((item) => (
                <li key={item} className="text-sm text-[#94A3B8]">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="text-xs text-[#94A3B8]">
            © 2026 MediMatrix AI. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-xs text-[#94A3B8]">System Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
