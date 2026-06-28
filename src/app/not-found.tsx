// "use client";

// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { SearchX } from "lucide-react";

// export default function NotFoundPage() {
//   const router = useRouter();

//   return (
//     <div className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center overflow-hidden px-4 py-16">
//       {/* Background blurs */}
//       <div className="pointer-events-none absolute inset-0">
//         <div className="absolute left-1/4 top-1/4 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#10B981]/[0.04] blur-[100px]" />
//         <div className="absolute bottom-1/4 right-1/4 h-[250px] w-[250px] translate-x-1/2 translate-y-1/2 rounded-full bg-[#06B6D4]/[0.03] blur-[80px]" />
//       </div>

//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5, ease: "easeOut" }}
//         className="relative z-10 mx-auto w-full max-w-md text-center"
//       >
//         {/* Icon */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
//           className="mb-6 flex justify-center"
//         >
//           <motion.div
//             animate={{ y: [0, -8, 0] }}
//             transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
//             className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#10B981]/20 bg-[#10B981]/10"
//           >
//             <SearchX className="h-10 w-10 text-[#10B981]" />
//           </motion.div>
//         </motion.div>

//         {/* 404 */}
//         <motion.p
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
//           className="bg-gradient-to-r from-[#10B981] to-[#34D399] bg-clip-text text-7xl font-bold leading-none text-transparent"
//         >
//           404
//         </motion.p>

//         {/* Title */}
//         <motion.h1
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
//           className="mt-4 text-2xl font-bold text-[#E2E8F0]"
//         >
//           Page Not Found
//         </motion.h1>

//         {/* Description */}
//         <motion.p
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
//           className="mt-3 text-sm leading-relaxed text-[#94A3B8]"
//         >
//           The page you are looking for doesn&apos;t exist or may have been
//           moved.
//         </motion.p>

//         {/* Buttons */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
//           className="mt-8 flex flex-wrap items-center justify-center gap-3"
//         >
//           <Link
//             href="/"
//             className="flex items-center gap-2 rounded-xl bg-[#10B981] px-5 py-2.5 text-sm font-bold text-[#020817] shadow-lg shadow-[#10B981]/20 transition-all hover:bg-[#0EA472] active:scale-95"
//           >
//             <span className="btn-text">Go Home</span>
//           </Link>
//           <button
//             onClick={() => router.back()}
//             className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-[#94A3B8] transition-all hover:bg-white/[0.06] hover:text-[#E2E8F0] active:scale-95"
//           >
//             <span className="btn-text">Go Back</span>
//           </button>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// }
