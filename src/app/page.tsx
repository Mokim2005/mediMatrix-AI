"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import HeroSlider from "@/components/shared/HeroSlider";
import {
  UploadCloud, Brain, BarChart3, Stethoscope, ShieldCheck,
  ClipboardList, Pill, FlaskConical, Users, Activity, Lock, Zap, ArrowRight,
} from "lucide-react";

// ─── Shared variants ─────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.38, delay, ease: "easeOut" as const },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.38, delay },
  }),
};

const cardHover = {
  rest:  { y: 0,    boxShadow: "0 0 0 rgba(16,185,129,0)" },
  hover: { y: -6,   boxShadow: "0 20px 40px rgba(16,185,129,0.10)" },
};

const btnPrimary = {
  rest:  { scale: 1 },
  hover: { scale: 1.04 },
  tap:   { scale: 0.96 },
};

// ─── Glass card ───────────────────────────────────────────────────────────────

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md ${className}`}>
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden bg-[#020817]">
      {/* ── Section 1: Hero ─────────────────────────────────────────────────── */}
      {/* min-h-[92vh] থেকে কমিয়ে h-auto করা হয়েছে এবং অপ্রয়োজনীয় টপ স্পেস দূর করা হয়েছে */}
      <section className="relative w-full flex items-center overflow-hidden">
        {/* Background image slider — behind everything */}
        <HeroSlider />

        {/* Ambient glows layered on top of slider */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#10B981]/[0.05] blur-[100px]" />
          <div className="absolute top-1/2 -right-40 h-[400px] w-[400px] rounded-full bg-[#10B981]/[0.03] blur-[80px]" />
        </div>

        {/* pt-16 এবং pb-24 দিয়ে নেভবারের ঠিক নিচ থেকে ব্যানার স্টার্ট করা হয়েছে */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-16 pb-24 sm:px-6 lg:px-8 lg:pt-20 lg:pb-28">
          <div className="flex flex-col items-center text-center">
            {/* Pill badge */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="show" custom={0}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-4 py-1.5 text-xs font-semibold text-[#10B981] backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
              Powered by Google Gemini AI
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp} initial="hidden" animate="show" custom={0.08}
              className="max-w-4xl text-5xl font-bold leading-tight tracking-tight text-[#E2E8F0] md:text-7xl"
            >
              AI-Powered Prescription &{" "}
              <span className="bg-gradient-to-r from-[#10B981] to-[#34D399] bg-clip-text text-transparent">
                Health Analytics
              </span>{" "}
              Platform
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeUp} initial="hidden" animate="show" custom={0.16}
              className="mt-6 max-w-2xl text-lg leading-relaxed text-[#94A3B8]"
            >
              Upload prescriptions and medical documents — our AI extracts medicines,
              test results, and vitals automatically. Track lifetime health analytics,
              doctor consultations, and diagnostic trends in one unified dashboard.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="show" custom={0.24}
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              <motion.div variants={btnPrimary} initial="rest" whileHover="hover" whileTap="tap"
                transition={{ type: "spring", stiffness: 380, damping: 20 }}>
                <Link
                  href="/patient"
                  className="group flex items-center gap-2 rounded-xl bg-[#10B981] px-7 py-3.5 text-sm font-bold text-[#020817] shadow-lg shadow-[#10B981]/25 transition-colors hover:bg-[#0EA472]"
                >
                  <UploadCloud className="h-4 w-4" />
                  Access Patient Hub
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.div>

              <motion.div variants={btnPrimary} initial="rest" whileHover="hover" whileTap="tap"
                transition={{ type: "spring", stiffness: 380, damping: 20 }}>
                <Link
                  href="/doctor/dashboard"
                  className="group flex items-center gap-2 rounded-xl border border-white/[0.14] bg-white/[0.06] px-7 py-3.5 text-sm font-bold text-[#E2E8F0] backdrop-blur-sm transition-all hover:border-[#10B981]/40 hover:bg-white/[0.10]"
                >
                  <Stethoscope className="h-4 w-4" />
                  Enter Doctor Command Center
                </Link>
              </motion.div>
            </motion.div>

            {/* Metrics strip */}
            <motion.div
              variants={fadeIn} initial="hidden" animate="show" custom={0.4}
              className="mt-16 flex flex-wrap justify-center gap-6 text-center"
            >
              {[
                { value: "AI",   label: "Powered Extraction" },
                { value: "3",    label: "Integrated Portals" },
                { value: "∞",    label: "Lifetime Records"   },
                { value: "0ms",  label: "Cloud Latency"      },
              ].map(({ value, label }) => (
                <motion.div key={label} className="px-4"
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <p className="text-3xl font-bold text-[#10B981]">{value}</p>
                  <p className="mt-1 text-xs text-[#94A3B8]">{label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Portal Showcase ──────────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#10B981]/[0.04] blur-[120px]" />
        </div>

        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl font-semibold text-[#E2E8F0]">Three Portals. One Platform.</h2>
          <p className="mt-3 text-[#94A3B8]">Purpose-built experiences for patients, doctors, and administrators.</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              href: "/patient", icon: UploadCloud, title: "Patient Portal",
              description: "Upload prescriptions, let AI extract your medicines and test results, and browse your complete medical history timeline.",
              features: ["AI Document Upload", "Medical Timeline", "Prescription Records"],
              delay: 0,
            },
            {
              href: "/doctor/dashboard", icon: Stethoscope, title: "Doctor Command Center",
              description: "Deep patient analytics with antibiotic tracking, diagnostic history charts, and full consultation timeline with expandable details.",
              features: ["Antibiotic Tracker", "Test History Chart", "Consultation Analytics"],
              delay: 0.08,
            },
            {
              href: "/admin", icon: ShieldCheck, title: "Admin Console",
              description: "Full user management, real-time audit logs, mock dataset injection, and system-wide controls with instant localStorage sync.",
              features: ["User Management", "Audit Logs", "Mock Data Controls"],
              delay: 0.16,
            },
          ].map(({ href, icon: Icon, title, description, features, delay }) => (
            <motion.div
              key={title}
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={delay}
            >
              <motion.div
                variants={cardHover} initial="rest" whileHover="hover"
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
              >
                <Link href={href} className="group block h-full">
                  <GlassCard className="flex h-full flex-col gap-5 p-6 transition-colors duration-300 hover:border-[#10B981]/30">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#10B981]/10 transition-colors group-hover:bg-[#10B981]/20">
                      <Icon className="h-6 w-6 text-[#10B981]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#E2E8F0]">{title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">{description}</p>
                    </div>
                    <ul className="space-y-2">
                      {features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-[#94A3B8]">
                          <span className="h-1 w-1 rounded-full bg-[#10B981]" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#10B981] opacity-0 transition-opacity group-hover:opacity-100">
                      Open Portal <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Section 3: How It Works ─────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl font-semibold text-[#E2E8F0]">How It Works</h2>
          <p className="mt-3 text-[#94A3B8]">Three steps from prescription to lifetime analytics.</p>
        </motion.div>

        <div className="relative flex flex-col gap-0">
          {[
            {
              step: "01", icon: UploadCloud, title: "Upload Document",
              desc: "Drag and drop your prescription image or PDF into the Patient Portal. PNG, JPEG, and PDF formats supported up to 10MB.",
              delay: 0,
            },
            {
              step: "02", icon: Brain, title: "AI Extraction",
              desc: "Google Gemini AI analyzes your document and extracts doctor name, symptoms, medicines with dosages and categories, and all test results into structured JSON.",
              delay: 0.1,
            },
            {
              step: "03", icon: BarChart3, title: "Health Analytics",
              desc: "Instantly view lifetime analytics on the Doctor Dashboard — antibiotic usage tracking, diagnostic history charts, and consultation timelines.",
              delay: 0.2,
            },
          ].map(({ step, icon: Icon, title, desc, delay }, idx, arr) => (
            <motion.div
              key={step}
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={delay}
              className="relative flex gap-6 pb-10"
            >
              {idx < arr.length - 1 && (
                <div className="absolute left-[23px] top-12 bottom-0 w-px bg-gradient-to-b from-[#10B981]/40 to-transparent" />
              )}
              <motion.div
                whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(16,185,129,0.25)" }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#10B981]/30 bg-[#10B981]/10"
              >
                <Icon className="h-5 w-5 text-[#10B981]" />
              </motion.div>
              <GlassCard className="flex-1 p-5">
                <span className="text-xs font-bold text-[#10B981]">Step {step}</span>
                <h3 className="mt-1 text-base font-bold text-[#E2E8F0]">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#94A3B8]">{desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Section 4: Trust Indicators ─────────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-semibold text-[#E2E8F0]">Built for Trust & Reliability</h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: Brain,        label: "AI Powered",        value: "Gemini 2.5 Flash",    delay: 0     },
            { icon: Lock,         label: "Local Storage Secure", value: "Zero Cloud Exposure",  delay: 0.06  },
            { icon: FlaskConical, label: "Medical Analytics",    value: "Full Lab History",     delay: 0.12  },
            { icon: Zap,          label: "Real-Time Dashboard",  value: "Instant Sync",         delay: 0.18  },
            { icon: Pill,         label: "Antibiotic Tracking",  value: "Lifetime Records",     delay: 0.24  },
            { icon: ClipboardList,label: "Audit Logging",        value: "Every Action Logged",  delay: 0.30  },
            { icon: Users,        label: "Multi-Role Access",    value: "3 Portal Types",       delay: 0.36  },
            { icon: Activity,     label: "Vital Monitoring",     value: "BP & Respiratory",     delay: 0.42  },
          ].map(({ icon: Icon, label, value, delay }) => (
            <motion.div
              key={label}
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={delay}
            >
              <motion.div
                whileHover={{ y: -4, borderColor: "rgba(16,185,129,0.25)" }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
              >
                <GlassCard className="flex flex-col gap-3 p-5 cursor-default">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981]/10">
                    <Icon className="h-5 w-5 text-[#10B981]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#E2E8F0]">{label}</p>
                    <p className="mt-0.5 text-xs text-[#94A3B8]">{value}</p>
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={0}
        >
          <GlassCard className="relative overflow-hidden p-10 text-center">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#10B981]/10 blur-[80px]" />
            </div>
            <h2 className="relative text-3xl font-bold text-[#E2E8F0]">Ready to get started?</h2>
            <p className="relative mt-3 text-[#94A3B8]">Select your portal and begin managing health records with AI precision.</p>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
              {[
                { href: "/patient",          icon: UploadCloud, label: "Patient Portal",      primary: true  },
                { href: "/doctor/dashboard", icon: Stethoscope, label: "Doctor Dashboard",    primary: false },
                { href: "/admin",            icon: ShieldCheck, label: "Admin Console",       primary: false },
              ].map(({ href, icon: Icon, label, primary }) => (
                <motion.div
                  key={href}
                  variants={btnPrimary} initial="rest" whileHover="hover" whileTap="tap"
                  transition={{ type: "spring", stiffness: 380, damping: 20 }}
                >
                  <Link
                    href={href}
                    className={
                      primary
                        ? "flex items-center gap-2 rounded-xl bg-[#10B981] px-6 py-3 text-sm font-bold text-[#020817] shadow-lg shadow-[#10B981]/20 transition-colors hover:bg-[#0EA472]"
                        : "flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.04] px-6 py-3 text-sm font-bold text-[#E2E8F0] transition-all hover:border-[#10B981]/40 hover:bg-white/[0.07]"
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </section>
    </div>
  );
}