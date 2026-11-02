import type { AxiosInstance } from 'axios';
import type {
  ApiResponse,
  WorkflowDefinition,
  WorkflowExecutionLog,
  CreateWorkflowDto,
  UpdateWorkflowDto,
  TestWorkflowDto,
} from '@shopnix/types';

export class AutomationApi {
  constructor(private readonly axios: AxiosInstance) {}

  async listWorkflows(): Promise<ApiResponse<WorkflowDefinition[]>> {
    const { data } = await this.axios.get<ApiResponse<WorkflowDefinition[]>>('/automations');
    return data;
  }

  async getWorkflow(id: string): Promise<ApiResponse<WorkflowDefinition>> {
    const { data } = await this.axios.get<ApiResponse<WorkflowDefinition>>(`/automations/${id}`);
    return data;
  }

  async createWorkflow(dto: CreateWorkflowDto): Promise<ApiResponse<WorkflowDefinition>> {
    const { data } = await this.axios.post<ApiResponse<WorkflowDefinition>>('/automations', dto);
    return data;
  }

  async updateWorkflow(
    id: string,
    dto: UpdateWorkflowDto
  ): Promise<ApiResponse<WorkflowDefinition>> {
    const { data } = await this.axios.patch<ApiResponse<WorkflowDefinition>>(
      `/automations/${id}`,
      dto
    );
    return data;
  }

  async deleteWorkflow(id: string): Promise<ApiResponse<{ message: string }>> {
    const { data } = await this.axios.delete<ApiResponse<{ message: string }>>(
      `/automations/${id}`
    );
    return data;
  }

  async testWorkflow(
    id: string,
    dto: TestWorkflowDto
  ): Promise<ApiResponse<WorkflowExecutionLog>> {
    const { data } = await this.axios.post<ApiResponse<WorkflowExecutionLog>>(
      `/automations/${id}/test`,
      dto
    );
    return data;
  }

  async getExecutionLogs(workflowId: string): Promise<ApiResponse<WorkflowExecutionLog[]>> {
    const { data } = await this.axios.get<ApiResponse<WorkflowExecutionLog[]>>(
      `/automations/${workflowId}/logs`
    );
    return data;
  }
}
