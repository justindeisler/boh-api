import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description: 'User password (minimum 8 characters)',
    example: 'SecureP@ssw0rd',
    minLength: 8,
    format: 'password',
  })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password!: string;

  @ApiProperty({
    description: 'User first name (minimum 2 characters)',
    example: 'John',
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({
    description: 'User last name (minimum 2 characters)',
    example: 'Doe',
    minLength: 2,
  })
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({
    description: 'User phone number (optional)',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;
}
