"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, User, Stethoscope, ShieldCheck, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/patient", label: "Patient", icon: User },
  { href: "/doctor",  label: "Doctor",  icon: Stethoscope },
  { href: "/admin",   label: "Admin",   icon: ShieldCheck },
];

const drawerVariants = {
  hidden: { opacity: 0, height: 0 },
  show:   { opacity: 1, height: "auto" as const, transition: { duration: 0.25, ease: "easeOut" as const } },
  exit:   { opacity: 0, height: 0,               transition: { duration: 0.2,  ease: "easeIn"  as const } },
};

const linkVariants = {
  hidden: { opacity: 0, x: -12 },
  show:   (i: number) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.22, delay: i * 0.05, ease: "easeOut" as const },
  }),
};

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close drawer on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Scroll detection for background intensification
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <nav className="sticky top-0 z-50 w-full">
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 border-b backdrop-blur-xl transition-all duration-300",
          scrolled
            ? "bg-[#020817]/95 border-white/[0.08] shadow-lg shadow-black/20"
            : "bg-[#020817]/75 border-white/[0.04]"
        )}
      />

      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-lg font-bold text-[#E2E8F0] transition-opacity hover:opacity-80"
        >
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[#10B981]"
          >
            <Activity className="h-4 w-4 text-[#020817]" strokeWidth={2.5} />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
          </motion.div>
          <span>
            MediMatrix <span className="text-[#10B981]">AI</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <motion.div
              key={href}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              <Link
                href={href}
                className={cn(
                  "relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-200",
                  isActive(href)
                    ? "bg-[#10B981]/10 text-[#10B981]"
                    : "text-[#94A3B8] hover:bg-white/[0.05] hover:text-[#E2E8F0]"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
                {isActive(href) && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-[#10B981]"
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile hamburger */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] text-[#94A3B8] hover:bg-white/[0.05] hover:text-[#E2E8F0]"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            {menuOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <X className="h-5 w-5" />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <Menu className="h-5 w-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Animated mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="relative md:hidden overflow-hidden border-t border-white/[0.06] bg-[#0F172A]/98 backdrop-blur-xl"
          >
            <div className="px-4 pb-4 pt-2">
              {navLinks.map(({ href, label, icon: Icon }, i) => (
                <motion.div
                  key={href}
                  custom={i}
                  variants={linkVariants}
                  initial="hidden"
                  animate="show"
                >
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      isActive(href)
                        ? "bg-[#10B981]/10 text-[#10B981]"
                        : "text-[#94A3B8] hover:bg-white/[0.04] hover:text-[#E2E8F0]"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                    {isActive(href) && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
