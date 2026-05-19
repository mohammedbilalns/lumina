import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendForgotPasswordOtpDto {
  @ApiProperty({
    description: 'Email address that should receive a new password reset OTP.',
    example: 'jane@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
