import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class VerifySignupOtpDto {
  @ApiProperty({
    description: 'Email address used during signup.',
    example: 'jane@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: '6-digit OTP sent to the email address.',
    example: '123456',
    pattern: '^\\d{6}$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, {
    message: 'OTP must be a 6-digit code',
  })
  otp: string;
}
