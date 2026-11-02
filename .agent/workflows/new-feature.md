# Workflow: New Feature Implementation

Follow these steps when implementing any new feature in Shopnix:

1. **Contract First (Domain & Schemas):**
   - Define entity types and interfaces in `packages/types`.
   - Define input validation schemas in `packages/schemas` using Zod.
   - Run typecheck to verify contracts are syntactically sound.

2. **Backend Implementation:**
   - Create or update the NestJS module, controller, and service in `apps/api/src/modules/`.
   - Create or update Mongoose schema and model in `apps/api/src/database/` with snake_case fields and compound indexes.
   - Wire up route handlers with native Zod validation pipe, `@CurrentUser()`, `@Roles()`, and Swagger decorators.
   - Enforce tenant isolation (`{ organization_id }`).

3. **API Client Integration:**
   - Expose strongly typed client methods in `packages/api-client`.

4. **Frontend UI Implementation:**
   - Check if reusable components exist in `components/shared` or `components/data-display`. If new reusable components are needed, follow the folder structure (`component-name/index.tsx` + barrel `index.ts`).
   - Create feature hooks utilizing TanStack Query in `apps/web/src/features/[feature]/hooks/`.
   - Build page view with proper loading skeletons, empty states, and error handling.

5. **Verification & Testing:**
   - Execute unit tests (`bun run test`).
   - Run TypeScript check (`bun run typecheck`) and linter (`bun run lint`).
   - Test responsive viewports (mobile, tablet, desktop).
   - Update `docs/TODO.md`.
