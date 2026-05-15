import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { VerifySignupOtpDto } from './dto/verify-signup-otp.dto';
import { ResendSignupOtpDto } from './dto/resend-signup-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResendForgotPasswordOtpDto } from './dto/resend-forgot-password-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthSignupOtpService } from './auth-signup-otp.service';
import { AuthPasswordResetService } from './auth-password-reset.service';

@Injectable()
export class AuthOtpService {
  constructor(
    private readonly authSignupOtpService: AuthSignupOtpService,
    private readonly authPasswordResetService: AuthPasswordResetService,
  ) {}

  signup(dto: SignupDto) {
    return this.authSignupOtpService.signup(dto);
  }

  verifySignupOtp(dto: VerifySignupOtpDto) {
    return this.authSignupOtpService.verifySignupOtp(dto);
  }

  resendSignupOtp(dto: ResendSignupOtpDto) {
    return this.authSignupOtpService.resendSignupOtp(dto);
  }

  forgotPassword(dto: ForgotPasswordDto) {
    return this.authPasswordResetService.forgotPassword(dto);
  }

  resendForgotPasswordOtp(dto: ResendForgotPasswordOtpDto) {
    return this.authPasswordResetService.resendForgotPasswordOtp(dto);
  }

  resetPassword(dto: ResetPasswordDto) {
    return this.authPasswordResetService.resetPassword(dto);
  }
}
