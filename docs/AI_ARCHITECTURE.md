# Shopnix AI Architecture & Intelligence Layer

## 1. Architectural Overview

Shopnix incorporates an enterprise-grade, provider-agnostic AI Intelligence Layer that transforms the platform from a traditional ecommerce dashboard into an **Autonomous Ecommerce Operating System**. The AI layer handles high-volume copywriting, customer sentiment analysis, smart order extraction, contextual operational advice, and agentic task execution while rigorously defending against unexpected API costs.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Merchant UI / Unified Inbox                     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ AI Prompts / Tools
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Shopnix AI Model Router Service                    │
│   - Free-Only Safety Interceptor    - Multi-Tenant Token Usage Logger  │
│   - Intelligent Failover Cascades   - Cost Tracking in BDT (৳)         │
└───────┬───────────────────────────┼───────────────────────────┬────────┘
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐           ┌───────────────┐           ┌───────────────┐
│  OpenRouter   │           │ Google Gemini │           │    OpenAI     │
│    Adapter    │           │    Adapter    │           │    Adapter    │
│ (Dynamic Free │           │ (Flash/Pro    │           │ (GPT-4o/mini) │
│   Discovery)  │           │  Multimodal)  │           │               │
└───────────────┘           └───────────────┘           └───────────────┘
```

---

## 2. Supported AI Providers & Architecture

### A. Centralized Provider Abstraction
All AI operations invoke the unified `AIModelRouterService`, which decouples business workflows from underlying AI vendors. Every provider implements a common interface:

```typescript
export interface AIProviderAdapter {
  complete(request: AICompletionRequest, apiKey: string): Promise<AICompletionResponse>;
  stream?(request: AICompletionRequest, apiKey: string): AsyncGenerator<string>;
  discoverModels?(apiKey?: string): Promise<AIModelCatalogItem[]>;
}
```

### B. Secure Credential Management
- API keys are **never stored in plaintext** in the database.
- Keys are encrypted using AES-256-GCM with an initialization vector (IV) and authentication tag via `EncryptionService`.
- Secret encryption keys are injected via `ENCRYPTION_KEY` environment variable.
- Keys are never serialized or returned in API responses to client frontends; UI masks them as `••••••••••••`.

---

## 3. OpenRouter Integration & Dynamic Free Model Discovery

Shopnix implements dynamic catalog retrieval to leverage OpenRouter's ecosystem of open-source and free models without hardcoding brittle model identifiers.

### A. Dynamic Model Retrieval
Shopnix queries OpenRouter's official model discovery endpoint:
`GET https://openrouter.ai/api/v1/models`

### B. Zero-Cost Free Model Verification Formula
OpenRouter models publish granular pricing per token. Shopnix validates that **both** prompt and completion costs are explicitly zero:

```typescript
const promptCost = parseFloat(model.pricing?.prompt || '1');
const completionCost = parseFloat(model.pricing?.completion || '1');
const isTrulyFree = promptCost === 0 && completionCost === 0;
```

> [!IMPORTANT]
> A model is only categorized as `FREE` when both prompt and completion costs are exactly `0.00`. Models with non-zero pricing, promotional tiers, or tiered overages are strictly classified as `PAID`.

### C. Default "Free-Only" Mode
- All organizations and automations default to `free_only: true`.
- If an operation requests a paid model while `free_only` is active, the router automatically intercepts the call and substitutes it with a high-performance verified free model (such as `meta-llama/llama-3.3-70b-instruct:free` or `google/gemini-2.0-flash-exp:free`).
- Paid models require deliberate Super Admin master authorization or merchant billing opt-in.

---

## 4. Google Gemini & OpenAI Integrations

### Google Gemini Adapter
- Uses the official Google Generative AI API (`https://generativelanguage.googleapis.com/v1beta/models`).
- Supports `gemini-2.5-flash`, `gemini-2.5-pro`, and `gemini-2.0-flash-exp`.
- Optimized for high-throughput, structured JSON generation and native multimodal parsing (e.g. reading invoice screenshots or product photos).

### OpenAI Adapter
- Communicates with `https://api.openai.com/v1/chat/completions`.
- Supports `gpt-4o`, `gpt-4o-mini`, and embeddings models.
- Provides fallback tool-calling and function dispatching.

---

## 5. Token Cost Tracking & Telemetry (in BDT ৳)

Every AI interaction writes an immutable telemetry record into `ai_usage_records`:

| Field | Type | Description |
| :--- | :--- | :--- |
| `organization_id` | `ObjectId` | Tenant identifier for multi-tenant billing attribution |
| `provider` | `String` | `openrouter`, `gemini`, or `openai` |
| `model` | `String` | Full model identifier |
| `prompt_tokens` | `Number` | Tokens evaluated in request context |
| `completion_tokens` | `Number` | Generated output tokens |
| `total_tokens` | `Number` | Combined consumption |
| `cost_bdt` | `Number` | Normalized cost in Bangladeshi Taka (৳) |
| `feature` | `String` | `copilot`, `product_builder`, `assistant`, `agent` |
| `success` | `Boolean` | Execution status |

Cost calculation converts raw provider USD token prices into BDT at the configurable standard rate (default: `1 USD = 120 BDT`). Free models calculate as `0.00 ৳`.

---

## 6. High-Value AI Features in Shopnix

### 1. Bilingual Product Builder (Bangla + English)
- Accessible in the product creation suite (`/products/new`).
- Generates high-converting, culturally grounded ecommerce copy tailored for the Bangladeshi market.
- Produces:
  - Punchy product titles in English and Bangla.
  - Social-ready bullet point features in conversational Bangla.
  - SEO meta titles, descriptions, and high-frequency search keywords.

### 2. Contextual AI Operations Assistant
- Accessible via `/ai-assistant`.
- Grounded directly in live organization telemetry:
  - Current daily GMV, revenue, and order counts.
  - Critical stock levels and out-of-stock SKUs.
  - Pending, unfulfilled, and high-risk delivery orders.
- Provides real-time operational answers without requiring users to navigate multiple tables.

### 3. Unified Inbox AI Copilot
- Integrated into WhatsApp and Facebook Messenger chats (`/inbox`).
- **Approval Mode**: Generates suggested replies for human agent verification before dispatching, preventing AI hallucinations from reaching customers.
- **1-Click Order Creation**: Parses raw customer chat text (e.g., *"আমারে ২টা লাল কালারের সাইজ L শার্ট পাঠায়া দেন ধানমন্ডি ৩২ নম্বরে, ফোন ০১৭xxxxxxxx"*) into structured line items, customer name, phone number, and delivery address.

### 4. Autonomous AI Agent Builder
- Accessible via `/ai-agents`.
- Allows merchants to configure specialized autonomous agents (e.g., "Abandoned Cart Recovery Specialist", "Fraud & RTO Detection Guard").
- Configurable tool permissions: `inventory_lookup`, `order_status_check`, `discount_generator`.
