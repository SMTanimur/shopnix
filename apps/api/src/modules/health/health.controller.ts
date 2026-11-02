import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'API service liveness and health check endpoint' })
  check() {
    return {
      status: 'ok',
      service: 'shopnix-api',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
