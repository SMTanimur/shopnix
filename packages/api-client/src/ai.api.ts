import type { AxiosInstance } from 'axios';
import type {
  ApiResponse,
  AIModelInfo,
  AIProviderConfig,
  AIUsageRecord,
  AIAgentDefinition,
  AICompletionRequest,
  AICompletionResponse,
  AIProductBuilderDto,
  AIProductBuilderResult,
  AIChatRequestDto,
  CreateAIAgentDto,
  UpdateAIAgentDto,
  SaveAIProviderDto,
} from '@shopnix/types';

export class AiApi {
  constructor(private readonly axios: AxiosInstance) {}

  async listProviders(): Promise<ApiResponse<AIProviderConfig[]>> {
    const { data } = await this.axios.get<ApiResponse<AIProviderConfig[]>>('/ai/providers');
    return data;
  }

  async saveProvider(dto: SaveAIProviderDto): Promise<ApiResponse<AIProviderConfig>> {
    const { data } = await this.axios.post<ApiResponse<AIProviderConfig>>('/ai/providers', dto);
    return data;
  }

  async discoverOpenRouterModels(params?: {
    free_only?: boolean;
    refresh?: boolean;
  }): Promise<ApiResponse<AIModelInfo[]>> {
    const { data } = await this.axios.get<ApiResponse<AIModelInfo[]>>('/ai/models/openrouter', {
      params,
    });
    return data;
  }

  async complete(dto: AICompletionRequest): Promise<ApiResponse<AICompletionResponse>> {
    const { data } = await this.axios.post<ApiResponse<AICompletionResponse>>('/ai/complete', dto);
    return data;
  }

  async generateProductContent(
    dto: AIProductBuilderDto
  ): Promise<ApiResponse<AIProductBuilderResult>> {
    const { data } = await this.axios.post<ApiResponse<AIProductBuilderResult>>(
      '/ai/product-builder',
      dto
    );
    return data;
  }

  async chatAssistant(dto: AIChatRequestDto): Promise<ApiResponse<AICompletionResponse>> {
    const { data } = await this.axios.post<ApiResponse<AICompletionResponse>>(
      '/ai/assistant/chat',
      dto
    );
    return data;
  }

  async listAgents(): Promise<ApiResponse<AIAgentDefinition[]>> {
    const { data } = await this.axios.get<ApiResponse<AIAgentDefinition[]>>('/ai/agents');
    return data;
  }

  async createAgent(dto: CreateAIAgentDto): Promise<ApiResponse<AIAgentDefinition>> {
    const { data } = await this.axios.post<ApiResponse<AIAgentDefinition>>('/ai/agents', dto);
    return data;
  }

  async updateAgent(
    id: string,
    dto: UpdateAIAgentDto
  ): Promise<ApiResponse<AIAgentDefinition>> {
    const { data } = await this.axios.patch<ApiResponse<AIAgentDefinition>>(
      `/ai/agents/${id}`,
      dto
    );
    return data;
  }

  async deleteAgent(id: string): Promise<ApiResponse<{ message: string }>> {
    const { data } = await this.axios.delete<ApiResponse<{ message: string }>>(`/ai/agents/${id}`);
    return data;
  }

  async getUsageStats(): Promise<ApiResponse<{ total_tokens: number; total_cost_bdt: number; records: AIUsageRecord[] }>> {
    const { data } = await this.axios.get<ApiResponse<{ total_tokens: number; total_cost_bdt: number; records: AIUsageRecord[] }>>('/ai/usage');
    return data;
  }
}
