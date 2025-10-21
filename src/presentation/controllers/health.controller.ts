import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../../infrastructure/config/decorators/public.decorator';
import { PrismaService } from '../../infrastructure/database/prisma/prisma.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Health check',
    description: 'Returns the basic health status of the API service.',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'ok',
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-20T14:45:00Z',
        },
      },
    },
  })
  async health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get('ready')
  @ApiOperation({
    summary: 'Readiness check',
    description: 'Returns the readiness status including database connectivity. Used for Kubernetes readiness probes.',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is ready',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'ready',
        },
        database: {
          type: 'string',
          example: 'connected',
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
          example: '2024-01-20T14:45:00Z',
        },
      },
    },
  })
  async ready() {
    try {
      // Check database connection
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'ready',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'not ready',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
