# MediMatrix AI — AI-Powered Prescription & Health Analytics Management System

A modern, AI-powered healthcare management platform that helps patients organize prescriptions and medical records while enabling doctors to analyze historical health data for better clinical decisions.

---

## Features

### Patient Portal
- Upload prescription images and PDF files
- AI-powered prescription analysis via Google Gemini
- Automatic medicine extraction with categorization
- Test report and vital sign extraction
- Health timeline generation
- Local storage-based record management

### Doctor Portal
- Patient search by Patient ID
- Lifetime health analytics dashboard
- Antibiotic usage tracking over time
- Medicine category distribution charts
- Diagnostic history monitoring
- Consultation detail view with expandable timeline

### Admin Portal
- Patient management (suspend, activate, delete)
- Doctor management (register and view)
- Mock data generation for testing
- Audit log monitoring
- Local storage controls

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Library | Shadcn UI (Radix primitives) |
| Animation | Framer Motion, GSAP |
| AI / ML | Google Gemini API (Gemini 2.5 Flash) |
| State | React Context API + localStorage |
| Data Fetching | TanStack React Query |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Icons | Lucide React, Tabler Icons |
| Notifications | Sonner Toast |

---

## AI Features

- **Prescription OCR Processing** — Upload images and PDFs; AI extracts structured medical data
- **Structured Medical Data Extraction** — Doctor name, symptoms, medicines (with dosage/frequency/duration), test results, and vital signs
- **Medicine Classification** — Auto-categorizes medicines into Antibiotics, Gastric, Vitamins, Calcium, and Others
- **Test Result Detection** — Extracts test names, values, units, and normal ranges
- **Vital Sign Extraction** — Blood pressure, respiratory rate, and additional notes

---

## Project Architecture

```
┌─────────────────────────────────────────────────┐
│                   Next.js App                    │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐ │
│  │  Patient │  │  Doctor  │  │    Admin       │ │
│  │  Portal  │  │  Portal  │  │    Portal      │ │
│  └────┬─────┘  └────┬─────┘  └───────┬────────┘ │
│       │             │                │          │
│  ┌────┴─────────────┴────────────────┴────────┐ │
│  │         Shared Components & Context         │ │
│  │  (Navbar, AppContext, Services, Hooks)      │ │
│  └─────────────────┬───────────────────────────┘ │
│                    │                              │
│  ┌─────────────────┴───────────────────────────┐ │
│  │         Google Gemini AI (API Route)         │ │
│  └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │     LocalStorage      │
        │  (Patients, Records,  │
        │   Audit Logs)         │
        └───────────────────────┘
```

The frontend is fully client-rendered with all data persisted in the browser's `localStorage`. AI document parsing is handled through a Next.js API route that communicates with Google Gemini.

---

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd helth-care

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> Get a free API key at [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Roadmap / Future Improvements

- [ ] **Database Integration** — Migrate from localStorage to PostgreSQL / MongoDB with Prisma ORM
- [ ] **Authentication & Authorization** — JWT / NextAuth login for Patients, Doctors, and Admins
- [ ] **Patient Dashboard** — Full health metrics visualization, medication adherence tracking
- [ ] **Appointment Scheduling** — Calendar integration for booking and managing consultations
- [ ] **Multi-language Support** — i18n for Arabic, English, and other languages
- [ ] **PWA Support** — Offline access and installable mobile experience
- [ ] **Email / SMS Notifications** — Automated reminders for medication and follow-ups
- [ ] **PDF Report Generation** — Downloadable health summary reports
- [ ] **Dark/Light Theme Toggle** — Full theme support beyond the current dark mode
- [ ] **Unit & Integration Tests** — Jest + React Testing Library coverage

---

## Author

**MediMatrix AI** — Built with Next.js, TypeScript, Tailwind CSS, and Google Gemini.

---

> **Disclaimer**: This application is for demonstration and educational purposes only. Medical decisions should always be made by qualified healthcare professionals.
