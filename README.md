# MediMatrix AI — AI-Powered Prescription & Health Analytics Platform

Upload prescriptions and medical documents — Google Gemini AI extracts medicines, test results, and vitals automatically. Track lifetime health analytics, doctor consultations, and diagnostic trends across three integrated portals.

---

## Key Features

- **AI-Powered Document Parsing** — Upload PNG, JPEG, or PDF prescriptions; Google Gemini 2.5 Flash extracts doctor name, symptoms, medicines (with dosage, frequency, duration, and category), test results (with values, units, normal ranges), and vital signs (BP, respiratory rate)
- **Three-Portal Architecture** — Patient Portal (upload & view history), Doctor Command Center (lifetime analytics), Admin Console (system controls)
- **Doctor Dashboard** — Patient search by ID, antibiotic usage tracker, test history table, medicine distribution bar chart (Recharts), consultation timeline with expandable details, vital signs monitoring from latest record
- **Antibiotic Tracker** — Aggregates all antibiotic prescriptions across lifetime with dosage, frequency, duration, and prescription date
- **Medical History Timeline** — Patient-side view of all records sorted by date with medicine category badges and quick stats
- **Admin Console** — User management (suspend/activate/delete patients, register doctors), real-time audit logs with search and filter by action type, mock dataset injection, full system data clear
- **Audit Logging** — Every system action (parse success/failure, user suspended/deleted, mock data injected, system reset) is timestamped and persisted
- **Mock Data** — 5 patients with 3–4 consultations each, covering antibiotics, vitamins, gastric, calcium, and other medicine categories across multiple doctors
- **localStorage Persistence** — All data stored in browser localStorage with schema migration, multi-tab sync on focus, and zero cloud exposure
- **Dark Theme UI** — Emerald-accented dark theme with glassmorphism cards, backdrop blur, animated micro-interactions via Framer Motion, custom scrollbars, and responsive layout
- **Animated Landing Page** — Crossfading hero image slider, staggered fade-up animations, hover/tap spring interactions on all cards and buttons

---

## Tech Stack

| Category | Technologies |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS v4, `tw-animate-css`, `class-variance-authority`, `clsx` + `tailwind-merge` |
| **UI Components** | shadcn/ui (Radix primitives: Dialog, DropdownMenu, Tabs, Tooltip, Avatar, Select, ScrollArea, etc.) |
| **Animations** | Framer Motion, GSAP |
| **AI / ML** | Google Gemini 2.5 Flash API (raw fetch, no SDK) |
| **Charts** | Recharts (BarChart, ResponsiveContainer) |
| **Forms** | React Hook Form, Zod (schema validation) |
| **Icons** | Lucide React, Tabler Icons React |
| **Notifications** | Sonner toast |
| **Date Handling** | date-fns |
| **State Management** | React Context API + localStorage |
| **Data Fetching** | TanStack React Query |
| **Utilities** | `@dnd-kit` (drag-and-drop), `cmdk`, `vaul` (drawer), `jwt-decode`, `jsonwebtoken`, `cookie` |

