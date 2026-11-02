import { z } from 'zod';

export const aiCompletionRequestSchema = z.object({
  feature: z.string().min(1),
  prompt: z.string().min(1, 'Prompt is required'),
  system_instructions: z.string().optional(),
  routing_mode: z.enum(['manual', 'auto', 'free_only', 'fallback']).default('free_only'),
  provider: z.enum(['gemini', 'openrouter', 'openai']).optional(),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().int().min(10).max(8192).optional(),
  response_format: z.enum(['text', 'json']).default('text'),
});

export const aiProductBuilderSchema = z.object({
  product_name: z.string().min(2, 'Product name is required').max(150),
  category: z.string().optional(),
  features: z.array(z.string()).optional(),
  target_audience: z.string().optional(),
  language: z.enum(['bn', 'en', 'bilingual']).default('bilingual'),
  tone: z.enum(['professional', 'persuasive', 'minimalist', 'exciting']).default('persuasive'),
});

export const aiChatMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant', 'tool']),
  content: z.string(),
  tool_call_id: z.string().optional(),
});

export const aiChatRequestSchema = z.object({
  messages: z.array(aiChatMessageSchema).min(1, 'At least one message is required'),
  routing_mode: z.enum(['manual', 'auto', 'free_only', 'fallback']).default('free_only'),
  provider: z.enum(['gemini', 'openrouter', 'openai']).optional(),
  model: z.string().optional(),
});

export const createAIAgentSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(5).max(300),
  role: z.string().min(2).max(50),
  system_prompt: z.string().min(10),
  provider: z.enum(['gemini', 'openrouter', 'openai']).default('openrouter'),
  model: z.string().default('google/gemini-2.0-flash-exp:free'),
  allowed_tools: z.array(z.string()).default([]),
  is_active: z.boolean().default(true),
});

export const updateAIAgentSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().min(5).max(300).optional(),
  role: z.string().min(2).max(50).optional(),
  system_prompt: z.string().min(10).optional(),
  provider: z.enum(['gemini', 'openrouter', 'openai']).optional(),
  model: z.string().optional(),
  allowed_tools: z.array(z.string()).optional(),
  is_active: z.boolean().optional(),
});

export const saveAIProviderSchema = z.object({
  provider: z.enum(['gemini', 'openrouter', 'openai']),
  api_key: z.string().optional(),
  is_active: z.boolean().default(true),
  default_model: z.string().min(1),
  free_models_only: z.boolean().default(true),
});

export type AICompletionRequestInput = z.infer<typeof aiCompletionRequestSchema>;
export type AIProductBuilderInput = z.infer<typeof aiProductBuilderSchema>;
export type AIChatRequestInput = z.infer<typeof aiChatRequestSchema>;
export type CreateAIAgentInput = z.infer<typeof createAIAgentSchema>;
export type UpdateAIAgentInput = z.infer<typeof updateAIAgentSchema>;
export type SaveAIProviderInput = z.infer<typeof saveAIProviderSchema>;
