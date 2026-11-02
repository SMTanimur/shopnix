# Rule 10: Testing & Verification Standards

1. **Test-Driven Verification:**
   - Every utility, shared schema, and business service must have corresponding automated unit tests.
   - Run tests with `bun run test` before declaring any task complete.

2. **Backend Integration Testing:**
   - Test critical authentication endpoints, tenant isolation, and RBAC authorization using Supertest.
   - Test the order status state machine to guarantee that illegal status jumps are rejected.

3. **Frontend Component & Hook Testing:**
   - Test critical reusable components (`PageHeader`, `DataTable`, `StatCard`, `ConfirmDialog`) with React Testing Library.
   - Test form validation behaviors to ensure proper display of inline error states.

4. **Zero Flakiness:**
   - Tests must be deterministic. Never use arbitrary `setTimeout` delays in test assertions. Use proper async `waitFor` or event listeners.
