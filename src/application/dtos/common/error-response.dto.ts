import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode!: number;

  @ApiProperty({
    description: 'Error message or array of error messages',
    oneOf: [
      { type: 'string' },
      { type: 'array', items: { type: 'string' } },
    ],
    example: 'Validation failed',
  })
  message!: string | string[];

  @ApiProperty({
    description: 'Error type or path',
    example: 'Bad Request',
  })
  error!: string;

  @ApiProperty({
    description: 'Request timestamp',
    example: '2024-01-20T14:45:00Z',
  })
  timestamp!: string;

  @ApiProperty({
    description: 'Request path',
    example: '/api/v1/events',
  })
  path!: string;
}

export class ValidationErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'Array of validation error messages',
    example: [
      'email must be a valid email address',
      'password must be at least 8 characters',
    ],
    type: [String],
  })
  message!: string[];
}

export class UnauthorizedErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 401,
  })
  statusCode!: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Unauthorized',
  })
  message!: string;

  @ApiProperty({
    description: 'Error type',
    example: 'Unauthorized',
  })
  error!: string;
}

export class ForbiddenErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 403,
  })
  statusCode!: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Forbidden resource',
  })
  message!: string;

  @ApiProperty({
    description: 'Error type',
    example: 'Forbidden',
  })
  error!: string;
}

export class NotFoundErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 404,
  })
  statusCode!: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Resource not found',
  })
  message!: string;

  @ApiProperty({
    description: 'Error type',
    example: 'Not Found',
  })
  error!: string;
}
