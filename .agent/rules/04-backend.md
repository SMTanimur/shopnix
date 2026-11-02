# Rule 04: Backend & NestJS Engineering Standards

1. **Layered Separation of Concerns:**
   - **Controllers:** Thin boundary layer. Responsible solely for endpoint mapping, HTTP status codes, applying guards/interceptors, and delegating to services.
   - **Services:** Houses all core business logic, domain rules, state transitions, and coordination between repositories.
   - **Mongoose Repositories/Models:** Encapsulates persistence, query creation, indexing, and MongoDB schema constraints.

2. **Native Standard Schema Validation:**
   - Utilize NestJS 12's native Standard Schema support with Zod.
   - Route decorators consume Zod schemas directly:
     ```typescript
     @Post()
     async createProduct(
       @Body({ schema: createProductSchema }) dto: CreateProductInput,
       @CurrentUser() user: AuthenticatedUser
     ) {
       return this.productsService.create(user.organizationId, dto);
     }
     ```

3. **Normalized Error Handling & Responses:**
   - All controller responses must return normalized structures:
     ```typescript
     {
       "success": true,
       "data": { ... },
       "meta": { "page": 1, "limit": 20, "total": 142 } // When paginated
     }
     ```
   - Global HTTP Exception Filter (`common/filters/http-exception.filter.ts`) intercepts exceptions and transforms them into standard error envelopes:
     ```typescript
     {
       "success": false,
       "status_code": 400,
       "error": "Bad Request",
       "message": "Validation failed",
       "errors": [ ... ]
     }
     ```

4. **Security & Authentication:**
   - Stateless JWT tokens (15m expiry).
   - Redis-backed rotating refresh tokens (7d expiry) with replay detection.
   - Protect routes using `@UseGuards(JwtAuthGuard, RolesGuard)`.
   - Method-level role authorization: `@Roles(UserRole.OWNER, UserRole.ADMIN)`.

5. **OpenAPI / Swagger Documentation:**
   - All controllers and endpoints must be documented with `@ApiTags()`, `@ApiOperation()`, and `@ApiResponse()`.
