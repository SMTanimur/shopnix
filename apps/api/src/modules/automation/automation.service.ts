import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type {
  WorkflowDefinition as IWorkflowDefinition,
  WorkflowExecutionLog as IWorkflowExecutionLog,
  CreateWorkflowDto,
  UpdateWorkflowDto,
  TestWorkflowDto,
} from '@shopnix/types';
import {
  WorkflowDefinition,
  type WorkflowDefinitionDocument,
} from './schemas/workflow-definition.schema';
import {
  WorkflowExecutionLog,
  type WorkflowExecutionLogDocument,
} from './schemas/workflow-execution-log.schema';
import { WorkflowExecutorService } from './engine/workflow-executor.service';

@Injectable()
export class AutomationService {
  constructor(
    @InjectModel(WorkflowDefinition.name)
    private readonly workflowModel: Model<WorkflowDefinitionDocument>,
    @InjectModel(WorkflowExecutionLog.name)
    private readonly logModel: Model<WorkflowExecutionLogDocument>,
    private readonly executorService: WorkflowExecutorService
  ) {}

  async listWorkflows(organizationId: string): Promise<IWorkflowDefinition[]> {
    let workflows = await this.workflowModel.find({ organization_id: organizationId });

    if (workflows.length === 0) {
      await this.seedStarterWorkflows(organizationId);
      workflows = await this.workflowModel.find({ organization_id: organizationId });
    }

    return workflows.map(this.mapWorkflowDocument);
  }

  async getWorkflow(organizationId: string, id: string): Promise<IWorkflowDefinition> {
    const doc = await this.workflowModel.findOne({ _id: id, organization_id: organizationId });
    if (!doc) throw new NotFoundException('Workflow not found');
    return this.mapWorkflowDocument(doc);
  }

  async createWorkflow(
    organizationId: string,
    dto: CreateWorkflowDto
  ): Promise<IWorkflowDefinition> {
    const doc = await this.workflowModel.create({
      organization_id: organizationId,
      name: dto.name,
      description: dto.description || '',
      trigger_type: dto.trigger_type,
      nodes: dto.nodes,
      edges: dto.edges || [],
      is_active: dto.is_active ?? true,
    });
    return this.mapWorkflowDocument(doc);
  }

  async updateWorkflow(
    organizationId: string,
    id: string,
    dto: UpdateWorkflowDto
  ): Promise<IWorkflowDefinition> {
    const doc = await this.workflowModel.findOneAndUpdate(
      { _id: id, organization_id: organizationId },
      dto,
      { new: true }
    );
    if (!doc) throw new NotFoundException('Workflow not found');
    return this.mapWorkflowDocument(doc);
  }

  async deleteWorkflow(organizationId: string, id: string): Promise<void> {
    const res = await this.workflowModel.deleteOne({ _id: id, organization_id: organizationId });
    if (res.deletedCount === 0) throw new NotFoundException('Workflow not found');
  }

  async testWorkflow(
    organizationId: string,
    id: string,
    dto: TestWorkflowDto
  ): Promise<IWorkflowExecutionLog> {
    const workflow = await this.workflowModel.findOne({ _id: id, organization_id: organizationId });
    if (!workflow) throw new NotFoundException('Workflow not found');

    const start = Date.now();
    const result = await this.executorService.executeGraph(
      organizationId,
      workflow.nodes,
      workflow.edges,
      dto.mock_payload
    );
    const duration = Date.now() - start;

    const log = await this.logModel.create({
      organization_id: organizationId,
      workflow_id: workflow._id,
      status: result.status,
      steps: result.steps,
      duration_ms: duration,
      error: result.error || null,
    });

    workflow.execution_count += 1;
    workflow.last_executed_at = new Date();
    await workflow.save();

    return {
      id: log._id.toString(),
      workflow_id: log.workflow_id.toString(),
      organization_id: log.organization_id.toString(),
      status: log.status as any,
      steps: log.steps,
      duration_ms: log.duration_ms,
      error: log.error,
      created_at: (log as any).created_at.toISOString(),
    };
  }

  async getExecutionLogs(
    organizationId: string,
    workflowId: string
  ): Promise<IWorkflowExecutionLog[]> {
    const logs = await this.logModel
      .find({ organization_id: organizationId, workflow_id: workflowId })
      .sort({ created_at: -1 })
      .limit(30);

    return logs.map((l) => ({
      id: l._id.toString(),
      workflow_id: l.workflow_id.toString(),
      organization_id: l.organization_id.toString(),
      status: l.status as any,
      steps: l.steps,
      duration_ms: l.duration_ms,
      error: l.error,
      created_at: (l as any).created_at.toISOString(),
    }));
  }

  private async seedStarterWorkflows(organizationId: string): Promise<void> {
    const starterWorkflows = [
      {
        name: 'New COD Order WhatsApp Notification',
        description: 'Sends instant WhatsApp confirmation and alerts operations when a new COD order is placed',
        trigger_type: 'order.created',
        is_active: true,
        nodes: [
          {
            id: 'node_1',
            type: 'trigger',
            position: { x: 100, y: 150 },
            data: { label: 'New Order Received', nodeType: 'trigger', triggerType: 'order.created' },
          },
          {
            id: 'node_2',
            type: 'ai',
            position: { x: 380, y: 150 },
            data: {
              label: 'AI Fraud & Return Risk Check',
              nodeType: 'ai',
              actionType: 'ai.decision',
              config: { prompt: 'Analyze phone number and order history. Classify fraud risk: Low or High.' },
            },
          },
          {
            id: 'node_3',
            type: 'action',
            position: { x: 680, y: 150 },
            data: {
              label: 'Send WhatsApp Confirmation',
              nodeType: 'action',
              actionType: 'message.send_whatsapp',
            },
          },
        ],
        edges: [
          { id: 'edge_1_2', source: 'node_1', target: 'node_2' },
          { id: 'edge_2_3', source: 'node_2', target: 'node_3' },
        ],
      },
    ];

    for (const w of starterWorkflows) {
      await this.workflowModel.create({
        organization_id: organizationId,
        ...w,
      });
    }
  }

  private mapWorkflowDocument(doc: WorkflowDefinitionDocument): IWorkflowDefinition {
    return {
      id: doc._id.toString(),
      organization_id: doc.organization_id.toString(),
      name: doc.name,
      description: doc.description,
      is_active: doc.is_active,
      trigger_type: doc.trigger_type as any,
      nodes: doc.nodes,
      edges: doc.edges,
      execution_count: doc.execution_count,
      last_executed_at: doc.last_executed_at ? doc.last_executed_at.toISOString() : null,
      created_at: (doc as any).created_at.toISOString(),
      updated_at: (doc as any).updated_at.toISOString(),
    };
  }
}
