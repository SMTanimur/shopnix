import { Injectable, Logger } from '@nestjs/common';
import type { AIModelInfo, AIProviderType } from '@shopnix/types';
import type { IAIProviderAdapter, CompletionOptions, AdapterResult } from './base-ai.adapter';

interface OpenRouterRawPricing {
  prompt?: string;
  completion?: string;
  request?: string;
  image?: string;
}

interface OpenRouterRawModel {
  id: string;
  name: string;
  description?: string;
  context_length?: number;
  pricing?: OpenRouterRawPricing;
  architecture?: {
    modality?: string;
    tokenizer?: string;
    instruct_type?: string;
  };
}

@Injectable()
export class OpenRouterAdapter implements IAIProviderAdapter {
  readonly provider: AIProviderType = 'openrouter';
  private readonly logger = new Logger(OpenRouterAdapter.name);

  // In-memory cache for dynamic models
  private cachedModels: AIModelInfo[] = [];
  private lastFetchedAt: number = 0;
  private readonly CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

  async discoverModels(apiKey?: string, freeOnly = true): Promise<AIModelInfo[]> {
    const now = Date.now();
    if (this.cachedModels.length > 0 && now - this.lastFetchedAt < this.CACHE_TTL_MS) {
      return freeOnly ? this.cachedModels.filter((m) => m.is_free) : this.cachedModels;
    }

    try {
      const headers: Record<string, string> = {
        'HTTP-Referer': 'https://shopnix.io',
        'X-Title': 'Shopnix Ecommerce OS',
      };
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const res = await fetch('https://openrouter.ai/api/v1/models', {
        method: 'GET',
        headers,
      });

      if (!res.ok) {
        throw new Error(`OpenRouter models API returned status ${res.status}`);
      }

      const json = await res.json();
      const rawList: OpenRouterRawModel[] = json.data || [];

      this.cachedModels = rawList.map((m) => {
        const promptPrice = parseFloat(m.pricing?.prompt || '1');
        const completionPrice = parseFloat(m.pricing?.completion || '1');
        // A model is strictly free if both prompt and completion pricing are exactly 0
        const isFree = promptPrice === 0 && completionPrice === 0;

        return {
          id: m.id,
          provider: 'openrouter' as const,
          name: m.name || m.id,
          description: m.description || '',
          context_length: m.context_length || 4096,
          pricing: {
            prompt: m.pricing?.prompt || '0',
            completion: m.pricing?.completion || '0',
          },
          is_free: isFree,
          supports_tools: true,
          supports_vision: m.architecture?.modality?.includes('image') || false,
          supports_json: true,
          is_enabled: true,
        };
      });

      this.lastFetchedAt = now;
      this.logger.log(`Discovered ${this.cachedModels.length} models from OpenRouter (${this.cachedModels.filter(m => m.is_free).length} free).`);
    } catch (err: any) {
      this.logger.warn(`Failed to fetch OpenRouter models dynamically: ${err.message}. Using baseline catalog.`);
      if (this.cachedModels.length === 0) {
        this.cachedModels = this.getBaselineModels();
      }
    }

    return freeOnly ? this.cachedModels.filter((m) => m.is_free) : this.cachedModels;
  }

  async complete(apiKey: string, options: CompletionOptions): Promise<AdapterResult> {
    const messages = [];
    if (options.systemInstructions) {
      messages.push({ role: 'system', content: options.systemInstructions });
    }
    messages.push({ role: 'user', content: options.prompt });

    const payload: Record<string, any> = {
      model: options.model || 'google/gemini-2.0-flash-exp:free',
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2048,
    };

    if (options.responseFormat === 'json') {
      payload.response_format = { type: 'json_object' };
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://shopnix.io',
      'X-Title': 'Shopnix Ecommerce OS',
    };
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`OpenRouter completion failed (${res.status}): ${errBody}`);
    }

    const json = await res.json();
    const choice = json.choices?.[0];
    const text = choice?.message?.content || '';
    const promptTokens = json.usage?.prompt_tokens || 0;
    const completionTokens = json.usage?.completion_tokens || 0;

    const isFree = options.model.endsWith(':free');

    return {
      text,
      provider: 'openrouter',
      model: options.model,
      promptTokens,
      completionTokens,
      isFree,
    };
  }

  private getBaselineModels(): AIModelInfo[] {
    return [
      {
        id: 'google/gemini-2.0-flash-exp:free',
        provider: 'openrouter',
        name: 'Google Gemini 2.0 Flash (Free)',
        description: 'Next-generation multimodal model with ultra-fast inference and 1M context',
        context_length: 1048576,
        pricing: { prompt: '0', completion: '0' },
        is_free: true,
        supports_tools: true,
        supports_vision: true,
        supports_json: true,
        is_enabled: true,
      },
      {
        id: 'meta-llama/llama-3.3-70b-instruct:free',
        provider: 'openrouter',
        name: 'Meta Llama 3.3 70B Instruct (Free)',
        description: 'State-of-the-art open-weights model fine-tuned for reasoning and dialogue',
        context_length: 131072,
        pricing: { prompt: '0', completion: '0' },
        is_free: true,
        supports_tools: true,
        supports_vision: false,
        supports_json: true,
        is_enabled: true,
      },
      {
        id: 'mistralai/mistral-7b-instruct:free',
        provider: 'openrouter',
        name: 'Mistral 7B Instruct (Free)',
        description: 'Lightweight, fast model ideal for content rewriting and classification',
        context_length: 32768,
        pricing: { prompt: '0', completion: '0' },
        is_free: true,
        supports_tools: false,
        supports_vision: false,
        supports_json: true,
        is_enabled: true,
      },
    ];
  }
}
