# 🩺 SwasthSathi - Family Health & AI Assistant

An intelligent, full-stack family healthcare management system and diagnostic triage assistant. Built with **React 19 + TypeScript + Vite**, **IndexedDB (offline-first architecture)**, **Tailwind CSS**, and an **Express.js + TypeScript** backend with integrated Machine Learning & AI health reasoning.

---

## 🌟 Key Features

### 👨‍👩‍👧 1. Family Health Dashboard
- **Family Profiles**: Manage parents, children, and guardians with individualized avatars, blood groups, and chronic conditions.
- **Medication Compliance**: Real-time daily adherence percentage bar, schedule management, mark as taken/skipped, and 1-click **WhatsApp dosage alerts**.
- **Vitals Tracking**: Continuous monitoring of Blood Pressure, Fasting/Post-meal Blood Sugar, Heart Rate, SpO2, Temperature, Weight, and Cholesterol.
- **Diet Plan Generator**: Clinically customized Indian meal plans (Breakfast, Lunch, Snacks, Dinner, Calories, Foods to avoid, and Dietitian tips) personalized to patient conditions (Type 2 Diabetes, Hypertension, Osteoarthritis).
- **Appointment Doctor Prep**: Generates specialized consultation questions and checklist of reports to bring for upcoming clinic visits.
- **1-Click Data Export**: Secure JSON data backup and export.

### 🔬 2. AI Lab Report Scanner
- **Multi-Format Ingestion**: Drag-and-drop or upload diagnostic reports via Camera photo, PDF, PNG, JPG, or HEIC.
- **Biomarker Extraction**: Automatically parses biomarkers (HbA1c, Fasting Sugar, Hemoglobin, WBC, Platelets, Lipid profile, Creatinine, Vitamin D3, Calcium, ESR, CRP).
- **Status Classification**: Color-coded indicators (`Normal`, `Low`, `High`, `Critical`) with plain-language biological explanations and clinical suggestions.
- **Printing & Sharing**: One-click printable medical report generator and Web Share API / clipboard sharing.
- **Persistent History**: Stores historical reports in IndexedDB for longitudinal comparison.

### 📅 3. Smart Clinical Scheduler & Emergency SOS
- **Dual Triage Engine**:
  - **Client-Side Naive Bayes ML**: Instant offline symptom classifier with confidence scoring across 12+ specialties (Cardiology, Endocrinology, Pulmonology, Neurology, etc.).
  - **AI Deep Triage**: Detailed clinical risk assessment, red-flag checklists, and immediate emergency actions.
- **🚨 Emergency SOS Mode**: Instant toggle that filters nearby hospitals displaying live open ER bed availability.
- **Hospital Directory**: Real-time distance, ratings, emergency tags, and time slots with quietest/least-crowded hours highlighted (`⭐`).
- **Google Maps & Direct Calling**: One-tap GPS navigation and hospital phone connections.

### 💊 4. MediScan - Drug Interaction Checker
- **Multi-Drug Regimen Management**: Easily track concurrent prescriptions.
- **Medicine Strip Scanner**: OCR / camera scanning for medicine packaging and boxes.
- **Local Clinical Knowledge Base**: Instant offline detection of dangerous drug pairs (e.g., Warfarin + Ibuprofen, Metformin + Alcohol, Amlodipine + Simvastatin, Lisinopril + Potassium).
- **AI Pharmacological Deep Check**: Analyzes biological mechanisms, clinical effects, management guidelines, and safe non-interacting alternatives.

### 🤖 5. SwasthSathi AI Companion
- **Context-Aware Dialogue**: Tailored responses based on the active family member's age and diagnosed conditions.
- **🔊 Voice Synthesis (TTS)**: Built-in text-to-speech audio reader.
- **Quick Clinical Prompts**: Instant insights on HbA1c, blood pressure ranges, LDL cholesterol, Metformin precautions, joint health, and emergency chest pain protocols.

### 📊 6. Health Analytics & Trend Insights
- **Adherence Meter**: Aggregate and member-specific medication compliance scoring.
- **Biomarker Out-of-Range Surveillance**: Summarizes all flagged lab results across tests.
- **AI Longitudinal Health Trends**: Classifies overall health trajectory (`Improving`, `Stable`, `Declining`) with actionable priority recommendations.
- **Encrypted Local Storage**: Encrypted client-side storage view.

---

## 📁 Detailed Directory Structure

