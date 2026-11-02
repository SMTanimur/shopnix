import type { AIModelInfo, AIProviderType } from '@shopnix/types';

export interface CompletionOptions {
  model: string;
  prompt: string;
  systemInstructions?: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'text' | 'json';
}

export interface AdapterResult {
  text: string;
  provider: AIProviderType;
  model: string;
  promptTokens: number;
  completionTokens: number;
  isFree: boolean;
}

export interface IAIProviderAdapter {
  readonly provider: AIProviderType;
  complete(apiKey: string, options: CompletionOptions): Promise<AdapterResult>;
  discoverModels(apiKey?: string, freeOnly?: boolean): Promise<AIModelInfo[]>;
}
