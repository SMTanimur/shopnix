# Workflow: Code Review & Quality Audit

Checklist to follow when reviewing changes before marking a task complete:

- [ ] **TypeScript Strictness:** Are types explicit? Are there any `any` types or unsafe casts?
- [ ] **Tenant Isolation:** Are all database queries and mutations scoped with `{ organization_id }`?
- [ ] **Component Folder Format:** Are components placed in dedicated folders with `index.tsx` and exported via barrel `index.ts`?
- [ ] **Zod Schema Synchronization:** Are schemas in `@shopnix/schemas` consumed by both frontend forms and backend validation pipes?
- [ ] **Error Handling:** Are exceptions caught and returned in the standard API envelope?
- [ ] **File Size Compliance:** Are all source files under 250 lines (or 500 lines max for complex builders)?
- [ ] **Responsive Design:** Are layouts tested across mobile, tablet, and desktop?
- [ ] **Performance:** Are heavy components lazy-loaded? Are indexes defined for queried fields?
- [ ] **Security:** Are secrets excluded? Are inputs sanitized? Is role authorization enforced?
- [ ] **Documentation & Tasks:** Is `docs/TODO.md` updated?
