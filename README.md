<div align="center">

# ASHENRITUAL

**Architectural Luxury Menswear • Conversational AI Concierge • Edge Computer Vision**

[![Live Deployment](https://img.shields.io/badge/LIVE_PLATFORM-ASHENRITUAL-0A0A0A?style=for-the-badge&labelColor=000000&color=262626)](https://ashenritual-e2ql.vercel.app)

[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![NestJS](https://img.shields.io/badge/NestJS_11-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma_ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini_AI-8E75B2?style=flat-square&logo=googlegemini&logoColor=white)](https://ai.google.dev/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe_Vision-00897B?style=flat-square&logo=google&logoColor=white)](https://developers.google.com/mediapipe)

[Live Platform](https://ashenritual-e2ql.vercel.app) · [System Architecture](#system-architecture) · [AI & Computer Vision](#ai--computer-vision-engineering) · [Tech Stack](#technology-stack) · [API Reference](#api-reference)

</div>

---

<div align="center">
  <img src=".github/assets/home.png" alt="ASHENRITUAL Platform Hero" width="100%" />
</div>

| **Archival Shop & Filtering** | **Chapters & Seasonal Exhibitions** |
| :---: | :---: |
| <img src=".github/assets/shop.png" alt="Shop Interface" width="100%" /> | <img src=".github/assets/Exhibition.png" alt="Exhibition Gallery" width="100%" /> |
| **The Forge — Material Provenance** | **Beyond — Editorial Lookbook** |
| <img src=".github/assets/forge.png" alt="Forge Layout" width="100%" /> | <img src=".github/assets/beyond.png" alt="Editorial Beyond Section" width="100%" /> |

---

## Overview

**ASHENRITUAL** is a production-grade, headless luxury fashion and conversational commerce platform engineered on a decoupled TypeScript monorepo architecture. It unites high-frame-rate editorial web experiences with real-time generative AI orchestration and browser-native computer vision.

At the center of the platform is **VESPER**, a context-aware AI fashion concierge and sizing engine. Rather than operating as a generic chat wrapper, VESPER combines Retrieval-Augmented Generation (RAG) over live PostgreSQL inventory, dual-channel Server-Sent Events (SSE) token streaming, and client-side skeletal pose estimation (`@mediapipe/tasks-vision`) to deliver personalized garment curation and anatomical fit analysis.

---

## System Architecture

```mermaid
graph LR
    subgraph Client ["Web Client (Next.js 15 / React 19)"]
        RSC[App Router & ISR Pages]
        Store[Zustand Persistent State]
        Motion[GSAP 3 + Framer Motion + Lenis]
        Vision[MediaPipe PoseLandmarker WASM/GPU]
    end

    subgraph API ["Backend Service (NestJS 11)"]
        Gateway[REST Controllers & SSE Stream]
        Auth[Passport JWT & Google OAuth 2.0]
        Orch[Vesper Orchestrator & Context Manager]
        RAG[Recommendation Engine]
        Size[Vesper Size Intelligence Service]
        ORM[Prisma ORM 5.22]
    end

    subgraph Infrastructure ["Cloud & AI Providers"]
        Flash[Google Gemini 1.5 Flash]
        Pro[Google Gemini 2.5 Pro]
        DB[(PostgreSQL Database)]
        CDN[Cloudinary Media CDN]
        Mail[Resend Transactional Email]
    end

    Client -->|HTTPS / REST & SSE| Gateway
    Gateway --> Auth
    Gateway --> Orch
    Orch --> RAG --> ORM
    Orch -->|SSE Stream| Flash
    Vision -->|Skeletal Metrics| Size -->|Structured JSON| Pro
    ORM --> DB
    Gateway --> CDN
    Auth --> Mail
```

---

## AI & Computer Vision Engineering

### 1. VESPER 3.0 — Conversational AI Orchestrator
Located in `backend/src/vesper/`, VESPER is built on a custom orchestration pipeline designed for deterministic grounding and zero-latency streaming:

- **Retrieval-First Grounding (RAG):** Before invoking the LLM, `RecommendationEngine` parses query intent and queries PostgreSQL via Prisma to retrieve matching inventory records (`Product ID`, `Category`, `Price`, `Description`) and seasonal `Chapters`. The model is strictly constrained to recommend verified catalog IDs, eliminating product hallucinations.
- **Dynamic Context Injection:** `ContextManager` enriches every prompt with live user telemetry—including active route, currently viewed product, cart contents, `Saved Rituals` (wishlist), local time, and saved anatomical measurements (`[SIZE INTELLIGENCE ACTIVE]`).
- **Dual-Channel SSE Marker Streaming:** `GeminiProvider` interfaces with **Google Gemini 1.5 Flash** via Server-Sent Events (`streamGenerateContent`). A rolling stream parser yields conversational prose character-by-character to the client while buffering the trailing `---JSON_START---` / `---JSON_END---` block. Once complete, structured UI actions (route navigation, collection deep-links, and interactive product recommendation cards) are dispatched in a single atomic payload.
- **Circuit-Breaker Fallbacks & Telemetry:** If upstream AI quotas or network interruptions occur, `VesperOrchestrator` seamlessly degrades to curated archival pieces while logging query latency ($ms$), intent, and recommendation payloads to the `VesperAnalytics` table.

### 2. Size Intelligence — Edge Computer Vision & Anatomical Profiling
Located in `frontend/src/app/vesper/size/` and `backend/src/vesper/vesper-size.service.ts`:

- **Browser-Native Pose Estimation (`@mediapipe/tasks-vision`):** Runs Google MediaPipe's `PoseLandmarker` (`pose_landmarker_lite.task`) directly in the user's browser using WebAssembly (WASM) and WebGL GPU acceleration—ensuring raw webcam video never leaves the client device.
- **60-Frame Stability Calibration:** Tracks 33 3D skeletal landmarks in real time, rendering an architectural HUD overlay on an HTML5 `<canvas>` and locking measurements only after 60 consecutive stabilized video frames.
- **LLM Proportion Synthesis (`gemini-2.5-pro`):** Computed skeletal metrics (shoulder width, chest, waist, sleeve, height, weight, and preferred silhouette) are analyzed by **Google Gemini 2.5 Pro** using `responseMimeType: "application/json"` (`temperature: 0.1`) to classify body architecture (`Athletic Slim`, `Athletic Broad`, `Slender`, `Average`, `Stocky`), generate a confidence score, and persist the profile across future VESPER consultations.

---

## Core Platform Modules

| Module | Route | Engineering Highlights |
| :--- | :--- | :--- |
| **Archival Shop** | `/shop` | Server-rendered catalog with dynamic category filtering, real-time search, and optimistic cart synchronization. |
| **Chapters** | `/chapters/[slug]` | Seasonal archival exhibitions powered by Next.js Incremental Static Regeneration (`revalidate: 60`). |
| **The Forge** | `/forge` | Interactive craftsmanship and material provenance narrative choreographed with GSAP ScrollTrigger and Lenis. |
| **Sanctum** | `/sanctum` | Digital creator ecosystem where independent designers publish material studies, moodboards, and archival concepts. |
| **Showrooms** | `/showrooms/[slug]` | Global physical boutique directory with city-based filtering and architectural gallery views. |
| **VESPER & Size AI** | `/vesper` · `/vesper/size` | Real-time SSE styling concierge and WebGL/MediaPipe skeletal body scanner. |

---

## Technology Stack

### Frontend (`frontend/`)
- **Framework:** Next.js 15.5 (App Router, Turbopack, React Server Components, ISR)
- **UI & Styling:** React 19, TypeScript 5, Tailwind CSS v4, Shadcn UI, Base UI
- **Motion & Physics:** GSAP 3 (`@gsap/react`), Framer Motion 12, Lenis Smooth Scroll
- **Computer Vision:** `@mediapipe/tasks-vision` (WASM + GPU `PoseLandmarker`)
- **State & Validation:** Zustand 5 (persisted stores), React Hook Form 7, Zod 4

### Backend (`backend/`)
- **Framework:** NestJS 11 (Express platform, modular dependency injection, SWC compiler)
- **Database & ORM:** PostgreSQL (Neon Serverless), Prisma ORM 5.22
- **AI SDKs & Models:** `@google/genai` (Gemini 2.5 Pro), Gemini REST SSE API (Gemini 1.5 Flash)
- **Security & Auth:** Passport.js, Stateless JWT, Google OAuth 2.0, `bcrypt`, Helmet, `express-rate-limit`
- **Cloud Services:** Cloudinary v2 (Media CDN), Resend (Transactional Email), Swagger/OpenAPI

---

## Monorepo Structure

```text
ASHENRITUAL/
├── .github/
│   ├── assets/                   # Architectural & UI showcase media
│   └── workflows/ci.yml          # Continuous Integration pipeline
│
├── frontend/                     # Next.js 15 Web Application
│   ├── public/                   # Optimized WebP static assets & media
│   └── src/
│       ├── app/                  # App Router pages, layouts & ISR routes
│       │   ├── chapters/         # Seasonal lookbooks & exhibitions
│       │   ├── forge/            # Material provenance interactive experience
│       │   ├── sanctum/          # Creator ecosystem & concept archives
│       │   ├── shop/             # Primary catalog & product detail views
│       │   ├── showrooms/        # Physical boutique directory
│       │   └── vesper/           # AI Concierge chat & MediaPipe Size scanner
│       ├── components/           # Reusable UI primitives & domain components
│       ├── lib/                  # HTTP API client & utility helpers
│       ├── services/             # SSE streaming & domain service clients
│       └── store/                # Zustand stores (auth, cart, vesper, size, theme)
│
└── backend/                      # NestJS 11 API Service
    ├── prisma/
    │   ├── migrations/           # SQL schema migrations
    │   ├── schema.prisma         # Relational database schema
    │   └── seed.ts               # Catalog & chapter database seeder
    └── src/
        ├── admin/                # Inventory & platform administration
        ├── archives/             # Order processing & historical archives
        ├── auth/                 # JWT, Google OAuth 2.0 & RBAC guards
        ├── cart/                 # Server-side cart validation & sync
        ├── chapters/             # Seasonal collection endpoints
        ├── cloudinary/           # Cloud asset upload & transformation service
        ├── creators/             # Sanctum creator profiles & concepts
        ├── products/             # Catalog querying & filtering
        ├── saved-rituals/        # User wishlist persistence
        ├── search/               # Full-text catalog & entity search
        ├── showrooms/            # Global showroom directory service
        └── vesper/               # AI Orchestrator, RAG engine & Size Intelligence
```

---

## API Reference

| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/register` | Public | Registers a new user account and dispatches verification email. |
| `POST` | `/api/auth/login` | Public | Authenticates credentials and issues signed JWT access tokens. |
| `GET` | `/api/auth/google` | Public | Initiates Google OAuth 2.0 authentication flow. |
| `GET` | `/api/products` | Public | Retrieves catalog items with category, search, and sort filters. |
| `GET` | `/api/chapters` | Public | Lists seasonal chapters and lookbook collections. |
| `GET` | `/api/showrooms` | Public | Lists verified physical boutiques and flagship locations. |
| `GET` | `/api/creators` | Public | Retrieves Sanctum creator profiles and published concepts. |
| `POST` | `/api/vesper/chat` | Optional | Opens a real-time SSE stream for grounded AI styling and actions. |
| `POST` | `/api/vesper/analyze-size` | Public | Executes Gemini 2.5 Pro anatomical proportion and fit synthesis. |
| `GET` | `/api/saved-rituals` | Bearer JWT | Retrieves the authenticated user's saved wardrobe pieces. |
| `POST` | `/api/archives` | Bearer JWT | Validates cart inventory and records a completed order archive. |

---

## Local Development Setup

### Prerequisites
- **Node.js** `>= 20.x`
- **PostgreSQL** instance (Local or Neon Serverless)
- **Google Gemini API Key**

### 1. Backend Service (`backend/`)

```bash
cd backend
npm install
```

Create `backend/.env` (refer to `backend/.env.example`):

```env
PORT=3001
DATABASE_URL="postgresql://user:password@localhost:5432/ashenritual?schema=public"
JWT_SECRET="your_jwt_secret"
GEMINI_API_KEY="your_google_gemini_api_key"
FRONTEND_URL="http://localhost:3000"
```

Run database migrations, seed initial catalog data, and start the development server:

```bash
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run start:dev
```

### 2. Frontend Application (`frontend/`)

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

Start the Next.js development server:

```bash
npm run dev
```

The web client will be available at `http://localhost:3000` and Swagger API documentation at `http://localhost:3001/api/docs`.

---

## License

Distributed under the [MIT License](LICENSE).

<div align="center">
  <br />
  <p><sub><strong>ASHENRITUAL</strong> — Engineered for endurance. Designed for permanence.</sub></p>
</div>
