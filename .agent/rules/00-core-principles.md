# Rule 00: Core Engineering Principles

Every engineer and AI agent working on **Shopnix** must uphold these foundational principles at all times:

1. **Production-First Mindset:** Write code intended for real production environments handling mission-critical ecommerce operations and financial transactions. Never create toy mocks, unhandled edge cases, or temporary hacks without explicit rationale.
2. **Modular Architecture:** Isolate responsibilities strictly. Keep UI presentation separate from business logic, domain entities separate from persistence details, and client logic isolated from server internals.
3. **DRY & Single Source of Truth:** Never duplicate domain models, enums, or validation rules across frontend and backend. Store them in shared workspace packages (`@shopnix/types`, `@shopnix/schemas`).
4. **Tenant Isolation Above All:** Shopnix is a multi-tenant SaaS platform. Every tenant-owned database query, mutation, event, and background job must explicitly scope by `organization_id`. Cross-tenant data leakage is a critical system failure.
5. **Strict Type Safety:** Enable and respect TypeScript strict mode everywhere. No `any`, no implicit types, and no unsafe casts (`as unknown as T`).
6. **Accessible & Responsive by Default:** All UI components must meet WCAG 2.1 AA accessibility standards and be tested across mobile (320px), tablet (768px), and desktop (1024px+) viewports.
7. **Complete Documentation & Task Tracking:** Always keep `docs/TODO.md` updated as tasks progress. Record major architectural shifts in `docs/DECISIONS.md`.
