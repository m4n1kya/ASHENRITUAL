

<div align="center">
  <h1>ASHENRITUAL</h1>
  <p>Luxury Fashion • Artificial Intelligence • Modern Web Engineering</p>
  
  <p><strong><a href="https://ashenritual-e2ql.vercel.app">🌍 View Live Deployment</a></strong></p>

  <img src="https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=flat&logo=google&logoColor=white" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white" alt="Node.js" />
</div>

<br />

---

## Introduction

ASHENRITUAL is a production-grade, headless e-commerce platform built to seamlessly merge the tactile experience of luxury fashion with the computational power of artificial intelligence. Engineered entirely on a modern TypeScript micro-architecture, the application delivers a cinematic user interface optimized for high-performance rendering.

The platform is designed to transcend standard transactional commerce by introducing conversational commerce. At its core operates VESPER, a proprietary artificial intelligence orchestrator that provides context-aware styling advice, dynamic product curation, and real-time interaction.

Built upon strict software engineering principles, the system separates the presentation layer from the business logic. This decoupled architecture allows for rigorous security implementations, independent scalability, and the integration of advanced server-side rendering techniques.

---

## Features

### AI Fashion Concierge
Integrated directly into the interface, the AI acts as a personal stylist, reading the user's current navigational context to provide highly tailored recommendations.

### Server-Side Rendering
Leveraging React Server Components and Next.js SSR, the frontend pre-computes HTML on the server edge, guaranteeing instantaneous initial page loads and optimal SEO indexing.

### Real-time AI Streaming
Dialogue and structured data from the AI engine are streamed asynchronously via Server-Sent Events (SSE), enabling the interface to render complex UI elements dynamically as the model generates output.

### Headless Commerce
The frontend and backend communicate exclusively via a secure RESTful API, ensuring complete technological decoupling and allowing multiple client interfaces to consume the same business logic.

### Stateless Authentication
User sessions are maintained using short-lived JSON Web Tokens (JWT) combined with secure, HTTP-only refresh tokens to mitigate persistent session hijacking vectors.

### Cinematic Interface
Fluid scroll mechanics, advanced timelines, and magnetic interactions are engineered via GSAP and Lenis, creating a frictionless and highly responsive visual experience.

---

## Architecture

```text
Client Application
       │
       ▼
 [ Next.js Frontend ]  <-- React Server Components, Zustand, GSAP
       │
       ▼
 [ NestJS Backend ]    <-- Dependency Injection, REST API, Guards
       │
       ├───────────────┐
       ▼               ▼
 [ Prisma ORM ]  [ Google Gemini API ]  <-- LLM Orchestration
       │
       ▼
[ Neon PostgreSQL ]    <-- Serverless Relational Database
```

The system routes user requests through the Vercel Edge Network to the Next.js frontend. The frontend securely queries the NestJS backend via stateless HTTP requests. The backend orchestrates data retrieval through Prisma from the Neon database and interfaces with the Gemini API to parse and generate AI-driven context.

---

## Tech Stack

### Frontend Architecture
| Layer | Technology |
| :--- | :--- |
| Framework | Next.js 15 (App Router) |
| UI Library | React 19 |
| State Management | Zustand |
| Styling | Tailwind CSS |
| Animation | GSAP |
| Scroll Physics | Lenis |
| Deployment | Vercel |

### Backend Architecture
| Layer | Technology |
| :--- | :--- |
| Framework | NestJS |
| Runtime | Node.js 20+ |
| Database | Neon (PostgreSQL) |
| ORM | Prisma |
| Authentication | JWT (Stateless) |
| AI Integration | Google Gemini API |
| Deployment | Render |

---

## VESPER (AI Orchestrator)

VESPER is the artificial intelligence subsystem embedded within ASHENRITUAL. It is designed to interpret complex user styling queries and execute corresponding UI actions.

**Streaming Architecture**
Rather than waiting for the entire LLM response to complete, the backend utilizes Server-Sent Events to stream data in real-time. The orchestrator separates the stream into two distinct payloads: conversational dialogue and structured JSON recommendation data.

**Context Awareness**
When a user engages VESPER, the frontend transmits their current local time, the active page route, and the specific product ID being viewed. VESPER utilizes this metadata to generate highly specific, contextually relevant responses rather than generic fashion advice.

**Backend Orchestration**
The NestJS backend acts as a secure proxy and prompt engineer. It receives the user query, injects system directives to enforce brand tone, restricts the LLM to output specific JSON schemas, and pipes the resulting generation stream back to the client securely.

