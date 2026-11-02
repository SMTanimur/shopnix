import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AIProvider, AIProviderSchema } from './schemas/ai-provider.schema';
import { AIUsage, AIUsageSchema } from './schemas/ai-usage.schema';
import { AIAgent, AIAgentSchema } from './schemas/ai-agent.schema';
import { EncryptionService } from './crypto/encryption.service';
import { OpenRouterAdapter } from './adapters/openrouter.adapter';
import { GeminiAdapter } from './adapters/gemini.adapter';
import { OpenAIAdapter } from './adapters/openai.adapter';
import { AIModelRouterService } from './router/ai-model-router.service';
import { AIService } from './ai.service';
import { AIController } from './ai.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AIProvider.name, schema: AIProviderSchema },
      { name: AIUsage.name, schema: AIUsageSchema },
      { name: AIAgent.name, schema: AIAgentSchema },
    ]),
  ],
  controllers: [AIController],
  providers: [
    EncryptionService,
    OpenRouterAdapter,
    GeminiAdapter,
    OpenAIAdapter,
    AIModelRouterService,
    AIService,
  ],
  exports: [AIService, AIModelRouterService, EncryptionService],
})
export class AIModule {}
