# Workflow: Code Refactoring

Follow these steps when refactoring existing code in Shopnix:

1. **Safety First (Test Coverage):**
   - Verify that test coverage exists for the target code before modifying it.
   - Run existing tests to establish a passing baseline.

2. **Incremental Refactoring Steps:**
   - Make small, focused changes. Avoid massive architectural shifts in a single step.
   - Extract functions, split oversized files (> 250 lines), and eliminate duplicate UI code.

3. **Preserve Public API Contracts:**
   - Ensure external function signatures, DTOs, and component props remain backwards-compatible.
   - If an API contract must change, update shared packages first, followed by consumers.

4. **Verify Behavior Preserved:**
   - Run `bun run typecheck`, `bun run lint`, and `bun run test`.
   - Confirm all tests pass without regressions.
