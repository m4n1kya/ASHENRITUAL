# ASHENRITUAL — Backend API Service

Enterprise NestJS 11 REST & SSE streaming API powering the ASHENRITUAL platform, including catalog orchestration, stateless authentication, and the **VESPER** AI engine.

## Core Modules

- **`vesper/`** — Conversational AI Orchestrator (Google Gemini 1.5 Flash SSE streaming, RAG context retrieval, and Gemini 2.5 Pro Size Intelligence analysis)
- **`auth/`** — Stateless JWT & Google OAuth 2.0 authentication with role-based guards
- **`products/` & `chapters/`** — Archival collections, inventory management, and seasonal lookbooks
- **`showrooms/` & `creators/`** — Global boutique directory and Sanctum creator ecosystem
- **`cart/`, `archives/`, `saved-rituals/`** — Transactional commerce and wardrobe persistence
- **`prisma/`** — PostgreSQL schema, migrations, and database service layer

## Local Development

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run start:dev
```
