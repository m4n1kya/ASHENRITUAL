# ASHENRITUAL Architecture & Implementation Guide

ASHENRITUAL is a production-grade, headless e-commerce application built on a modern TypeScript micro-architecture. It emphasizes high-performance fluid user interfaces, scalable RESTful API design, and an integrated, context-aware Artificial Intelligence orchestration layer.

## 1. Architectural Overview

The application is structured as a monorepo containing two fully isolated applications: a Next.js frontend and a NestJS backend. This separation of concerns allows for independent deployment, scaling, and technology iteration.

### 1.1 Frontend (Next.js 15, React 19)
The frontend utilizes the Next.js App Router to aggressively leverage Server-Side Rendering (SSR) and React Server Components (RSC) for maximum SEO performance and reduced client-side JavaScript payloads.

- **State Management**: Client-side state (authentication tokens, cart contents, UI toggles) is managed globally via Zustand.
- **Styling**: Tailored utility classes via Tailwind CSS, strictly adhering to a brutalist, monochromatic design system.
- **Animation Physics**: GSAP (GreenSock Animation Platform) handles complex timeline sequencing, while Lenis manages smooth scroll interpolation, bypassing native browser scroll behavior to ensure fluid 60FPS rendering.
- **Routing**: Client-side transitions are optimized using next/navigation, preserving application state without full page reloads.

### 1.2 Backend (NestJS, Node.js)
The backend is built on NestJS, a progressive Node.js framework providing strict architectural patterns via dependency injection, decorators, and modular encapsulation.

- **Database**: PostgreSQL hosted on Neon, accessed via Prisma ORM for type-safe database queries.
- **Authentication**: Stateless authentication using JSON Web Tokens (JWT). The system issues short-lived access tokens and secure HttpOnly refresh tokens to mitigate XSS and CSRF vulnerabilities.
- **Security**: The API layer is hardened using Helmet (HTTP header security), Express Rate Limiting (DDoS mitigation), and strict Cross-Origin Resource Sharing (CORS) configurations restricted to the production frontend domain.

### 1.3 Vesper (Artificial Intelligence Layer)
Vesper is a proprietary AI stylist and shopping assistant integrated directly into the core platform, powered by the Google Gemini API.

- **Context Awareness**: Vesper receives real-time context regarding the user's current navigational state (e.g., viewing a specific product or category) to inform its responses.
- **Server-Sent Events (SSE)**: To minimize latency, Vesper's responses are streamed to the client in real-time. The orchestrator separates plain text dialogue from structured JSON payloads (product recommendations, UI actions) during the streaming process, allowing the frontend to render dynamic UI components asynchronously as the AI "types".

## 2. Infrastructure & Deployment

The deployment pipeline is fully automated via GitOps, utilizing exclusively permanent free-tier cloud infrastructure.

- **Frontend Hosting**: Vercel (Edge Network)
- **Backend Hosting**: Render (Web Service)
- **Database Hosting**: Neon (Serverless PostgreSQL)
- **Continuous Integration (CI)**: Push events to the `main` branch automatically trigger concurrent builds on Vercel and Render. The backend executes `npx prisma migrate deploy` prior to application startup to ensure schema synchronization.

## 3. Local Development Setup

### 3.1 Prerequisites
- Node.js (v20.x or higher)
- PostgreSQL (Local instance or cloud connection string)
- Google Gemini API Key

### 3.2 Backend Configuration
Navigate to the `backend` directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the root of the backend directory with the following specifications:

```env
PORT=3001
DATABASE_URL="postgresql://username:password@host/database"
JWT_SECRET="your_cryptographic_secret"
JWT_REFRESH_SECRET="your_cryptographic_refresh_secret"
GOOGLE_GEMINI_API_KEY="your_gemini_api_key"
FRONTEND_URL="http://localhost:3000"
RESEND_API_KEY="" # Optional
```

Synchronize the Prisma schema and seed the database with initial products and administrative accounts:

```bash
npx prisma db push --accept-data-loss
npx prisma db seed
npm run start:dev
```

### 3.3 Frontend Configuration
Navigate to the `frontend` directory and install dependencies:

```bash
cd frontend
npm install
```

Create a `.env.local` file in the root of the frontend directory:

```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

Initialize the Next.js development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

## 4. API Reference

The backend exposes a comprehensive RESTful API. Below is a high-level overview of the primary resource endpoints:

- `POST /api/auth/register` - Create a new user account.
- `POST /api/auth/login` - Authenticate and receive JWT tokens.
- `GET /api/auth/me` - Retrieve the currently authenticated user's profile.
- `GET /api/products` - Retrieve a paginated list of products.
- `GET /api/products/:id` - Retrieve specific product details.
- `GET /api/chapters` - Retrieve editorial collections and lookbooks.
- `GET /api/categories` - Retrieve product taxonomy.
- `POST /api/vesper/chat` - Initiate an SSE stream with the Vesper AI orchestrator.

## 5. Security & Best Practices

- **Environment Variables**: Never commit `.env` files to version control. The repository relies on `.env.example` templates.
- **Type Safety**: Both frontend and backend share strict TypeScript definitions ensuring data integrity across the network boundary.
- **ESLint Configurations**: The project adheres to strict static analysis rules. Code failing linting checks will automatically abort the Vercel production build process.

## 6. License

Proprietary software. All rights reserved. Do not distribute without explicit permission.
