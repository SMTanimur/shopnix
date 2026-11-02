import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import type { AICompletionRequest, AICompletionResponse, AIModelInfo, AIProviderType } from '@shopnix/types';
import { AIProvider, type AIProviderDocument } from '../schemas/ai-provider.schema';
import { AIUsage, type AIUsageDocument } from '../schemas/ai-usage.schema';
import { EncryptionService } from '../crypto/encryption.service';
import { OpenRouterAdapter } from '../adapters/openrouter.adapter';
import { GeminiAdapter } from '../adapters/gemini.adapter';
import { OpenAIAdapter } from '../adapters/openai.adapter';
import type { IAIProviderAdapter } from '../adapters/base-ai.adapter';

@Injectable()
export class AIModelRouterService {
  private readonly logger = new Logger(AIModelRouterService.name);
  private readonly adapters: Map<AIProviderType, IAIProviderAdapter> = new Map();

  // Exchange rate USD -> BDT
  private readonly USD_TO_BDT = 122.0;

  constructor(
    @InjectModel(AIProvider.name) private readonly providerModel: Model<AIProviderDocument>,
    @InjectModel(AIUsage.name) private readonly usageModel: Model<AIUsageDocument>,
    private readonly encryptionService: EncryptionService,
    private readonly configService: ConfigService,
    private readonly openRouterAdapter: OpenRouterAdapter,
    private readonly geminiAdapter: GeminiAdapter,
    private readonly openAIAdapter: OpenAIAdapter
  ) {
    this.adapters.set('openrouter', this.openRouterAdapter);
    this.adapters.set('gemini', this.geminiAdapter);
    this.adapters.set('openai', this.openAIAdapter);
  }

  async routeCompletion(
    organizationId: string,
    userId: string | null,
    req: AICompletionRequest
  ): Promise<AICompletionResponse> {
    const startTime = Date.now();
    const mode = req.routing_mode || 'free_only';

    // 1. Resolve Provider & Model
    let provider: AIProviderType = req.provider || 'openrouter';
    let model = req.model || 'google/gemini-2.0-flash-exp:free';

    if (mode === 'free_only') {
      provider = 'openrouter';
      if (!model.endsWith(':free')) {
        model = 'google/gemini-2.0-flash-exp:free';
      }
    }

    // 2. Fetch API Key (Organization-specific or Platform Global)
    const apiKey = await this.resolveApiKey(organizationId, provider);

    const adapter = this.adapters.get(provider);
    if (!adapter) {
      throw new BadRequestException(`Unsupported AI provider: ${provider}`);
    }

    // 3. Execution with Fallback handling
    let result;
    try {
      result = await adapter.complete(apiKey, {
        model,
        prompt: req.prompt,
        systemInstructions: req.system_instructions,
        temperature: req.temperature,
        maxTokens: req.max_tokens,
        responseFormat: req.response_format,
      });
    } catch (primaryErr: any) {
      this.logger.warn(`Primary AI execution failed (${model}): ${primaryErr.message}`);

      // Handle Fallback Mode
      if (mode === 'fallback' || mode === 'free_only') {
        const fallbackModel = 'meta-llama/llama-3.3-70b-instruct:free';
        this.logger.log(`Attempting fallback to ${fallbackModel}`);
        result = await this.openRouterAdapter.complete(apiKey, {
          model: fallbackModel,
          prompt: req.prompt,
          systemInstructions: req.system_instructions,
          temperature: req.temperature,
          maxTokens: req.max_tokens,
          responseFormat: req.response_format,
        });
      } else {
        throw primaryErr;
      }
    }

    const durationMs = Date.now() - startTime;
    const estimatedCostBdt = result.isFree ? 0 : 0.05;

    // 4. Log AI Usage record asynchronously
    try {
      await this.usageModel.create({
        organization_id: organizationId,
        user_id: userId,
        provider: result.provider,
        model: result.model,
        feature: req.feature,
        prompt_tokens: result.promptTokens,
        completion_tokens: result.completionTokens,
        total_tokens: result.promptTokens + result.completionTokens,
        duration_ms: durationMs,
        cost_bdt: estimatedCostBdt,
        success: true,
      });
    } catch (logErr: any) {
      this.logger.error(`Failed to record AI usage: ${logErr.message}`);
    }

    return {
      text: result.text,
      provider: result.provider,
      model: result.model,
      prompt_tokens: result.promptTokens,
      completion_tokens: result.completionTokens,
      is_free: result.isFree,
      cost_bdt: estimatedCostBdt,
    };
  }

  async resolveApiKey(organizationId: string, provider: AIProviderType): Promise<string> {
    // Check organization-level custom credentials
    const orgConfig = await this.providerModel.findOne({
      organization_id: organizationId,
      provider,
      is_active: true,
    });

    if (orgConfig?.api_key_encrypted) {
      const decrypted = this.encryptionService.decrypt(orgConfig.api_key_encrypted);
      if (decrypted) return decrypted;
    }

    // Fallback to platform-managed environment keys
    if (provider === 'openrouter') {
      return this.configService.get<string>('OPENROUTER_API_KEY') || '';
    }
    if (provider === 'gemini') {
      return this.configService.get<string>('GEMINI_API_KEY') || '';
    }
    if (provider === 'openai') {
      return this.configService.get<string>('OPENAI_API_KEY') || '';
    }

    return '';
  }

  async getOpenRouterModels(freeOnly = true): Promise<AIModelInfo[]> {
    return this.openRouterAdapter.discoverModels(undefined, freeOnly);
  }
}
