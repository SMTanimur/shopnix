import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type {
  AIProviderConfig,
  AIModelInfo,
  AICompletionRequest,
  AICompletionResponse,
  AIProductBuilderDto,
  AIProductBuilderResult,
  AIChatRequestDto,
  CreateAIAgentDto,
  UpdateAIAgentDto,
  SaveAIProviderDto,
  AIAgentDefinition,
  AIUsageRecord,
} from '@shopnix/types';
import { AIProvider, type AIProviderDocument } from './schemas/ai-provider.schema';
import { AIUsage, type AIUsageDocument } from './schemas/ai-usage.schema';
import { AIAgent, type AIAgentDocument } from './schemas/ai-agent.schema';
import { AIModelRouterService } from './router/ai-model-router.service';
import { EncryptionService } from './crypto/encryption.service';

@Injectable()
export class AIService {
  constructor(
    @InjectModel(AIProvider.name) private readonly providerModel: Model<AIProviderDocument>,
    @InjectModel(AIUsage.name) private readonly usageModel: Model<AIUsageDocument>,
    @InjectModel(AIAgent.name) private readonly agentModel: Model<AIAgentDocument>,
    private readonly routerService: AIModelRouterService,
    private readonly encryptionService: EncryptionService
  ) {}

  async listProviders(organizationId: string): Promise<AIProviderConfig[]> {
    const list = await this.providerModel.find({ organization_id: organizationId });
    return list.map((doc) => ({
      id: doc._id.toString(),
      provider: doc.provider,
      name: doc.name,
      is_active: doc.is_active,
      default_model: doc.default_model,
      free_models_only: doc.free_models_only,
      api_key_masked: doc.api_key_encrypted
        ? this.encryptionService.maskKey(this.encryptionService.decrypt(doc.api_key_encrypted))
        : undefined,
      created_at: (doc as any).created_at.toISOString(),
      updated_at: (doc as any).updated_at.toISOString(),
    }));
  }

  async saveProvider(organizationId: string, dto: SaveAIProviderDto): Promise<AIProviderConfig> {
    const updatePayload: Record<string, any> = {
      name: dto.provider.toUpperCase(),
      is_active: dto.is_active,
      default_model: dto.default_model,
      free_models_only: dto.free_models_only ?? true,
    };

    if (dto.api_key) {
      updatePayload.api_key_encrypted = this.encryptionService.encrypt(dto.api_key);
    }

    const doc = await this.providerModel.findOneAndUpdate(
      { organization_id: organizationId, provider: dto.provider },
      updatePayload,
      { upsert: true, new: true }
    );

    return {
      id: doc._id.toString(),
      provider: doc.provider,
      name: doc.name,
      is_active: doc.is_active,
      default_model: doc.default_model,
      free_models_only: doc.free_models_only,
      api_key_masked: doc.api_key_encrypted
        ? this.encryptionService.maskKey(this.encryptionService.decrypt(doc.api_key_encrypted))
        : undefined,
      created_at: (doc as any).created_at.toISOString(),
      updated_at: (doc as any).updated_at.toISOString(),
    };
  }

  async discoverOpenRouterModels(freeOnly = true): Promise<AIModelInfo[]> {
    return this.routerService.getOpenRouterModels(freeOnly);
  }

  async complete(
    organizationId: string,
    userId: string | null,
    dto: AICompletionRequest
  ): Promise<AICompletionResponse> {
    return this.routerService.routeCompletion(organizationId, userId, dto);
  }

  async generateProductContent(
    organizationId: string,
    userId: string | null,
    dto: AIProductBuilderDto
  ): Promise<AIProductBuilderResult> {
    const langInstructions =
      dto.language === 'bn'
        ? 'Generate all content in Bengali (Bangla).'
        : dto.language === 'en'
        ? 'Generate all content in English.'
        : 'Generate title in English, descriptions in Bilingual (engaging Bangla with clear English product terminology).';

    const systemPrompt = `You are Shopnix's premier ecommerce merchandising AI copywriter.
Generate high-converting, professional product copy formatted strictly as a valid JSON object.
${langInstructions}
Tone: ${dto.tone || 'persuasive'}.

JSON Structure required:
{
  "title": "string",
  "description": "string (formatted with HTML paragraphs and highlights)",
  "short_description": "string (1-2 crisp summary sentences)",
  "seo_title": "string (under 60 chars)",
  "seo_description": "string (under 160 chars)",
  "tags": ["string"],
  "features_bullet_points": ["string"]
}`;

    const prompt = `Product Name: ${dto.product_name}
Category: ${dto.category || 'General'}
Features: ${dto.features?.join(', ') || 'High quality, durable'}
Target Audience: ${dto.target_audience || 'Online shoppers in Bangladesh'}`;

    const res = await this.routerService.routeCompletion(organizationId, userId, {
      feature: 'product_builder',
      prompt,
      system_instructions: systemPrompt,
      routing_mode: 'free_only',
      response_format: 'json',
      temperature: 0.7,
    });

    try {
      const parsed = JSON.parse(res.text);
      return {
        title: parsed.title || dto.product_name,
        description: parsed.description || '',
        short_description: parsed.short_description || '',
        seo_title: parsed.seo_title || dto.product_name,
        seo_description: parsed.seo_description || '',
        tags: parsed.tags || [],
        features_bullet_points: parsed.features_bullet_points || [],
      };
    } catch {
      // Fallback if model returned unstructured markdown
      return {
        title: dto.product_name,
        description: res.text,
        short_description: dto.product_name,
        seo_title: dto.product_name,
        seo_description: dto.product_name,
        tags: [dto.product_name],
        features_bullet_points: [],
      };
    }
  }

