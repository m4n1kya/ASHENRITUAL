# ASHENRITUAL Backend

This is the backend service for ASHENRITUAL, a modern full-stack menswear platform. It exposes secure APIs responsible for authentication, business logic, product management, and AI services.

## Technology Stack

- **Framework**: NestJS 11
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **AI Integration**: Google Gemini (@google/genai)
- **Documentation**: Swagger (OpenAPI)

## Getting Started

### Prerequisites

- Node.js (v20+)
- PostgreSQL (running locally or via Docker Compose)

### Installation

```bash
cd backend
npm install
```

### Database Setup

Make sure your PostgreSQL instance is running, and you have set the `DATABASE_URL` in your `.env` file. You can start the database using the provided `docker-compose.yml` in the project root.

```bash
npx prisma generate
npx prisma db push
```

### Running the Application

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

### API Documentation

Once the server is running, you can access the Swagger documentation at:

```
http://localhost:3000/api/docs
```

## Testing

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```
