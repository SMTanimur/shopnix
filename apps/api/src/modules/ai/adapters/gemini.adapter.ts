import { Injectable, Logger } from '@nestjs/common';
import type { AIModelInfo, AIProviderType } from '@shopnix/types';
import type { IAIProviderAdapter, CompletionOptions, AdapterResult } from './base-ai.adapter';

@Injectable()
export class GeminiAdapter implements IAIProviderAdapter {
  readonly provider: AIProviderType = 'gemini';
  private readonly logger = new Logger(GeminiAdapter.name);

  async discoverModels(): Promise<AIModelInfo[]> {
    return [
      {
        id: 'gemini-2.0-flash',
        provider: 'gemini',
        name: 'Gemini 2.0 Flash',
        description: 'Google next-gen flagship multimodal model for fast text & vision',
        context_length: 1048576,
        pricing: { prompt: '0.0001', completion: '0.0004' },
        is_free: false,
        supports_tools: true,
        supports_vision: true,
        supports_json: true,
        is_enabled: true,
      },
      {
        id: 'gemini-1.5-flash',
        provider: 'gemini',
        name: 'Gemini 1.5 Flash',
        description: 'High-speed model optimized for high-frequency low-latency workflows',
        context_length: 1048576,
        pricing: { prompt: '0.000075', completion: '0.0003' },
        is_free: false,
        supports_tools: true,
        supports_vision: true,
        supports_json: true,
        is_enabled: true,
      },
      {
        id: 'gemini-1.5-pro',
        provider: 'gemini',
        name: 'Gemini 1.5 Pro',
        description: 'Deep reasoning model with complex context understanding',
        context_length: 2097152,
        pricing: { prompt: '0.00125', completion: '0.005' },
        is_free: false,
        supports_tools: true,
        supports_vision: true,
        supports_json: true,
        is_enabled: true,
      },
    ];
  }

  async complete(apiKey: string, options: CompletionOptions): Promise<AdapterResult> {
    const model = options.model || 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const contents: any[] = [];
    if (options.systemInstructions) {
      contents.push({
        role: 'user',
        parts: [{ text: `System instruction: ${options.systemInstructions}` }],
      });
      contents.push({
        role: 'model',
        parts: [{ text: 'Understood. I will strictly follow these instructions.' }],
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: options.prompt }],
    });

    const generationConfig: Record<string, any> = {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxTokens ?? 2048,
    };

    if (options.responseFormat === 'json') {
      generationConfig.responseMimeType = 'application/json';
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, generationConfig }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Gemini API error (${res.status}): ${err}`);
    }

    const json = await res.json();
    const candidate = json.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text || '';
    const promptTokens = json.usageMetadata?.promptTokenCount || 0;
    const completionTokens = json.usageMetadata?.candidatesTokenCount || 0;

    return {
      text,
      provider: 'gemini',
      model,
      promptTokens,
      completionTokens,
      isFree: false,
    };
  }
}
