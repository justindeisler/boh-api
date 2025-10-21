import { ApiProperty } from '@nestjs/swagger';

export class EventResponseDto {
  @ApiProperty({
    description: 'Unique event identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    description: 'Event title',
    example: 'Summer Music Festival 2024',
  })
  title!: string;

  @ApiProperty({
    description: 'URL-friendly slug for the event',
    example: 'summer-music-festival-2024',
  })
  slug!: string;

  @ApiProperty({
    description: 'Detailed event description',
    example: 'Join us for an unforgettable summer music festival featuring top artists from around the world.',
  })
  description!: string;

  @ApiProperty({
    description: 'Event category',
    enum: ['CONCERT', 'CONFERENCE', 'WORKSHOP', 'SPORTS', 'FESTIVAL', 'EXHIBITION', 'OTHER'],
    example: 'FESTIVAL',
  })
  category!: string;

  @ApiProperty({
    description: 'Event status',
    enum: ['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED'],
    example: 'PUBLISHED',
  })
  status!: string;

  @ApiProperty({
    description: 'Event start date and time',
    example: '2024-07-15T18:00:00Z',
  })
  startDate!: Date;

  @ApiProperty({
    description: 'Event end date and time',
    example: '2024-07-17T23:00:00Z',
  })
  endDate!: Date;

  @ApiProperty({
    description: 'Ticket price in currency units',
    example: 99.99,
  })
  price!: number;

  @ApiProperty({
    description: 'Maximum event capacity',
    example: 5000,
  })
  capacity!: number;

  @ApiProperty({
    description: 'Number of tickets sold',
    example: 3250,
  })
  ticketsSold!: number;

  @ApiProperty({
    description: 'Venue identifier',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  venueId!: string;

  @ApiProperty({
    description: 'Organizer user identifier',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  organizerId!: string;

  @ApiProperty({
    description: 'Event image URL',
    example: 'https://example.com/images/summer-festival.jpg',
    required: false,
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'Event promotional video URL',
    example: 'https://youtube.com/watch?v=example',
    required: false,
  })
  videoUrl?: string;

  @ApiProperty({
    description: 'Event tags for categorization',
    example: ['music', 'outdoor', 'summer', 'festival'],
    type: [String],
    required: false,
  })
  tags?: string[];

  @ApiProperty({
    description: 'Event creation timestamp',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-20T14:45:00Z',
  })
  updatedAt!: Date;
}

export class PaginatedEventsResponseDto {
  @ApiProperty({
    description: 'Array of events',
    type: [EventResponseDto],
  })
  data!: EventResponseDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    example: {
      total: 150,
      page: 1,
      limit: 10,
      totalPages: 15,
    },
  })
  meta!: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
