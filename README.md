# ASHENRITUAL

> *Presence isn't purchased. It's cultivated.*

ASHENRITUAL is a modern full-stack menswear platform that combines luxury retail, intelligent software engineering, and artificial intelligence into a single, immersive experience.

Designed around the philosophy of **Quiet Luxury**, the platform emphasizes intentional design, timeless aesthetics, and a seamless user experience rather than conventional e-commerce patterns.

Beyond being an online fashion store, ASHENRITUAL serves as a demonstration of scalable backend architecture, modern frontend engineering, AI integration, and production-ready development practices.

---

# Table of Contents

- Overview
- Core Features
- System Architecture
- Technology Stack
- Project Structure
- Getting Started
- VESPER Intelligence
- Roadmap
- Future Enhancements
- License

---

# Overview

ASHENRITUAL is built as a modular, scalable web application using a decoupled architecture.

The frontend is responsible for delivering a cinematic user experience through Next.js and modern UI technologies, while the backend exposes secure APIs responsible for authentication, business logic, product management, and AI services.

The project is intended to demonstrate:

- Modern Full Stack Development
- REST API Design
- Database Modeling
- Authentication & Authorization
- AI Integration
- Responsive User Experience
- Clean Software Architecture
- Production-ready Development Practices

---

# Core Features

## Customer Experience

- Premium landing experience
- Editorial-inspired shopping interface
- Product catalogue with advanced filtering
- Saved Rituals (Wishlist)
- Shopping cart
- Checkout workflow
- User profiles
- Order history
- Responsive design

## VESPER Intelligence

VESPER is the platform's proprietary wardrobe intelligence system.

Unlike traditional conversational chatbots, VESPER operates as an intelligent wardrobe companion capable of understanding user preferences, styling requirements, previous purchases, and contextual fashion recommendations.

Capabilities include:

- Personalized outfit recommendations
- Context-aware styling advice
- Occasion-based suggestions
- Capsule wardrobe guidance
- Intelligent product discovery
- Natural language fashion search
- Future support for wardrobe memory

Powered by Google Gemini.

---

# System Architecture

```
                 Client Browser
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
     Next.js 15                 NestJS API
        │                             │
        │                             │
        └──────────────┬──────────────┘
                       │
                 Prisma ORM
                       │
                  PostgreSQL
                       │
          Google Gemini (VESPER)
```

The architecture intentionally separates presentation from business logic, allowing independent scalability of frontend and backend services.

---

# Technology Stack

## Frontend

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Framer Motion

## Backend

- NestJS
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Swagger (OpenAPI)

## Artificial Intelligence

- Google Gemini API
- VESPER Wardrobe Intelligence

## Infrastructure

- Docker
- Docker Compose

---

# Project Structure

```
ASHENRITUAL
│
├── frontend
│   ├── app
│   ├── components
│   ├── hooks
│   ├── lib
│   ├── public
│   └── styles
│
├── backend
│   ├── prisma
│   ├── src
│   ├── modules
│   └── common
│
├── docs
│
└── README.md
```

---

# Getting Started

## Clone Repository

```bash
git clone https://github.com/m4n1kya/ASHENRITUAL.git

cd ASHENRITUAL
```

## Backend

```bash
cd backend

npm install

npx prisma generate

npx prisma db push

npm run start:dev
```

Swagger Documentation

```
http://localhost:3000/api/docs
```

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Application

```
http://localhost:3001
```

---

# Development Roadmap

## Phase I

- Landing Experience
- Authentication
- Product Catalogue
- Database Design
- Responsive UI

## Phase II

- Complete Shopping Experience
- Saved Rituals
- Checkout
- Orders
- User Dashboard

## Phase III

- VESPER Intelligence
- Context-aware Recommendations
- Semantic Product Search
- Intelligent Outfit Generation

## Phase IV

- AI Virtual Try-On
- Body Measurement Estimation
- Size Recommendation
- Garment Simulation

---

# Future Enhancements

The long-term vision for ASHENRITUAL includes:

- Real-time inventory synchronization
- AI-generated outfit collections
- Wardrobe memory
- Sustainability insights
- Virtual fitting room
- Performance analytics dashboard
- Administrative management portal
- Mobile application

---

# Design Philosophy

ASHENRITUAL follows four guiding principles.

- Simplicity over complexity
- Precision over decoration
- Timelessness over trends
- Experience over functionality

Every interaction is intentionally designed to feel quiet, refined, and considered.

---

# License

This project is licensed under the MIT License.

---

# Author

**Manikya N**

Computer Science Engineering Student

Full Stack Developer • AI Enthusiast • Software Engineer

GitHub: https://github.com/m4n1kya
