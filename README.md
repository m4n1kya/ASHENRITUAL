# ASHENRITUAL

A modern, minimalist e-commerce platform designed with an emphasis on seamless user experience, architectural aesthetics, and integrated artificial intelligence.

## 🌟 Overview

ASHENRITUAL is a full-stack, production-ready e-commerce application featuring a bespoke AI shopping assistant named **Vesper**. The platform is designed to provide a premium shopping experience through fluid GSAP animations, a custom dark-mode aesthetic, and intelligent, context-aware product recommendations.

## 🛠️ Technology Stack

The project is structured as a monorepo containing a separated frontend and backend.

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [GSAP](https://gsap.com/) (GreenSock) & [Lenis](https://lenis.studiofreight.com/) (Smooth Scrolling)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Deployment**: [Vercel](https://vercel.com/)

### Backend
- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: PostgreSQL (Hosted on [Neon](https://neon.tech/))
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: [Render](https://render.com/)

### Artificial Intelligence
- **Provider**: Google Gemini API
- **Implementation**: Custom AI Orchestrator (Vesper) capable of maintaining chat history, parsing product context, and streaming JSON/Text responses to the frontend.

## ✨ Core Features

- **Vesper AI Stylist**: An integrated AI assistant that provides tailored fashion advice, dynamically rendering product recommendations directly in the chat interface via Server-Sent Events (SSE).
- **Premium UI/UX**: Custom cursor, smooth scroll physics, magnetic buttons, and page transition animations.
- **Secure Authentication**: Robust JWT-based authentication with encrypted password hashing.
- **Dynamic Cart & Checkout**: Persistent cart state management with real-time total calculations.
- **Production Grade**: Configured with strict CORS policies, Helmet security headers, GZIP compression, and graceful shutdown hooks.

## 🚀 Live Deployment

- **Frontend**: Hosted on Vercel
- **Backend API**: Hosted on Render
- **Database**: Hosted on Neon

*(Deployment is optimized for permanent free-tier cloud infrastructure).*

## 💻 Local Development

### Prerequisites
- Node.js (v20+)
- PostgreSQL (Local or Cloud)

### 1. Setup Backend
```bash
cd backend
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your local PostgreSQL DATABASE_URL and Gemini API Key

# Run database migrations and seed default products
npx prisma db push
npx prisma db seed

# Start the development server
npm run start:dev
```

### 2. Setup Frontend
```bash
cd frontend
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local to point NEXT_PUBLIC_API_URL to http://localhost:3001/api

# Start the development server
npm run dev
```

## 📜 License

Designed and engineered by m4n1kya. All rights reserved.
