import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../infrastructure/config/guards/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/config/guards/roles.guard';
import { Roles } from '../../infrastructure/config/decorators/roles.decorator';
import { CurrentUser } from '../../infrastructure/config/decorators/current-user.decorator';
import { UserRole } from '../../domain/entities/user.entity';
import { EventsService } from '../../application/services/events.service';
import { CreateEventDto } from '../../application/dtos/events/create-event.dto';
import { UpdateEventDto } from '../../application/dtos/events/update-event.dto';
import {
  EventResponseDto,
  PaginatedEventsResponseDto,
} from '../../application/dtos/events/event-response.dto';
import { MessageResponseDto } from '../../application/dtos/auth/auth-response.dto';
import {
  UnauthorizedErrorResponseDto,
  ForbiddenErrorResponseDto,
  NotFoundErrorResponseDto,
  ValidationErrorResponseDto,
} from '../../application/dtos/common/error-response.dto';

@ApiTags('Events - Admin')
@ApiBearerAuth('JWT-auth')
@Controller('api/v1/admin/events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsAdminController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiOperation({
    summary: 'Get all events (Admin)',
    description: 'Retrieves a paginated list of all events regardless of status. Requires ADMIN or ORGANIZER role.',
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
    description: 'List of events retrieved successfully',
    type: PaginatedEventsResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
    type: UnauthorizedErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
    type: ForbiddenErrorResponseDto,
  })
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const events = await this.eventsService.findAll(undefined, skip, limitNum);

    return {
      data: events,
      meta: {
        page: pageNum,
        limit: limitNum,
        total: events.length,
      },
    };
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiOperation({
    summary: 'Get event by ID (Admin)',
    description: 'Retrieves detailed information about a specific event. Requires ADMIN or ORGANIZER role.',
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
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
    type: UnauthorizedErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
    type: ForbiddenErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
    type: NotFoundErrorResponseDto,
  })
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiOperation({
    summary: 'Create a new event',
    description: 'Creates a new event with the provided details. Requires ADMIN or ORGANIZER role. The authenticated user will be set as the event organizer.',
  })
  @ApiBody({
    type: CreateEventDto,
    description: 'Event creation data',
  })
  @ApiResponse({
    status: 201,
    description: 'Event created successfully',
    type: EventResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or invalid data',
    type: ValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
    type: UnauthorizedErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
    type: ForbiddenErrorResponseDto,
  })
  async create(@Body() createEventDto: CreateEventDto, @CurrentUser() user: any) {
    return this.eventsService.create(createEventDto, user.id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.ORGANIZER)
  @ApiOperation({
    summary: 'Update an event',
    description: 'Updates an existing event with the provided details. Requires ADMIN or ORGANIZER role. Organizers can only update their own events.',
  })
  @ApiParam({
    name: 'id',
    description: 'Event unique identifier (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: UpdateEventDto,
    description: 'Event update data (all fields optional)',
  })
  @ApiResponse({
    status: 200,
    description: 'Event updated successfully',
    type: EventResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error or invalid data',
    type: ValidationErrorResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
    type: UnauthorizedErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
    type: ForbiddenErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
    type: NotFoundErrorResponseDto,
  })
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Delete an event',
    description: 'Permanently deletes an event from the system. Requires ADMIN role only.',
  })
  @ApiParam({
    name: 'id',
    description: 'Event unique identifier (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Event deleted successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
    type: UnauthorizedErrorResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only ADMIN can delete events',
    type: ForbiddenErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Event not found',
    type: NotFoundErrorResponseDto,
  })
  async delete(@Param('id') id: string) {
    await this.eventsService.delete(id);
    return { message: 'Event deleted successfully' };
  }
}
