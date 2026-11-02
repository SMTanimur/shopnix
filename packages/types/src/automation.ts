export type WorkflowTriggerType =
  | 'order.created'
  | 'order.status_changed'
  | 'message.received'
  | 'inventory.low_stock'
  | 'customer.created'
  | 'schedule.cron'
  | 'webhook.received';

export type WorkflowActionType =
  | 'order.create'
  | 'order.update_status'
  | 'inventory.adjust'
  | 'message.send_whatsapp'
  | 'message.send_messenger'
  | 'notification.internal'
  | 'http.webhook'
  | 'delay.wait'
  | 'ai.generate_text'
  | 'ai.extract_order'
  | 'ai.classify_intent'
  | 'ai.decision';

export interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    nodeType: 'trigger' | 'action' | 'ai' | 'condition' | 'delay';
    actionType?: WorkflowActionType;
    triggerType?: WorkflowTriggerType;
    config?: Record<string, any>;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  label?: string;
}

export interface WorkflowDefinition {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  trigger_type: WorkflowTriggerType;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  execution_count: number;
  last_executed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkflowExecutionStep {
  node_id: string;
  node_name: string;
  status: 'success' | 'failed' | 'skipped';
  input?: any;
  output?: any;
  error?: string;
  duration_ms: number;
}

export interface WorkflowExecutionLog {
  id: string;
  workflow_id: string;
  organization_id: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  steps: WorkflowExecutionStep[];
  duration_ms: number;
  error?: string | null;
  created_at: string;
}

export interface CreateWorkflowDto {
  name: string;
  description?: string;
  trigger_type: WorkflowTriggerType;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  is_active?: boolean;
}

export interface UpdateWorkflowDto {
  name?: string;
  description?: string;
  trigger_type?: WorkflowTriggerType;
  nodes?: WorkflowNode[];
  edges?: WorkflowEdge[];
  is_active?: boolean;
}

export interface TestWorkflowDto {
  mock_payload: Record<string, any>;
}
