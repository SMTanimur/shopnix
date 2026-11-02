# Workflow: Bug Fixing

Follow these steps when diagnosing and resolving defects in Shopnix:

1. **Reproduce & Document:**
   - Identify the exact reproduction steps, input data, and observed vs. expected behavior.
   - Inspect backend logs or browser console diagnostics.

2. **Root Cause Analysis:**
   - Determine which layer the bug originates from:
     - Shared Schema validation mismatch (`packages/schemas`)
     - Database query or indexing issue (`apps/api`)
     - State mutation or cache invalidation failure (`apps/web`)
     - Adapter conversion bug (`couriers`)

3. **Write a Failing Test:**
   - Write a unit or integration test that reproduces the defect.
   - Run the test to confirm it fails.

4. **Implement the Fix:**
   - Apply the minimal, cleanest change addressing the root cause.
   - Ensure no unintended side-effects or regressions in adjacent modules.

5. **Verify Resolution:**
   - Ensure the reproduction test now passes.
   - Run `bun run typecheck` and `bun run test`.
   - Update `docs/TODO.md` and report findings.
