export type AIProviderType = 'gemini' | 'openrouter' | 'openai';

export type AIRoutingMode = 'manual' | 'auto' | 'free_only' | 'fallback';

export interface AIModelInfo {
  id: string;
  provider: AIProviderType;
  name: string;
  description?: string;
  context_length: number;
  pricing: {
    prompt: string;
    completion: string;
  };
  is_free: boolean;
  supports_tools: boolean;
  supports_vision: boolean;
  supports_json: boolean;
  is_enabled: boolean;
}

export interface AIProviderConfig {
  id: string;
  provider: AIProviderType;
  name: string;
  is_active: boolean;
  default_model: string;
  free_models_only: boolean;
  api_key_masked?: string;
  created_at: string;
  updated_at: string;
}

export interface AIUsageRecord {
  id: string;
  organization_id: string;
  user_id?: string | null;
  provider: AIProviderType;
  model: string;
  feature: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  duration_ms: number;
  cost_bdt: number;
  success: boolean;
  created_at: string;
}

export interface AIAgentDefinition {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  role: string;
  system_prompt: string;
  provider: AIProviderType;
  model: string;
  allowed_tools: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AICompletionRequest {
  feature: string;
  prompt: string;
  system_instructions?: string;
  routing_mode?: AIRoutingMode;
  provider?: AIProviderType;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  response_format?: 'text' | 'json';
}

export interface AICompletionResponse {
  text: string;
  provider: AIProviderType;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  is_free: boolean;
  cost_bdt: number;
}

export interface AIProductBuilderDto {
  product_name: string;
  category?: string;
  features?: string[];
  target_audience?: string;
  language?: 'bn' | 'en' | 'bilingual';
  tone?: 'professional' | 'persuasive' | 'minimalist' | 'exciting';
}

export interface AIProductBuilderResult {
  title: string;
  description: string;
  short_description: string;
  seo_title: string;
  seo_description: string;
  tags: string[];
  features_bullet_points: string[];
}

export interface AIChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_call_id?: string;
}

export interface AIChatRequestDto {
  messages: AIChatMessage[];
  routing_mode?: AIRoutingMode;
  provider?: AIProviderType;
  model?: string;
}

export interface CreateAIAgentDto {
  name: string;
  description: string;
  role: string;
  system_prompt: string;
  provider?: AIProviderType;
  model?: string;
  allowed_tools: string[];
  is_active?: boolean;
}

export interface UpdateAIAgentDto {
  name?: string;
  description?: string;
  role?: string;
  system_prompt?: string;
  provider?: AIProviderType;
  model?: string;
  allowed_tools?: string[];
  is_active?: boolean;
}

export interface SaveAIProviderDto {
  provider: AIProviderType;
  api_key?: string;
  is_active: boolean;
  default_model: string;
  free_models_only?: boolean;
}
