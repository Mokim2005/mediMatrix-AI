import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import PageTransition from "@/components/shared/PageTransition";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MediMatrix AI — Healthcare Analytics Platform",
  description:
    "AI-Powered Prescription & Health Analytics Management System. Upload prescriptions, extract medical data with AI, and track patient lifetime analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-[#020817] text-[#E2E8F0] antialiased`}>
        <AppProvider>
          <Navbar />
          <main className="min-h-screen">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <Toaster
            position="bottom-right"
            theme="dark"
            toastOptions={{
              style: {
                background: "#0F172A",
                border: "1px solid rgba(226,232,240,0.08)",
                color: "#E2E8F0",
              },
            }}
          />
        </AppProvider>
      </body>
    </html>
  );
}