---

## Project Structure

```text
ASHENRITUAL/
├── frontend/                 # Next.js Application
│   ├── src/
│   │   ├── app/              # App Router Pages & Layouts
│   │   ├── components/       # Reusable UI Components
│   │   ├── lib/              # API Clients & Utility Functions
│   │   ├── store/            # Zustand State Stores
│   │   └── types/            # TypeScript Interfaces
│   └── public/               # Static Assets
│
├── backend/                  # NestJS Application
│   ├── src/
│   │   ├── auth/             # JWT Authentication Module
│   │   ├── products/         # Product Management Module
│   │   ├── vesper/           # AI Orchestration Module
│   │   ├── prisma/           # Database Service Layer
│   │   └── main.ts           # Application Entry Point
│   └── prisma/
│       ├── schema.prisma     # Database Schema Definition
│       └── seed.ts           # Initial Data Population
│
└── docs/                     # Project Documentation & Images
```

---

## Getting Started

### Prerequisites
- Node.js (v20.x or higher)
- PostgreSQL Database
- Google Gemini API Key

### Backend Configuration

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment variables in `backend/.env`:
```env
PORT=3001
DATABASE_URL="postgresql://user:password@host/db"
JWT_SECRET="cryptographic_secret"
JWT_REFRESH_SECRET="cryptographic_refresh_secret"
GOOGLE_GEMINI_API_KEY="your_api_key"
FRONTEND_URL="http://localhost:3000"
```

3. Synchronize database and populate seed data:
```bash
npx prisma db push --accept-data-loss
npx prisma db seed
```

4. Initialize the server:
```bash
npm run start:dev
```

### Frontend Configuration

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Configure environment variables in `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

3. Initialize the client:
```bash
npm run dev
```

---

## API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Cryptographically hashes passwords and creates user records. |
| `POST` | `/api/auth/login` | Validates credentials and returns JWT access tokens. |
| `GET` | `/api/auth/me` | Returns the authenticated user's profile based on the JWT payload. |
| `GET` | `/api/products` | Retrieves a paginated list of all active products. |
| `GET` | `/api/products/:id` | Retrieves comprehensive data for a single product entity. |
| `POST` | `/api/vesper/chat` | Initiates an SSE connection for real-time AI generation. |

---

## Deployment

The application is configured for zero-downtime automated deployments via a strict GitOps pipeline.

**Vercel (Frontend)**
Configured to automatically build and distribute the Next.js application across a global edge network upon pushes to the main branch. Requires the `NEXT_PUBLIC_API_URL` environment variable.

**Render (Backend)**
Operates as a persistent web service. The build pipeline is configured to compile the NestJS application and execute `npx prisma migrate deploy` before startup to ensure schema synchronization.

**Neon (Database)**
Provides serverless PostgreSQL scaling dynamically with connection demand, ensuring high availability without manual resource provisioning.

---

## Performance Optimizations

**React Server Components (RSC)**
Critical UI layouts and static data fetches are executed exclusively on the server. This drastically reduces the client-side JavaScript bundle size and improves Time to Interactive (TTI).

**Image Optimization**
The Next.js Image component handles automatic format selection (WebP/AVIF), lazy loading, and responsive resizing, mitigating Cumulative Layout Shift (CLS).

**Code Splitting**
Webpack automatically chunks route-specific code, ensuring the browser only downloads the JavaScript required for the currently active view.

**GZIP Compression**
The NestJS backend intercepts all outbound HTTP responses and applies GZIP compression, significantly reducing the payload size of large JSON requests.

---

## Security Protocol

**Stateless JWT Authentication**
Sessions are managed without database lookups using signed JSON Web Tokens. Access tokens are short-lived, while refresh tokens are highly restricted.

**Helmet Headers**
The backend enforces strict HTTP security headers via Helmet, protecting against clickjacking, cross-site scripting (XSS), and MIME-type sniffing.

**Rate Limiting**
Critical API endpoints are protected by rate limiters to prevent brute-force authentication attacks and DDoS vectors.

**Cross-Origin Resource Sharing (CORS)**
The API explicitly rejects requests originating from unauthorized domains, ensuring only the official Vercel frontend can interface with the backend.

**Environment Isolation**
Cryptographic keys and connection strings are strictly isolated from the source code via environment variables, ensuring zero credential leakage in version control.

---

<div align="center">
  <p>Engineered for endurance. Designed for permanence.</p>
</div>
