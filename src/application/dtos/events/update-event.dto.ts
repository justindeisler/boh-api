import {
  IsString,
  IsEnum,
  IsDateString,
  IsNumber,
  IsOptional,
  Min,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EventCategory } from '@prisma/client';

export class UpdateEventDto {
  @ApiProperty({
    description: 'Event title',
    example: 'Summer Music Festival 2025',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'URL-friendly slug for the event (must be unique)',
    example: 'summer-music-festival-2025',
    required: false,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: 'Detailed event description',
    example: 'Join us for an unforgettable summer music festival featuring top artists from around the world. Experience three days of non-stop music, food, and entertainment.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Event category',
    enum: EventCategory,
    enumName: 'EventCategory',
    example: 'CONCERT',
    required: false,
  })
  @IsEnum(EventCategory)
  @IsOptional()
  category?: EventCategory;

  @ApiProperty({
    description: 'Event start date and time in ISO 8601 format',
    example: '2025-07-15T18:00:00Z',
    format: 'date-time',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    description: 'Event end date and time in ISO 8601 format',
    example: '2025-07-17T23:00:00Z',
    format: 'date-time',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    description: 'Ticket price in currency units (minimum 0)',
    example: 99.99,
    minimum: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'Maximum event capacity (minimum 1)',
    example: 5000,
    minimum: 1,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @ApiProperty({
    description: 'Venue identifier (UUID) - Use an existing venue ID from your database',
    example: 'cmh0sznjx0000qn7ztrodyd4b',
    required: false,
  })
  @IsString()
  @IsOptional()
  venueId?: string;

  @ApiProperty({
    description: 'Event image URL (optional)',
    example: 'https://example.com/images/summer-festival.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: 'Event promotional video URL (optional)',
    example: 'https://youtube.com/watch?v=example',
    required: false,
  })
  @IsString()
  @IsOptional()
  videoUrl?: string;

  @ApiProperty({
    description: 'Event tags for categorization (optional)',
    example: ['music', 'outdoor', 'summer', 'festival'],
    isArray: true,
    type: String,
    required: false,
  })
  @IsArray()
  @IsOptional()
  tags?: string[];
}
