import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendForgotPasswordOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
