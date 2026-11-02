import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import type { AuthenticatedUser } from '@shopnix/types';
import {
  createWorkflowSchema,
  updateWorkflowSchema,
  testWorkflowSchema,
  type CreateWorkflowInput,
  type UpdateWorkflowInput,
  type TestWorkflowInput,
} from '@shopnix/schemas';
import { AutomationService } from './automation.service';

@ApiTags('Visual Automation Engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('automations')
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  @Get()
  @ApiOperation({ summary: 'List all visual automation workflows for store' })
  async listWorkflows(@CurrentUser() user: AuthenticatedUser) {
    const data = await this.automationService.listWorkflows(user.organizationId);
    return { success: true, data };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workflow graph and node configuration' })
  async getWorkflow(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string
  ) {
    const data = await this.automationService.getWorkflow(user.organizationId, id);
    return { success: true, data };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new visual automation workflow' })
  @UsePipes(new ZodValidationPipe(createWorkflowSchema))
  async createWorkflow(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateWorkflowInput
  ) {
    const data = await this.automationService.createWorkflow(user.organizationId, dto as any);
    return { success: true, data, message: 'Workflow created successfully' };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update workflow nodes, edges, or trigger settings' })
  @UsePipes(new ZodValidationPipe(updateWorkflowSchema))
  async updateWorkflow(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateWorkflowInput
  ) {
    const data = await this.automationService.updateWorkflow(user.organizationId, id, dto as any);
    return { success: true, data, message: 'Workflow updated' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an automation workflow' })
  async deleteWorkflow(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string
  ) {
    await this.automationService.deleteWorkflow(user.organizationId, id);
    return { success: true, message: 'Workflow deleted' };
  }

  @Post(':id/test')
  @ApiOperation({ summary: 'Test execute a workflow with mock event payload' })
  @UsePipes(new ZodValidationPipe(testWorkflowSchema))
  async testWorkflow(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: TestWorkflowInput
  ) {
    const data = await this.automationService.testWorkflow(user.organizationId, id, dto);
    return { success: true, data };
  }

  @Get(':id/logs')
  @ApiOperation({ summary: 'Get execution history logs for workflow' })
  async getExecutionLogs(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string
  ) {
    const data = await this.automationService.getExecutionLogs(user.organizationId, id);
    return { success: true, data };
  }
}
