# Shopnix Super Admin Control Center Architecture

## 1. Executive Summary & Security Isolation

The Super Admin Control Center (`/admin`) is an isolated, enterprise-grade administrative suite designed for platform owners, DevOps, and SaaS operators to govern multi-tenant organizations, manage subscription tiers, monitor global infrastructure KPIs, and configure master AI providers.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Authentication Realms                           │
├───────────────────────────────────┬────────────────────────────────────┤
│           Merchant Realm          │         Super Admin Realm          │
│   - Collection: `users`           │   - Collection: `admin_users`      │
│   - JWT: Merchant Access Token    │   - JWT: Admin Super JWT           │
│   - Storage: `shopnix_tokens`     │   - Storage: `shopnix_admin_tokens`│
│   - Scope: `organization_id` req  │   - Guard: `AdminJwtAuthGuard`     │
│   - Routes: `/api/v1/*`           │   - Routes: `/api/v1/admin/*`      │
└───────────────────────────────────┴────────────────────────────────────┘
```

> [!CAUTION]
> The Super Admin authentication realm is strictly partitioned from standard tenant user authentication. Admin tokens cannot be used against tenant endpoints, and merchant tokens cannot penetrate the `/admin/*` boundary.

---

## 2. Super Admin Credentials & Bootstrap

During system startup, the `AdminService` automatically inspects the `admin_users` collection. If no administrator exists, it provisions the default bootstrap administrator:

- **Email**: `admin@shopnix.io`
- **Default Password**: `ShopnixAdmin2026!`
- **Role**: `super_admin`
- **Seeded Plans**: Starter (৳1,499), Growth (৳3,999), Enterprise (৳9,999)

Administrators are prompted to rotate the initial bootstrap password immediately upon staging deployment.

---

## 3. Core Modules & Operational Capabilities

### A. Platform Overview & Real-Time KPIs (`/admin`)
Presents a live command center of global system health:
- **Total Registered Organizations** (Active, Suspended, Trialing)
- **Active Subscriptions** & Monthly Recurring Revenue (MRR in BDT ৳)
- **Total Merchant Users**
- **Platform GMV** aggregated across all multi-tenant stores
- **Global AI Token Usage** and platform AI expenditure in BDT
- **Service Status Indicators** (Database, AI Router, Redis, Webhooks)

### B. Multi-Tenant Organization Management (`/admin/organizations`)
Allows platform operators to manage tenants:
- **Tenant Directory**: Search by company name, slug, owner email, subscription tier, and creation date.
- **Immediate Suspension & Reactivation**: 1-click toggle to quarantine rogue or overdue tenants. Suspended tenants are rejected at the authentication middleware layer.
- **Tier & Limits Override**: Dynamically upgrade or adjust storage, order, and store integration limits for specific tenants.

### C. Subscription Plan & Entitlements Engine (`/admin/subscriptions`)
Manages the SaaS tiers and entitlement flags in Bangladeshi Taka (৳):

| Plan | Price (BDT/mo) | Max Orders/mo | Max Stores | WhatsApp / Courier API |
| :--- | :--- | :--- | :--- | :--- |
| **Starter** | ৳1,499 | 500 | 1 | Basic |
| **Growth** | ৳3,999 | 3,000 | 3 | Full Omnichannel + AI Copilot |
| **Enterprise** | ৳9,999 | Unlimited | Unlimited | Dedicated Webhooks, Priority AI |

Features configurable per plan:
- AI tokens monthly allowance.
- Multi-store connection limits.
- Team member seats.
- Custom domain routing permissions.

### D. Global AI Master Key Vault (`/admin/ai`)
Centralized management of AI provider infrastructure:
- **Encrypted Provider Master Keys**: Sets platform-wide default API keys for OpenRouter, Google Gemini, and OpenAI.
- **OpenRouter Free Models Explorer**: Displays live models discovered from the OpenRouter API with prompt and completion costs at `0.00`.
- **System-wide AI Telemetry**: Aggregated token usage breakdown by provider, feature, and cost.

### E. Immutable Security Audit Logging (`/admin/audit-logs`)
Every state-altering administrative action generates an immutable audit record in `admin_audit_logs`:
- **Admin Identity**: ID and email of the executing administrator.
- **Action Type**: E.g., `SUSPEND_ORGANIZATION`, `REACTIVATE_ORGANIZATION`, `UPDATE_SUBSCRIPTION_PLAN`, `UPDATE_AI_CONFIG`, `ADMIN_LOGIN`.
- **Target Entity**: Resource identifier and tenant impacted.
- **Contextual Diff**: JSON snapshot of fields changed.
- **Network Metadata**: Client IP address and HTTP User-Agent.

---

## 4. Frontend Route Hierarchy

The Super Admin portal is encapsulated under `apps/web/src/app/admin`:

```
apps/web/src/app/admin/
├── layout.tsx              # Dark slate enterprise sidebar & system status header
├── login/                  # Super Admin login page (authenticates against /admin/auth/login)
├── page.tsx               # Platform overview KPIs & audit log feed
├── organizations/         # Multi-tenant management & suspension controls
├── subscriptions/         # SaaS plan tier pricing & entitlement limits
├── ai/                    # Master AI key vault & OpenRouter free models
└── audit-logs/            # Immutable security audit history
```
