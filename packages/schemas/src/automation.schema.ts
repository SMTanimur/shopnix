import { z } from 'zod';

export const workflowNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: z.object({
    label: z.string(),
    nodeType: z.enum(['trigger', 'action', 'ai', 'condition', 'delay']),
    actionType: z.string().optional(),
    triggerType: z.string().optional(),
    config: z.record(z.any()).optional(),
  }),
});

export const workflowEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().nullable().optional(),
  targetHandle: z.string().nullable().optional(),
  label: z.string().optional(),
});

export const createWorkflowSchema = z.object({
  name: z.string().min(2, 'Workflow name must be at least 2 characters').max(100),
  description: z.string().max(300).optional(),
  trigger_type: z.enum([
    'order.created',
    'order.status_changed',
    'message.received',
    'inventory.low_stock',
    'customer.created',
    'schedule.cron',
    'webhook.received',
  ]),
  nodes: z.array(workflowNodeSchema).min(1, 'Workflow must have at least one node'),
  edges: z.array(workflowEdgeSchema).default([]),
  is_active: z.boolean().default(true),
});

export const updateWorkflowSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().max(300).optional(),
  trigger_type: z
    .enum([
      'order.created',
      'order.status_changed',
      'message.received',
      'inventory.low_stock',
      'customer.created',
      'schedule.cron',
      'webhook.received',
    ])
    .optional(),
  nodes: z.array(workflowNodeSchema).optional(),
  edges: z.array(workflowEdgeSchema).optional(),
  is_active: z.boolean().optional(),
});

export const testWorkflowSchema = z.object({
  mock_payload: z.record(z.any()),
});

export type CreateWorkflowInput = z.infer<typeof createWorkflowSchema>;
export type UpdateWorkflowInput = z.infer<typeof updateWorkflowSchema>;
export type TestWorkflowInput = z.infer<typeof testWorkflowSchema>;
