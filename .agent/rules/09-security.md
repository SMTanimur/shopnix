# Rule 09: Security & Data Protection Standards

1. **Credential & Secret Protection:**
   - Never commit `.env` files, private keys, API secrets, or database connection strings to git.
   - Use `.env.example` with sanitized placeholders.
   - Courier API credentials stored in MongoDB must be encrypted at rest using AES-256-GCM.

2. **Password Security:**
   - Salt and hash passwords using `bcrypt` with a minimum cost factor of 12 rounds.
   - Never log passwords or return password hashes in user query responses (use Mongoose `.select('-password_hash')`).

3. **Authentication & Session Security:**
   - Short access token lifetimes (15 minutes).
   - Refresh tokens stored in Redis with 7-day TTL and rotation upon every refresh request.
   - If an expired or revoked refresh token is presented, invalidate all refresh tokens for that user account (replay attack mitigation).

4. **Input Sanitization & Injection Prevention:**
   - Zod schema validation must strip unexpected properties (`strip` mode).
   - Never interpolate user input directly into MongoDB query objects without validation.
   - Helmet security headers must be enabled on the NestJS server.
   - File uploads must validate MIME types (e.g., `image/jpeg`, `image/png`, `image/webp`) and limit file sizes to max 5MB.
