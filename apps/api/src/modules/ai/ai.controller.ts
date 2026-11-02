import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import type { AuthenticatedUser } from '@shopnix/types';
import {
  saveAIProviderSchema,
  aiCompletionRequestSchema,
  aiProductBuilderSchema,
  aiChatRequestSchema,
  createAIAgentSchema,
  updateAIAgentSchema,
  type SaveAIProviderInput,
  type AICompletionRequestInput,
  type AIProductBuilderInput,
  type AIChatRequestInput,
  type CreateAIAgentInput,
  type UpdateAIAgentInput,
} from '@shopnix/schemas';
import { AIService } from './ai.service';

@ApiTags('AI Intelligence')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Get('providers')
  @ApiOperation({ summary: 'List configured AI providers for store' })
  async listProviders(@CurrentUser() user: AuthenticatedUser) {
    const data = await this.aiService.listProviders(user.organizationId);
    return { success: true, data };
  }

  @Post('providers')
  @ApiOperation({ summary: 'Configure or update AI provider credentials' })
  @UsePipes(new ZodValidationPipe(saveAIProviderSchema))
  async saveProvider(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SaveAIProviderInput
  ) {
    const data = await this.aiService.saveProvider(user.organizationId, dto);
    return { success: true, data, message: 'AI Provider configured successfully' };
  }

  @Get('models/openrouter')
  @ApiOperation({ summary: 'Discover OpenRouter models with free pricing filtering' })
  async getOpenRouterModels(@Query('free_only') freeOnly?: string) {
    const isFreeOnly = freeOnly !== 'false';
    const data = await this.aiService.discoverOpenRouterModels(isFreeOnly);
    return { success: true, data };
  }

  @Post('complete')
  @ApiOperation({ summary: 'Execute unified AI model completion' })
  @UsePipes(new ZodValidationPipe(aiCompletionRequestSchema))
  async complete(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AICompletionRequestInput
  ) {
    const data = await this.aiService.complete(user.organizationId, user.userId, dto);
    return { success: true, data };
  }

  @Post('product-builder')
  @ApiOperation({ summary: 'Generate high-converting bilingual product copy and SEO' })
  @UsePipes(new ZodValidationPipe(aiProductBuilderSchema))
  async generateProductContent(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AIProductBuilderInput
  ) {
    const data = await this.aiService.generateProductContent(user.organizationId, user.userId, dto);
    return { success: true, data };
  }

  @Post('assistant/chat')
  @ApiOperation({ summary: 'Chat with Shopnix contextual business AI assistant' })
  @UsePipes(new ZodValidationPipe(aiChatRequestSchema))
  async chatAssistant(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AIChatRequestInput
  ) {
    const data = await this.aiService.chatAssistant(user.organizationId, user.userId, dto);
    return { success: true, data };
  }

  @Get('agents')
  @ApiOperation({ summary: 'List specialized AI agents' })
  async listAgents(@CurrentUser() user: AuthenticatedUser) {
    const data = await this.aiService.listAgents(user.organizationId);
    return { success: true, data };
  }

  @Post('agents')
  @ApiOperation({ summary: 'Create a specialized AI agent' })
  @UsePipes(new ZodValidationPipe(createAIAgentSchema))
  async createAgent(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateAIAgentInput
  ) {
    const data = await this.aiService.createAgent(user.organizationId, dto);
    return { success: true, data, message: 'AI Agent created successfully' };
  }

  @Patch('agents/:id')
  @ApiOperation({ summary: 'Update an existing AI agent' })
  @UsePipes(new ZodValidationPipe(updateAIAgentSchema))
  async updateAgent(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateAIAgentInput
  ) {
    const data = await this.aiService.updateAgent(user.organizationId, id, dto);
    return { success: true, data, message: 'AI Agent updated' };
  }

  @Delete('agents/:id')
  @ApiOperation({ summary: 'Delete an AI agent' })
  async deleteAgent(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string
  ) {
    await this.aiService.deleteAgent(user.organizationId, id);
    return { success: true, message: 'AI Agent deleted' };
  }

  @Get('usage')
  @ApiOperation({ summary: 'Get AI token usage logs and cost totals' })
  async getUsageStats(@CurrentUser() user: AuthenticatedUser) {
    const data = await this.aiService.getUsageStats(user.organizationId);
    return { success: true, data };
  }
}
