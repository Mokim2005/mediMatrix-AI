"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Healthcare/AI themed images from Unsplash (no API key required — direct URLs)
const SLIDES = [
  {
    url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&q=80&auto=format&fit=crop",
    alt: "Doctor reviewing medical data on tablet",
  },
  {
    url: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1920&q=80&auto=format&fit=crop",
    alt: "AI medical analytics dashboard",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPq0m40E2yfGiQok73mZG22VmHPLxx3GsYBw&s",
    alt: "Modern hospital corridor with technology",
  },
  {
    url: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1920&q=80&auto=format&fit=crop",
    alt: "Medical research and data analysis",
  },
  {
    url: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?w=1920&q=80&auto=format&fit=crop",
    alt: "Healthcare professional with digital interface",
  },
];

const INTERVAL_MS = 5000;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SLIDES[current]!.url}
            alt={SLIDES[current]!.alt}
            className="h-full w-full object-cover object-center"
            loading={current === 0 ? "eager" : "lazy"}
          />
          {/* Multi-layer dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020817]/85 via-[#020817]/70 to-[#020817]/95" />
          {/* Side vignettes */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#020817]/60 via-transparent to-[#020817]/60" />
        </motion.div>
      </AnimatePresence>

      {/* Slide indicator dots */}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === current
                ? "w-6 bg-[#10B981]"
                : "w-1.5 bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
