import { Injectable } from '@nestjs/common';
import { AuthOtpService } from './auth-otp.service';
import { AuthSessionService } from './auth-session.service';
import { SignupDto } from './dto/signup.dto';
import { VerifySignupOtpDto } from './dto/verify-signup-otp.dto';
import { ResendSignupOtpDto } from './dto/resend-signup-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResendForgotPasswordOtpDto } from './dto/resend-forgot-password-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authOtpService: AuthOtpService,
    private readonly authSessionService: AuthSessionService,
  ) {}

  signup(dto: SignupDto) {
    return this.authOtpService.signup(dto);
  }

  async verifySignupOtp(dto: VerifySignupOtpDto) {
    const verifiedUser = await this.authOtpService.verifySignupOtp(dto);

    return this.authSessionService.issueSession(verifiedUser.id, verifiedUser);
  }

  resendSignupOtp(dto: ResendSignupOtpDto) {
    return this.authOtpService.resendSignupOtp(dto);
  }

  forgotPassword(dto: ForgotPasswordDto) {
    return this.authOtpService.forgotPassword(dto);
  }

  resendForgotPasswordOtp(dto: ResendForgotPasswordOtpDto) {
    return this.authOtpService.resendForgotPasswordOtp(dto);
  }

  resetPassword(dto: ResetPasswordDto) {
    return this.authOtpService.resetPassword(dto);
  }

  login(dto: LoginDto) {
    return this.authSessionService.login(dto);
  }

  logout(dto: LogoutDto) {
    return this.authSessionService.logout(dto);
  }

  refreshToken(dto: RefreshTokenDto) {
    return this.authSessionService.refreshToken(dto);
  }
}
