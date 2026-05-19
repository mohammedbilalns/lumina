import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Email address of the account being recovered.',
    example: 'jane@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: '6-digit OTP sent to the user email.',
    example: '123456',
    pattern: '^\\d{6}$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, {
    message: 'OTP must be a 6-digit code',
  })
  otp: string;

  @ApiProperty({
    description: 'New password with uppercase, lowercase, number, and special character.',
    example: 'Password@123',
    minLength: 8,
    maxLength: 32,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message:
      'Password must contain uppercase, lowercase, number, and special character',
  })
  newPassword: string;
}
