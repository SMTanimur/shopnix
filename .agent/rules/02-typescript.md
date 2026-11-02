# Rule 02: TypeScript Standards

1. **Strict Compiler Options:**
   All `tsconfig.json` files must enforce strict mode:
   ```json
   {
     "compilerOptions": {
       "strict": true,
       "noImplicitAny": true,
       "strictNullChecks": true,
       "strictFunctionTypes": true,
       "strictBindCallApply": true,
       "strictPropertyInitialization": true,
       "noImplicitThis": true,
       "alwaysStrict": true,
       "noUnusedLocals": true,
       "noUnusedParameters": true,
       "noImplicitReturns": true,
       "noFallthroughCasesInSwitch": true,
       "noUncheckedIndexedAccess": true
     }
   }
   ```

2. **Zero `any` Policy:**
   - The use of `any` is strictly prohibited. Use `unknown` with type narrowing guards when data shape is uncertain.
   - For generic parameters, define bounded types (e.g., `<T extends Record<string, unknown>>`).

3. **Inferred Types from Zod Schemas:**
   - Define data contracts using Zod schemas in `@shopnix/schemas`.
   - Derive TypeScript types directly using `z.infer<typeof MySchema>` to guarantee 100% synchronization:
   ```typescript
   export const createProductSchema = z.object({ ... });
   export type CreateProductInput = z.infer<typeof createProductSchema>;
   ```

4. **Type Exports & Imports:**
   - Use explicit `import type { ... } from '...'` syntax for type-only imports to aid tree-shaking and bundler performance.
