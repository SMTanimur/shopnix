# Rule 13: Task Completion & Verification Checklist

Before marking ANY development task or phase as complete, every engineer and AI agent MUST execute and verify all 12 steps of this protocol:

1. **TypeScript Verification:**
   Run `bun run typecheck`. Ensure 0 errors, 0 warnings across all workspaces.
2. **ESLint Verification:**
   Run `bun run lint`. Resolve all linting diagnostics.
3. **Automated Unit & Integration Tests:**
   Run `bun run test`. Verify all test suites pass with 100% success.
4. **Build Verification:**
   Run `bun run build`. Ensure all Next.js and NestJS bundles build cleanly.
5. **Broken Import Audit:**
   Verify no dangling, relative, or circular imports exist across packages.
6. **Responsive Layout Check:**
   Confirm UI layouts render cleanly at 320px, 375px, 768px, 1024px, and 1440px widths.
7. **UI State Completeness:**
   Verify Loading, Empty, Error, and Success states are implemented and styled.
8. **Browser Console Check:**
   Ensure zero unhandled runtime exceptions or React hydration warnings appear.
9. **API Error & Validation Check:**
   Verify invalid inputs return structured HTTP 400 responses with descriptive field errors.
10. **Documentation Synchronization:**
    Update corresponding documentation files in `docs/` if architectural details changed.
11. **TODO Tracking:**
    Update `docs/TODO.md`, marking completed tasks with `[x]` and noting any blockers.
12. **Final Summary:**
    Provide a clear, concise report to the user summarizing what was built, verified, and what the next immediate step is.
