# ASHENRITUAL

> Confidence is quiet. Discipline is attractive. Luxury doesn't need to shout. Every piece is intentional. Fashion is identity, not attention.

ASHENRITUAL is an enterprise-grade, full-stack menswear e-commerce platform built with a focus on "quiet luxury", precision, and sophisticated design. This project demonstrates high-end full-stack engineering, microservice-like architecture, and artificial intelligence integration.

## 🏛 Architecture

The platform utilizes a decoupled architecture where **Next.js** serves as a fast, cinematic frontend (SSR/SSG), and **NestJS** acts as a robust API backend handling all business logic, authentication, and database operations.

\`\`\`mermaid
graph TD
    Client[Client/Browser] -->|HTTP/HTTPS| Frontend[Next.js Frontend]
    Client -->|API Requests| Backend[NestJS Backend]
    Frontend -->|Server Actions / API| Backend
    Backend -->|JWT Validation| Auth[Authentication Layer]
    Backend -->|Prisma ORM| Database[(PostgreSQL)]
    Backend -->|REST/gRPC| OBLIV[OBLIV Wardrobe Intelligence - Gemini]
    
    subgraph Infrastructure
        Database
    end
\`\`\`

## 💾 Database Entity-Relationship (ER) Diagram

The database is built on PostgreSQL using Prisma ORM.

\`\`\`mermaid
erDiagram
    USER ||--o{ SAVED_RITUAL : saves
    USER ||--o{ ARCHIVE : creates
    USER ||--o{ REVIEW : writes
    USER ||--o{ ADDRESS : has
    CATEGORY ||--|{ PRODUCT : contains
    PRODUCT ||--o{ SAVED_RITUAL : "saved as"
    PRODUCT ||--o{ ORDER_ITEM : "ordered as"
    PRODUCT ||--o{ REVIEW : receives
    ARCHIVE ||--|{ ORDER_ITEM : contains

    USER {
        string id PK
        string email
        string passwordHash
        enum role
        DateTime createdAt
    }
    PRODUCT {
        string id PK
        string name
        string description
        decimal price
        int stock
        string categoryId FK
    }
    ARCHIVE {
        string id PK
        string userId FK
        decimal total
        enum status
    }
    ORDER_ITEM {
        string id PK
        string archiveId FK
        string productId FK
        int quantity
        decimal price
    }
    OBLIV {
        string id PK
        string personality "Quiet, Minimal, Sophisticated"
    }
\`\`\`

## 🛠 Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- Tailwind CSS v4
- shadcn/ui
- Framer Motion

**Backend:**
- NestJS
- PostgreSQL
- Prisma ORM
- NextAuth / JWT Authentication
- Swagger (OpenAPI)

**AI Integration:**
- Google Gemini API (OBLIV Intelligence)

**Infrastructure:**
- Docker & Docker Compose

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+
- Docker & Docker Compose

### 2. Infrastructure
Start the PostgreSQL database:
\`\`\`bash
docker-compose up -d
\`\`\`

### 3. Backend Setup
\`\`\`bash
cd backend
npm install
# Generate Prisma Client and apply migrations
npx prisma generate
npx prisma db push
# Start the NestJS API
npm run start:dev
\`\`\`
Swagger API documentation will be available at \`http://localhost:3000/api/docs\`.

### 4. Frontend Setup
\`\`\`bash
cd frontend
npm install
# Start Next.js Development Server
npm run dev
\`\`\`
The cinematic frontend will be available at \`http://localhost:3001\`.

## 👔 OBLIV - Wardrobe Intelligence
OBLIV is not a chatbot. It is a proprietary wardrobe intelligence system designed to act as an invisible creative director, offering precise, minimal, and sophisticated styling advice based on user context and occasion.