---

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  #   Landing page (hero, portal showcase, how-it-works)
│   ├── layout.tsx                #   Root layout (Inter font, dark theme, Navbar, Footer, Toaster)
│   ├── loading.tsx               #   Global loading spinner
│   ├── not-found.tsx             #   404 page
│   ├── api/parse-document/       #   POST route — forwards base64 file to Gemini AI
│   ├── patient/                  #   Patient Portal
│   │   ├── page.tsx              #     Dashboard (stats, patient selector, action cards)
│   │   ├── upload/page.tsx       #     Upload prescription, review extracted data, save
│   │   └── records/page.tsx      #     Medical history timeline (record cards grid)
│   ├── doctor/                   #   Doctor Portal
│   │   ├── page.tsx              #     Redirects to /doctor/dashboard
│   │   ├── dashboard/page.tsx    #     Full analytics dashboard (antibiotics, charts, timeline)
│   │   └── patients/page.tsx     #     All patients table with "View Dashboard" action
│   └── admin/                    #   Admin Console
│       ├── page.tsx              #     Dashboard (stats cards, navigation)
│       ├── users/page.tsx        #     User management (patients + doctors tabs)
│       ├── audit/page.tsx        #     Audit logs with search and action type filter
│       └── settings/page.tsx     #     Mock data injection / system data clear
├── components/
│   ├── shared/                   #   Navbar, Footer, HeroSlider, PageTransition, Header, Sidebar
│   ├── patient/                  #   UploadZone (drag-and-drop), RecordCard, PatientStatus
│   ├── doctor/                   #   AntibioticTracker, TestHistoryChart, MedicineChart,
│   │                             #   ConsultationDetails (modal), PatientSearch
│   ├── admin/                    #   UserTable, AuditlogTable, MockDataManager
│   └── ui/                       #   Skeleton (shadcn)
├── context/
│   └── AppContext.tsx             #   Global state: patients, doctors, auditLogs, hydration
├── hooks/                        #   usePatients, useMedicalRecords, useLocalStorage
├── lib/
│   ├── ai/                       #   Gemini API client + Zod schemas for AI response parsing
│   ├── constants.ts              #   Storage keys, upload limits, medicine categories
│   ├── gemini.ts                 #   Legacy Gemini config (deprecated)
│   ├── openai.ts                 #   Placeholder for OpenAI integration
│   └── utils.ts                  #   cn() classname merger, formatDate()
├── services/
│   ├── ai.service.ts             #   parseMedicalDocument() — sends prompt + file to Gemini
│   ├── storage.service.ts        #   localStorage CRUD, mock dataset, schema migration
│   └── patient.service.ts        #   (patient CRUD placeholder)
├── types/                        #   Patient, MedicalRecord, Doctor, Admin (AuditLog, SystemStats)
├── assets/                       #   SVG paths, SparkleIcon
└── providers/                    #   QueryProvider (placeholder)
```

---

## Prerequisites

- **Node.js** 20+ (with npm)
- **Google Gemini API key** — get one free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

---

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd medimatrix-AI

# Install dependencies
npm install

# Create environment file (see below)
# .env.local

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

The app also checks `NEXT_PUBLIC_GEMINI_API_KEY` as a fallback.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Usage Guide

1. **Landing page** — Overview of all three portals and how the platform works
2. **Patient Portal** (`/patient`) — Select or create a patient, then upload prescriptions via drag-and-drop. Review AI-extracted data (medicines, tests, vitals) before saving to the patient's lifetime record
3. **Doctor Dashboard** (`/doctor/dashboard`) — Search for a patient by ID (e.g. `P-1001`), view antibiotic tracking, medicine distribution chart, test history, and consultation timeline with expandable details
4. **Admin Console** (`/admin`) — Monitor system stats, manage users (suspend/activate/delete patients, register doctors), review audit logs with search/filter, inject mock dataset, or clear all system data

---

## API Reference

### `POST /api/parse-document`

Uploads a medical document to Google Gemini for AI extraction.

**Request body:**
```json
{
  "fileBase64": "<base64-encoded-file>",
  "fileType": "image/jpeg"
}
```

**Success response (200):**
```json
{
  "success": true,
  "data": {
    "id": "REC-AI-<timestamp>",
    "doctorName": "Dr. Sarah Johnson",
    "consultationDate": "2024-06-10",
    "symptoms": "Urinary tract infection...",
    "bloodPressure": "130/82",
    "respiratoryRate": "19",
    "medicines": [...],
    "testResults": [...]
  }
}
```

**Error response (400/500):**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## License

This project is for demonstration and educational purposes.

**Disclaimer:** Medical decisions should always be made by qualified healthcare professionals. This application is not a substitute for professional medical advice.
