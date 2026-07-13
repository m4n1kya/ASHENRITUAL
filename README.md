# ASHENRITUAL

> *Presence isn't purchased. It's cultivated.*

A luxury menswear platform where technology, craftsmanship, and artificial intelligence converge.

ASHENRITUAL is a modern full-stack e-commerce experience inspired by the philosophy of **Quiet Luxury**—minimal, timeless, intentional.

Rather than chasing trends, the platform focuses on creating an immersive shopping experience through cinematic design, intelligent wardrobe assistance, and AI-powered personalization.

---

## Preview

> *Landing Page (Coming Soon)*

*(Screenshots and demo GIFs will be added as the project evolves.)*

---

# Philosophy

ASHENRITUAL is built around four principles.

- **Intentional** — Every interaction has a purpose.
- **Timeless** — Design that outlives trends.
- **Minimal** — Luxury through restraint.
- **Precision** — Every detail matters.

Fashion is not about attention.

It is about identity.

---

# Features

## Luxury Shopping Experience

- Cinematic landing page
- Quiet luxury design language
- Responsive experience
- Premium product pages
- Wishlist ("Saved Rituals")
- Secure authentication
- Shopping cart
- Checkout flow
- Order history

---

## VESPER — Wardrobe Intelligence

VESPER is not a chatbot.

It is an AI wardrobe companion designed to understand style rather than simply answer questions.

Capabilities include:

- Outfit recommendations
- Occasion-based styling
- Capsule wardrobe suggestions
- Fabric & layering advice
- Seasonal recommendations
- Personalized fashion guidance
- Product discovery
- Intelligent search

Built using Google Gemini.

---

## AI Try-On (Future Integration)

ASHENRITUAL will integrate a real-time AI Try-On experience allowing users to:

- Upload their photo
- Visualize garments on their body
- Estimate garment fit
- Compare multiple outfits
- Receive AI styling suggestions from VESPER

---

# Architecture

```
                Next.js Frontend
                       │
        ┌──────────────┼──────────────┐
        │              │              │
 Authentication   Product APIs   VESPER AI
        │              │              │
        └──────────────┼──────────────┘
                       │
                  NestJS Backend
                       │
                    Prisma ORM
                       │
                  PostgreSQL
```

---

# Tech Stack

## Frontend

- Next.js 15
- React 19
- Tailwind CSS v4
- shadcn/ui
- Framer Motion
- TypeScript

## Backend

- NestJS
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Swagger

## AI

- Google Gemini API
- VESPER Intelligence

## Infrastructure

- Docker
- Docker Compose

---

# Project Structure

```
ASHENRITUAL
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── public/
│
├── backend/
│   ├── src/
│   ├── prisma/
│   └── modules/
│
└── README.md
```

---

# Getting Started

## Clone

```bash
git clone https://github.com/m4n1kya/ASHENRITUAL.git

cd ASHENRITUAL
```

---

## Backend

```bash
cd backend

npm install

npx prisma generate

npx prisma db push

npm run start:dev
```

Backend runs on:

```
http://localhost:3000
```

Swagger:

```
http://localhost:3000/api/docs
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```
http://localhost:3001
```

---

# Roadmap

- [x] Project Architecture
- [x] Initial Landing Page
- [ ] Shop Experience
- [ ] Product Details
- [ ] Authentication
- [ ] Saved Rituals
- [ ] Checkout
- [ ] Orders
- [ ] VESPER AI
- [ ] AI Try-On
- [ ] Admin Dashboard
- [ ] Deployment

---

# Design Inspiration

ASHENRITUAL draws inspiration from:

- Quiet Luxury
- Brutalist Architecture
- Editorial Fashion
- Architectural Minimalism
- Museum Curation
- Monochrome Photography

---

# Author

**Manikya N**

Computer Science Engineering • Full Stack Developer • AI Enthusiast

GitHub

https://github.com/m4n1kya

---

# License

MIT License