  async chatAssistant(
    organizationId: string,
    userId: string | null,
    dto: AIChatRequestDto
  ): Promise<AICompletionResponse> {
    const lastMessage = dto.messages[dto.messages.length - 1]?.content || '';
    const conversationHistory = dto.messages
      .slice(0, -1)
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n');

    const systemPrompt = `You are the Shopnix AI Operations Assistant.
You assist Bangladeshi ecommerce merchants in running their store, understanding COD logistics, stock management, and courier fulfillments (Steadfast, Pathao, RedX).
Be concise, actionable, helpful, and professional. Current currency is BDT (৳).
If asked about recent metrics, summarize key operational principles.`;

    const fullPrompt = conversationHistory
      ? `Prior conversation:\n${conversationHistory}\n\nUser request: ${lastMessage}`
      : lastMessage;

    return this.routerService.routeCompletion(organizationId, userId, {
      feature: 'ai_assistant',
      prompt: fullPrompt,
      system_instructions: systemPrompt,
      routing_mode: dto.routing_mode || 'free_only',
      provider: dto.provider,
      model: dto.model,
    });
  }

  async listAgents(organizationId: string): Promise<AIAgentDefinition[]> {
    const list = await this.agentModel.find({ organization_id: organizationId });
    return list.map((doc) => ({
      id: doc._id.toString(),
      organization_id: doc.organization_id.toString(),
      name: doc.name,
      description: doc.description,
      role: doc.role,
      system_prompt: doc.system_prompt,
      provider: doc.provider as any,
      model: doc.model,
      allowed_tools: doc.allowed_tools,
      is_active: doc.is_active,
      created_at: (doc as any).created_at.toISOString(),
      updated_at: (doc as any).updated_at.toISOString(),
    }));
  }

  async createAgent(organizationId: string, dto: CreateAIAgentDto): Promise<AIAgentDefinition> {
    const doc = await this.agentModel.create({
      organization_id: organizationId,
      name: dto.name,
      description: dto.description,
      role: dto.role,
      system_prompt: dto.system_prompt,
      provider: dto.provider || 'openrouter',
      model: dto.model || 'google/gemini-2.0-flash-exp:free',
      allowed_tools: dto.allowed_tools || [],
      is_active: dto.is_active ?? true,
    });

    return {
      id: doc._id.toString(),
      organization_id: doc.organization_id.toString(),
      name: doc.name,
      description: doc.description,
      role: doc.role,
      system_prompt: doc.system_prompt,
      provider: doc.provider as any,
      model: doc.model,
      allowed_tools: doc.allowed_tools,
      is_active: doc.is_active,
      created_at: (doc as any).created_at.toISOString(),
      updated_at: (doc as any).updated_at.toISOString(),
    };
  }

  async updateAgent(
    organizationId: string,
    id: string,
    dto: UpdateAIAgentDto
  ): Promise<AIAgentDefinition> {
    const doc = await this.agentModel.findOneAndUpdate(
      { _id: id, organization_id: organizationId },
      dto,
      { new: true }
    );
    if (!doc) throw new NotFoundException('AI Agent not found');

    return {
      id: doc._id.toString(),
      organization_id: doc.organization_id.toString(),
      name: doc.name,
      description: doc.description,
      role: doc.role,
      system_prompt: doc.system_prompt,
      provider: doc.provider as any,
      model: doc.model,
      allowed_tools: doc.allowed_tools,
      is_active: doc.is_active,
      created_at: (doc as any).created_at.toISOString(),
      updated_at: (doc as any).updated_at.toISOString(),
    };
  }

  async deleteAgent(organizationId: string, id: string): Promise<void> {
    const res = await this.agentModel.deleteOne({ _id: id, organization_id: organizationId });
    if (res.deletedCount === 0) throw new NotFoundException('AI Agent not found');
  }

  async getUsageStats(organizationId: string): Promise<{
    total_tokens: number;
    total_cost_bdt: number;
    records: AIUsageRecord[];
  }> {
    const records = await this.usageModel
      .find({ organization_id: organizationId })
      .sort({ created_at: -1 })
      .limit(100);

    let totalTokens = 0;
    let totalCostBdt = 0;

    const mapped: AIUsageRecord[] = records.map((r) => {
      totalTokens += r.total_tokens || 0;
      totalCostBdt += r.cost_bdt || 0;
      return {
        id: r._id.toString(),
        organization_id: r.organization_id.toString(),
        user_id: r.user_id ? r.user_id.toString() : null,
        provider: r.provider as any,
        model: r.model,
        feature: r.feature,
        prompt_tokens: r.prompt_tokens,
        completion_tokens: r.completion_tokens,
        total_tokens: r.total_tokens,
        duration_ms: r.duration_ms,
        cost_bdt: r.cost_bdt,
        success: r.success,
        created_at: (r as any).created_at.toISOString(),
      };
    });

    return {
      total_tokens: totalTokens,
      total_cost_bdt: totalCostBdt,
      records: mapped,
    };
  }
}
