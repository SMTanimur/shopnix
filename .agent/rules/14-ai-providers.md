# AI Provider Management & Routing Rules

## 1. Provider-Agnostic Abstraction
- All AI operations must invoke `AIModelRouterService`. Direct, coupled calls to provider SDKs from business controllers or domain services are strictly prohibited.
- Supported providers: Google Gemini, OpenRouter, OpenAI.
- Maintain a standardized completion and streaming contract across all adapters.

## 2. API Key Security & Encryption
- Never store raw AI provider API keys in plaintext.
- All keys stored in MongoDB must be encrypted using `EncryptionService` (AES-256-GCM with unique IV and auth tag).
- Never return decrypted API keys to frontend clients. Frontend responses must mask keys (e.g., `••••••••sk-1234`).

## 3. Dynamic OpenRouter Free Model Discovery
- Do not hardcode brittle static lists of free OpenRouter models.
- Query OpenRouter's official models catalog API (`https://openrouter.ai/api/v1/models`).
- A model is classified as **FREE** if and only if both `pricing.prompt` and `pricing.completion` parse to exactly `0.00`:
  ```typescript
  const promptCost = parseFloat(model.pricing?.prompt || '1');
  const completionCost = parseFloat(model.pricing?.completion || '1');
  const isFree = promptCost === 0 && completionCost === 0;
  ```
- Any model with non-zero pricing must strictly be classified as **PAID**.

## 4. Default Free-Only Safety Interceptor
- Default routing mode for all standard organization operations and automated workflows is `free_only: true`.
- If an agent or workflow attempts to call a paid model while `free_only` is active, the router must intercept the request and redirect to a verified zero-cost model (e.g., `meta-llama/llama-3.3-70b-instruct:free`).

## 5. Token Telemetry & BDT Cost Accounting
- Every AI generation attempt must persist an immutable `AIUsage` document (`ai_usage_records`).
- Track `prompt_tokens`, `completion_tokens`, `total_tokens`, and `cost_bdt`.
- All monetary metrics must be normalized to Bangladeshi Taka (৳).
