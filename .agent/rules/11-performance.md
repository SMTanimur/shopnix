# Rule 11: Performance & Optimization Standards

1. **Frontend Bundle & Render Optimization:**
   - Keep client bundle sizes minimal by using React Server Components for non-interactive layout elements.
   - Utilize dynamic imports (`next/dynamic`) for heavy interactive components (e.g., Recharts visual charts, rich text editors).
   - Optimize images using Next.js `<Image />` with explicit dimensions, modern formats (WebP/AVIF), and lazy loading.
   - Avoid unnecessary re-renders in client components by memoizing callbacks with `useCallback` when passed to virtualized lists or complex tables.

2. **React Query Caching:**
   - Configure sensible `staleTime` defaults (e.g., 2 minutes for catalog data, 30 seconds for active order queues).
   - Perform optimistic updates for instant UI feedback on status transitions, with automated rollback on server mutation failure.

3. **Backend Database Query Optimization:**
   - Every queried field in `.find()` or `.sort()` operations must be indexed in MongoDB.
   - Use aggregation pipelines with `$match` and `$project` stages placed as early in the pipeline as possible.
   - Employ Redis caching for frequently accessed, read-heavy settings (e.g., organization profile, courier configurations).