```
SwasthSathi/
├── package.json                   # Root monorepo workspace configuration & scripts
├── .gitignore                     # Git ignore rules for node_modules, dist, logs
├── README.md                      # Comprehensive project documentation
├── SwasthSathi-standalone.html    # Standalone zero-dependency browser preview
│
├── frontend/                      # React 19 + TypeScript + Vite Frontend
│   ├── index.html                 # Entry HTML with Google Fonts (Sora)
│   ├── package.json               # Frontend dependencies & Vite scripts
│   ├── tsconfig.json              # TypeScript configuration
│   ├── vite.config.ts             # Vite build & plugin configuration
│   ├── tailwind.config.cjs        # Tailwind CSS styling configuration
│   └── src/
│       ├── main.tsx               # Application bootstrap
│       ├── App.tsx                # Main router & bottom navigation manager
│       ├── index.css              # Global styles, Sora font, custom animations
│       │
│       ├── types/
│       │   └── index.ts           # Unified TypeScript definitions (Member, Med, Lab, Vital, etc.)
│       │
│       ├── data/
│       │   ├── seedData.ts        # Initial family data, meds, vitals, sample lab panels
│       │   ├── mlTrainingData.ts  # Naive Bayes symptom training dataset
│       │   ├── drugKnowledgeBase.ts# Clinical drug-drug interaction matrix
│       │   └── hospitals.ts       # Hospitals database with ER beds and quiet slots
│       │
│       ├── lib/
│       │   ├── idb.ts             # IndexedDB wrapper (FamilyHealthV6 store)
│       │   ├── naiveBayes.ts      # Probabilistic Naive Bayes ML classifier class
│       │   ├── aiService.ts       # Hybrid AI engine (Backend + Local fallback)
│       │   └── utils.ts           # Formatters (date, time, uid, cn)
│       │
│       ├── context/
│       │   ├── AppContext.tsx     # Global application state, tabs, toasts, SOS mode
│       │   ├── LanguageContext.tsx# Multilingual language state
│       │   └── ThemeContext.tsx   # Theme management
│       │
│       ├── components/
│       │   ├── common/            # Reusable UI primitives
│       │   │   ├── Card.tsx       # Standard container card
│       │   │   ├── Button.tsx     # Primary/Outline/Small buttons
│       │   │   ├── Input.tsx      # Labelled inputs, selects, textareas
│       │   │   ├── Chip.tsx       # Category/status pills
│       │   │   ├── Spinner.tsx    # Bouncing loading dots
│       │   │   ├── Modal.tsx      # Bottom slide-up modal with backdrop
│       │   │   ├── ProgressBar.tsx# Smooth progress bar
│       │   │   ├── Toast.tsx      # Notification popups
│       │   │   └── SOSButton.tsx  # Pulsing emergency button
│       │   │
│       │   ├── layout/
│       │   │   ├── Header.tsx     # Top bar with export & SOS
│       │   │   └── BottomNav.tsx  # 6-tab fixed bottom navigation
│       │   │
│       │   ├── dashboard/         # Dashboard widgets & modals
│       │   │   ├── MemberCard.tsx
│       │   │   ├── MissedMedAlert.tsx
│       │   │   ├── MemberModal.tsx
│       │   │   ├── MedicationModal.tsx
│       │   │   ├── AppointmentModal.tsx
│       │   │   ├── VitalModal.tsx
│       │   │   └── DietPlanCard.tsx
│       │   │
│       │   ├── scanner/           # Lab Scanner components
│       │   │   ├── ParameterCard.tsx
│       │   │   └── ReportViewerModal.tsx
│       │   │
│       │   ├── scheduler/         # Scheduler & triage components
│       │   │   └── HospitalCard.tsx
│       │   │
│       │   └── mediscan/          # MediScan components
│       │       └── InteractionCard.tsx
│       │
│       └── pages/                 # Full feature views
│           ├── DashboardPage.tsx  # Family overview, adherence, vitals, meds
│           ├── ScannerPage.tsx    # Lab report OCR & biomarker extractor
│           ├── SchedulerPage.tsx  # ML/AI symptom triage & hospital booking
│           ├── MediScanPage.tsx   # Drug-drug interaction checker
│           ├── BotPage.tsx        # Conversational AI assistant with TTS
│           └── AnalyticsPage.tsx  # Health stats, trends, database summary
│
└── backend/                       # Express 5 + TypeScript Backend API
    ├── package.json               # Backend dependencies
    ├── tsconfig.json              # TypeScript compilation settings
    └── src/
        ├── index.ts               # Express app, CORS, routes & health check
        └── routes/
            ├── ai.ts              # /api/ai (chat, diet, triage, interactions, prep)
            ├── lab.ts             # /api/lab (report upload & parsing)
            ├── hospitals.ts       # /api/hospitals (hospital list & ER status)
            ├── risk.ts            # /api/risk (diabetes & cardiovascular risks)
            └── auth.ts            # /api/auth (user authentication endpoints)
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v20+)
- **npm** (v10+)

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/satyamk001-tech/SwasthSathi.git
cd SwasthSathi

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 3. Running the Application

#### Start the Backend API (Port 5000):
```bash
cd backend
npm run dev
```

#### Start the Frontend Web App (Port 5173):
In a new terminal:
```bash
cd frontend
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

#### Building for Production:
```bash
# In project root:
npm run build
```

---

## 🔒 Privacy & Offline Capability

- **Offline-First**: All family member profiles, medication schedules, lab reports, and vitals are saved directly to your device's browser using **IndexedDB (`FamilyHealthV6`)**. No private health data is uploaded to public servers without explicit user initiation.
- **Offline ML Triage**: Built-in Naive Bayes probabilistic model runs 100% in the client browser without needing an active internet connection.
- **Hybrid AI Architecture**: Operates gracefully with backend AI services, direct API keys, or built-in intelligent clinical fallback generators so the app remains fully responsive in all network conditions.

---

## 👨‍💻 Author & Repository

- **Repository**: [https://github.com/satyamk001-tech/SwasthSathi](https://github.com/satyamk001-tech/SwasthSathi)
- **Author**: satyamk001-tech
- **License**: MIT
