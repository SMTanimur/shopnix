# Super Admin Architecture & Security Rules

## 1. Authentication Realm Isolation
- Super Admin accounts exist solely in the `admin_users` collection and must NEVER be conflated with merchant `users`.
- Super Admin JWT tokens carry `{ role: 'super_admin' }` and are stored on clients under `shopnix_admin_tokens`.
- Merchant tokens are rejected on all `/admin/*` routes, and Super Admin tokens are rejected on tenant-scoped `/api/v1/*` routes.
- All administrative backend controllers must be protected by `AdminJwtAuthGuard`.

## 2. Mandatory Audit Logging
- Every administrative write, update, or delete action must generate an immutable entry in `admin_audit_logs`.
- Audit logs must capture:
  - `admin_id` and `admin_email`
  - `action` (e.g., `SUSPEND_ORGANIZATION`, `UPDATE_SUBSCRIPTION_PLAN`)
  - `target_id` and `target_type`
  - `details` with before/after diff snapshot
  - `ip_address` and `user_agent`

## 3. Multi-Tenant Governance Safeguards
- Administrative actions must respect tenant data integrity. Suspending an organization halts traffic at the auth layer without deleting or corrupting historical orders, customer records, or financial data.
- Subscription plan adjustments must immediately reflect in tenant entitlement limits (orders, stores, AI tokens).

## 4. UI/UX Consistency in `/admin`
- The Super Admin portal must reside exclusively in `apps/web/src/app/admin/*`.
- Utilize the high-contrast slate enterprise theme with clear status indicators and confirmation modals for destructive operations.
- Always display pricing and revenue in Bangladeshi Taka (৳).
