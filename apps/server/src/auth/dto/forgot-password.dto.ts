import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email address of the account requesting a password reset OTP.',
    example: 'jane@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
