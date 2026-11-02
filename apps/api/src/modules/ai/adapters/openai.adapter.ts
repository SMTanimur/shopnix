import { Injectable, Logger } from '@nestjs/common';
import type { AIModelInfo, AIProviderType } from '@shopnix/types';
import type { IAIProviderAdapter, CompletionOptions, AdapterResult } from './base-ai.adapter';

@Injectable()
export class OpenAIAdapter implements IAIProviderAdapter {
  readonly provider: AIProviderType = 'openai';
  private readonly logger = new Logger(OpenAIAdapter.name);

  async discoverModels(): Promise<AIModelInfo[]> {
    return [
      {
        id: 'gpt-4o-mini',
        provider: 'openai',
        name: 'GPT-4o mini',
        description: 'Fast, lightweight intelligence for multimodal tasks',
        context_length: 128000,
        pricing: { prompt: '0.00015', completion: '0.0006' },
        is_free: false,
        supports_tools: true,
        supports_vision: true,
        supports_json: true,
        is_enabled: true,
      },
      {
        id: 'gpt-4o',
        provider: 'openai',
        name: 'GPT-4o',
        description: 'High-intelligence flagship model for complex text and vision',
        context_length: 128000,
        pricing: { prompt: '0.0025', completion: '0.01' },
        is_free: false,
        supports_tools: true,
        supports_vision: true,
        supports_json: true,
        is_enabled: true,
      },
    ];
  }

  async complete(apiKey: string, options: CompletionOptions): Promise<AdapterResult> {
    const model = options.model || 'gpt-4o-mini';
    const messages: any[] = [];
    if (options.systemInstructions) {
      messages.push({ role: 'system', content: options.systemInstructions });
    }
    messages.push({ role: 'user', content: options.prompt });

    const payload: Record<string, any> = {
      model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2048,
    };

    if (options.responseFormat === 'json') {
      payload.response_format = { type: 'json_object' };
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${err}`);
    }

    const json = await res.json();
    const text = json.choices?.[0]?.message?.content || '';
    const promptTokens = json.usage?.prompt_tokens || 0;
    const completionTokens = json.usage?.completion_tokens || 0;

    return {
      text,
      provider: 'openai',
      model,
      promptTokens,
      completionTokens,
      isFree: false,
    };
  }
}
