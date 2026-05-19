import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendSignupOtpDto {
  @ApiProperty({
    description: 'Email address that should receive a new signup OTP.',
    example: 'jane@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
