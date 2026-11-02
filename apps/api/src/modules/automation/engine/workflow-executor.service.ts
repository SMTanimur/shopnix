import { Injectable, Logger } from '@nestjs/common';
import type { WorkflowNode, WorkflowEdge, WorkflowExecutionStep } from '@shopnix/types';
import { AIModelRouterService } from '../../ai/router/ai-model-router.service';

@Injectable()
export class WorkflowExecutorService {
  private readonly logger = new Logger(WorkflowExecutorService.name);

  constructor(private readonly aiRouterService: AIModelRouterService) {}

  async executeGraph(
    organizationId: string,
    nodes: WorkflowNode[],
    edges: WorkflowEdge[],
    triggerPayload: Record<string, any>
  ): Promise<{ status: 'completed' | 'failed'; steps: WorkflowExecutionStep[]; error?: string }> {
    const steps: WorkflowExecutionStep[] = [];
    let currentPayload = { ...triggerPayload };

    // Find trigger node
    const triggerNode = nodes.find((n) => n.data.nodeType === 'trigger');
    if (!triggerNode) {
      return {
        status: 'failed',
        steps,
        error: 'Workflow missing a valid trigger node',
      };
    }

    // Step 1: Record Trigger
    steps.push({
      node_id: triggerNode.id,
      node_name: triggerNode.data.label || 'Trigger',
      status: 'success',
      input: triggerPayload,
      output: currentPayload,
      duration_ms: 5,
    });

    // Execute downstream nodes iteratively
    let currentNodeId: string | undefined = triggerNode.id;
    const visited = new Set<string>([triggerNode.id]);

    while (currentNodeId) {
      const outgoingEdge = edges.find((e) => e.source === currentNodeId);
      if (!outgoingEdge) break;

      const nextNode = nodes.find((n) => n.id === outgoingEdge.target);
      if (!nextNode || visited.has(nextNode.id)) break;
      visited.add(nextNode.id);

      const stepStart = Date.now();
      try {
        const result = await this.executeNode(organizationId, nextNode, currentPayload);
        const duration = Date.now() - stepStart;

        steps.push({
          node_id: nextNode.id,
          node_name: nextNode.data.label || nextNode.type,
          status: 'success',
          input: currentPayload,
          output: result,
          duration_ms: duration,
        });

        currentPayload = { ...currentPayload, ...result };
        currentNodeId = nextNode.id;
      } catch (err: any) {
        const duration = Date.now() - stepStart;
        steps.push({
          node_id: nextNode.id,
          node_name: nextNode.data.label || nextNode.type,
          status: 'failed',
          input: currentPayload,
          error: err.message,
          duration_ms: duration,
        });

        return {
          status: 'failed',
          steps,
          error: `Node ${nextNode.data.label} failed: ${err.message}`,
        };
      }
    }

    return { status: 'completed', steps };
  }

  private async executeNode(
    organizationId: string,
    node: WorkflowNode,
    payload: Record<string, any>
  ): Promise<Record<string, any>> {
    const actionType = node.data.actionType;

    // 1. AI Decision / Text Generation Node
    if (actionType === 'ai.generate_text' || actionType === 'ai.decision' || node.data.nodeType === 'ai') {
      const prompt =
        node.data.config?.prompt ||
        `Evaluate event payload: ${JSON.stringify(payload)}. Generate next operational instruction.`;

      const aiRes = await this.aiRouterService.routeCompletion(organizationId, null, {
        feature: 'workflow_node',
        prompt,
        routing_mode: 'free_only',
        temperature: 0.3,
      });

      return { ai_result: aiRes.text, evaluated_at: new Date().toISOString() };
    }

    // 2. AI Order Extraction
    if (actionType === 'ai.extract_order') {
      const textToExtract = payload.text || payload.message || '';
      const prompt = `Extract customer name, phone number, address, and product order details from text: "${textToExtract}". Return JSON.`;

      const aiRes = await this.aiRouterService.routeCompletion(organizationId, null, {
        feature: 'workflow_extraction',
        prompt,
        routing_mode: 'free_only',
        response_format: 'json',
      });

      try {
        return { extracted_order: JSON.parse(aiRes.text) };
      } catch {
        return { extracted_order: { raw: aiRes.text } };
      }
    }

    // 3. Send Notification Action
    if (actionType === 'notification.internal') {
      this.logger.log(`[Workflow Notification] ${node.data.label}: ${JSON.stringify(payload)}`);
      return { notified: true, timestamp: new Date().toISOString() };
    }

    // 4. Delay node
    if (node.data.nodeType === 'delay') {
      return { delayed_seconds: node.data.config?.seconds || 5 };
    }

    return { executed: true, node_id: node.id };
  }
}
