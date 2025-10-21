import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { Public } from '../../infrastructure/config/decorators/public.decorator';
import { EventsService } from '../../application/services/events.service';
import { EventStatus } from '../../domain/entities/event.entity';
import {
  EventResponseDto,
  PaginatedEventsResponseDto,
} from '../../application/dtos/events/event-response.dto';
import {
  NotFoundErrorResponseDto,
  ValidationErrorResponseDto,
} from '../../application/dtos/common/error-response.dto';

@ApiTags('Events - Public')
@Controller('api/v1/events')
export class EventsPublicController {
  constructor(private readonly eventsService: EventsService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all published events',
    description: 'Retrieves a paginated list of all published events available to the public.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (default: 20)',
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description: 'List of published events retrieved successfully',
    type: PaginatedEventsResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
    type: ValidationErrorResponseDto,
  })
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const events = await this.eventsService.findAll(EventStatus.PUBLISHED, skip, limitNum);

    return {
      data: events,
      meta: {
        page: pageNum,
        limit: limitNum,
        total: events.length,
      },
    };
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get event by ID',
    description: 'Retrieves detailed information about a specific event by its unique identifier.',
  })
  @ApiParam({
    name: 'id',
    description: 'Event unique identifier (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Event found and returned successfully',
    type: EventResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
    type: NotFoundErrorResponseDto,
  })
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Get event by slug',
    description: 'Retrieves detailed information about a specific event by its URL-friendly slug.',
  })
  @ApiParam({
    name: 'slug',
    description: 'Event URL-friendly slug',
    example: 'summer-music-festival-2024',
  })
  @ApiResponse({
    status: 200,
    description: 'Event found and returned successfully',
    type: EventResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
    type: NotFoundErrorResponseDto,
  })
  async findBySlug(@Param('slug') slug: string) {
    return this.eventsService.findBySlug(slug);
  }
}
