# Shopnix

> Premium Ecommerce Operations & Business Management SaaS for high-growth online retailers and social commerce sellers.

---

## Overview
Shopnix is a full-stack, multi-tenant ecommerce operations platform. It integrates catalog building, inventory management, order orchestration, 360° customer relationship management, and automated courier fulfillment (Steadfast, Pathao, RedX, eCourier) into an interface inspired by Linear and Stripe.

---

## Architecture
- **Monorepo:** Turborepo + Bun workspaces
- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn/ui, TanStack Query, Zustand, React Hook Form, Zod, Motion, Recharts
- **Backend:** NestJS 12, Node.js 22 LTS, MongoDB 8.0, Mongoose 9.x, Redis 7.0, Swagger OpenAPI, JWT with refresh token rotation
- **Shared Packages:** `@shopnix/types`, `@shopnix/schemas`, `@shopnix/api-client`, `@shopnix/utils`, `@shopnix/config`, `@shopnix/eslint-config`

---

## Quickstart

### Prerequisites
- [Bun](https://bun.sh) (v1.2+)
- [Node.js](https://nodejs.org) (v22.x LTS)
- [Docker](https://www.docker.com) & Docker Compose (optional for containerized setup)

### Setup & Installation
```bash
# Clone the repository
git clone <repo-url>
cd shopnix

# Copy environment variables
cp .env.example .env

# Install all workspace dependencies via Bun
bun install

# Run database & cache via Docker
docker-compose up -d mongo redis

# Run dev environment across all apps
bun run dev
```

The web dashboard runs at `http://localhost:3000` and the API service at `http://localhost:4000/api/v1`.
Interactive Swagger documentation is available at `http://localhost:4000/api/docs`.

---

## Development Commands
```bash
bun run dev          # Start all applications in watch mode
bun run build        # Build all applications and packages
bun run lint         # Lint all files across the monorepo
bun run typecheck    # Validate TypeScript types across all workspaces
bun run test         # Execute unit and contract test suites
```

---

## Documentation
- [System Architecture](docs/ARCHITECTURE.md)
- [Product Requirements (PRD)](docs/PRODUCT_REQUIREMENTS.md)
- [Database Models & Indexes](docs/DATABASE.md)
- [Reverse Engineering Analysis](docs/REVERSE_ENGINEERING.md)
- [Feature Comparison Matrix](docs/FEATURE_MATRIX.md)
- [Technology Stack](docs/TECH_STACK.md)
- [Testing & Quality Assurance](docs/TESTING.md)
- [Development Tasks & TODO](docs/TODO.md)
- [Architectural Decision Records (ADRs)](docs/DECISIONS.md)
