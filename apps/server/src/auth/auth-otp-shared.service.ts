import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { OtpResponse } from '@lumina/shared-types';
import { UsersRepository } from 'src/users/users.repository';
import { UserValidationService } from 'src/users/user-validation.service';
import { PasswordService } from '../security/password.service';

@Injectable()
export class AuthOtpSharedService {
  private static readonly OTP_EXPIRY_MINUTES = 10;
  private static readonly OTP_ACTION_LIMIT = 5;

  constructor(
    private readonly userRepository: UsersRepository,
    private readonly userValidationService: UserValidationService,
    private readonly passwordService: PasswordService,
  ) {}

  async getVerifiedActiveUser(email: string) {
    let user = await this.userRepository.findByEmail(email);

    user = this.userValidationService.validateActiveUser(user);

    if (!user.isVerified) {
      throw new BadRequestException('Account is not verified');
    }

    return user;
  }

  async getPendingUserByEmail(
    email: string,
    notFoundMessage: string,
    verifiedMessage: string,
    missingOtpMessage?: string,
  ) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new NotFoundException(notFoundMessage);
    if (user.isVerified) throw new ConflictException(verifiedMessage);
    if (missingOtpMessage) {
      this.assertOtpPresent(user.otpHash, user.otpExpiresAt, missingOtpMessage);
    }

    return user;
  }

  async ensureValidOtp(
    user: {
      id: string;
      otpHash: string | null;
      otpAttempts: number;
      otpExpiresAt: Date | null;
    },
    otp: string,
    limitMessage: string,
  ) {
    this.assertOtpPresent(user.otpHash, user.otpExpiresAt);
    this.assertOtpActionLimit(user.otpAttempts, limitMessage);
    const { otpHash, otpExpiresAt } = user;

    if (!otpHash || !otpExpiresAt)
      throw new BadRequestException('OTP not found');
    if (otpExpiresAt.getTime() < Date.now()) {
      throw new BadRequestException('OTP expired. Please request a new OTP');
    }

    const isValidOtp = await this.passwordService.verify(otpHash, otp);
    if (isValidOtp) return;

    const updatedUser = await this.userRepository.updateSignupOtp(user.id, {
      otpHash,
      otpAttempts: user.otpAttempts + 1,
      otpExpiresAt,
    });

    this.assertOtpActionLimit(updatedUser.otpAttempts, limitMessage);
    throw new BadRequestException('Invalid OTP');
  }

  assertOtpPresent(
    otpHash: string | null,
    otpExpiresAt: Date | null,
    message = 'OTP not found',
  ) {
    if (!otpHash || !otpExpiresAt) throw new BadRequestException(message);
  }

  buildOtpResponse(email: string, otpAttempts: number): OtpResponse {
    return {
      email,
      attemptsRemaining: Math.max(
        AuthOtpSharedService.OTP_ACTION_LIMIT - otpAttempts,
        0,
      ),
    };
  }

  createOtpExpiryDate() {
    return new Date(
      Date.now() + AuthOtpSharedService.OTP_EXPIRY_MINUTES * 60 * 1000,
    );
  }

  assertOtpActionLimit(
    otpAttempts: number,
    message = 'OTP limit exceeded. Please sign up again',
  ) {
    if (otpAttempts >= AuthOtpSharedService.OTP_ACTION_LIMIT) {
      throw new BadRequestException(message);
    }
  }
}
