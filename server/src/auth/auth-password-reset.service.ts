import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/users/users.repository';
import { PasswordService } from '../security/password.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResendForgotPasswordOtpDto } from './dto/resend-forgot-password-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { OtpMailService } from './otp-mail.service';
import { AuthOtpSharedService } from './auth-otp-shared.service';

@Injectable()
export class AuthPasswordResetService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly passwordService: PasswordService,
    private readonly otpMailService: OtpMailService,
    private readonly authOtpSharedService: AuthOtpSharedService,
  ) {}

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.authOtpSharedService.getVerifiedActiveUser(
      dto.email,
    );
    const updatedUser = await this.issueResetOtp(
      user.id,
      user.email,
      user.firstName,
      0,
    );

    return this.authOtpSharedService.buildOtpResponse(
      updatedUser.email,
      updatedUser.otpAttempts,
    );
  }

  async resendForgotPasswordOtp(dto: ResendForgotPasswordOtpDto) {
    const user = await this.authOtpSharedService.getVerifiedActiveUser(
      dto.email,
    );
    const updatedUser = await this.issueResetOtp(
      user.id,
      user.email,
      user.firstName,
      user.otpAttempts + 1,
    );

    return this.authOtpSharedService.buildOtpResponse(
      updatedUser.email,
      updatedUser.otpAttempts,
    );
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.authOtpSharedService.getVerifiedActiveUser(
      dto.email,
    );

    this.authOtpSharedService.assertOtpPresent(
      user.otpHash,
      user.otpExpiresAt,
      'OTP not found. Please request a password reset again',
    );
    await this.authOtpSharedService.ensureValidOtp(
      user,
      dto.otp,
      'OTP limit exceeded. Please try again later',
    );

    const passwordHash = await this.passwordService.hash(dto.newPassword);
    await this.userRepository.updatePassword(user.id, passwordHash);
    await this.userRepository.updateSignupOtp(user.id, {
      otpHash: null,
      otpAttempts: 0,
      otpExpiresAt: null,
    });
    await this.userRepository.udpateRefreshToken(user.id, '');
  }

  private async issueResetOtp(
    userId: string,
    email: string,
    firstName: string,
    otpAttempts: number,
  ) {
    this.authOtpSharedService.assertOtpActionLimit(
      otpAttempts,
      'OTP limit exceeded. Please try again later',
    );

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await this.passwordService.hash(otp);
    const updatedUser = await this.userRepository.updateSignupOtp(userId, {
      otpHash,
      otpAttempts,
      otpExpiresAt: this.authOtpSharedService.createOtpExpiryDate(),
    });

    await this.otpMailService.sendPasswordResetOtp(email, firstName, otp);
    return updatedUser;
  }
}
