import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  WorkflowDefinition,
  WorkflowDefinitionSchema,
} from './schemas/workflow-definition.schema';
import {
  WorkflowExecutionLog,
  WorkflowExecutionLogSchema,
} from './schemas/workflow-execution-log.schema';
import { WorkflowExecutorService } from './engine/workflow-executor.service';
import { AutomationService } from './automation.service';
import { AutomationController } from './automation.controller';
import { AIModule } from '../ai/ai.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkflowDefinition.name, schema: WorkflowDefinitionSchema },
      { name: WorkflowExecutionLog.name, schema: WorkflowExecutionLogSchema },
    ]),
    AIModule,
  ],
  controllers: [AutomationController],
  providers: [WorkflowExecutorService, AutomationService],
  exports: [AutomationService],
})
export class AutomationModule {}
