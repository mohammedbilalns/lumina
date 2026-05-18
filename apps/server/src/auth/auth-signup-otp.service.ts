import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UsersRepository } from 'src/users/users.repository';
import { PasswordService } from '../security/password.service';
import { SignupDto } from './dto/signup.dto';
import { VerifySignupOtpDto } from './dto/verify-signup-otp.dto';
import { ResendSignupOtpDto } from './dto/resend-signup-otp.dto';
import { OtpMailService } from './otp-mail.service';
import { AuthOtpSharedService } from './auth-otp-shared.service';

@Injectable()
export class AuthSignupOtpService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly passwordService: PasswordService,
    private readonly otpMailService: OtpMailService,
    private readonly authOtpSharedService: AuthOtpSharedService,
  ) {}

  async signup(dto: SignupDto) {
    if (!dto?.email || !dto?.phone || !dto?.password) {
      throw new BadRequestException('Invalid signup payload');
    }

    const existingUser = await this.userRepository.findByEmailOrPhone(
      dto.email,
      dto.phone,
    );
    const emailOwner = await this.userRepository.findByEmail(dto.email);
    const phoneOwner = await this.userRepository.findByPhone(dto.phone);

    this.assertUniqueSignupFields(
      dto.email,
      dto.phone,
      existingUser,
      emailOwner,
      phoneOwner,
    );

    const otp = this.generateOtp();
    const passwordHash = await this.passwordService.hash(dto.password);
    const otpHash = await this.passwordService.hash(otp);
    const otpExpiresAt = this.authOtpSharedService.createOtpExpiryDate();

    const user = !existingUser
      ? await this.userRepository.createUser({
          ...dto,
          passwordHash,
          otpHash,
          otpAttempts: 0,
          otpExpiresAt,
          isVerified: false,
        })
      : await this.updatePendingSignup(
          existingUser,
          dto,
          passwordHash,
          otpHash,
          otpExpiresAt,
        );

    await this.otpMailService.sendSignupOtp(dto.email, dto.firstName, otp);
    return this.authOtpSharedService.buildOtpResponse(
      user.email,
      user.otpAttempts,
    );
  }

  async verifySignupOtp(dto: VerifySignupOtpDto) {
    const user = await this.authOtpSharedService.getPendingUserByEmail(
      dto.email,
      'Pending signup not found',
      'Account already verified',
      'OTP not found. Please sign up again',
    );

    await this.authOtpSharedService.ensureValidOtp(
      user,
      dto.otp,
      'OTP limit exceeded. Please sign up again',
    );

    return this.userRepository.updateSignupOtp(user.id, {
      otpHash: null,
      otpAttempts: 0,
      otpExpiresAt: null,
      isVerified: true,
    });
  }

  async resendSignupOtp(dto: ResendSignupOtpDto) {
    const user = await this.authOtpSharedService.getPendingUserByEmail(
      dto.email,
      'Pending signup not found',
      'Account already verified',
    );

    const updatedUser = await this.issueSignupOtp(
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

  private async updatePendingSignup(
    user: Awaited<ReturnType<UsersRepository['findByEmailOrPhone']>>,
    dto: SignupDto,
    passwordHash: string,
    otpHash: string,
    otpExpiresAt: Date,
  ) {
    if (!user) throw new BadRequestException('Invalid signup payload');
    this.authOtpSharedService.assertOtpActionLimit(user.otpAttempts);

    await this.userRepository.updateSignupUser(user.id, {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      dateOfBirth: dto.dateOfBirth,
      passwordHash,
    });

    return this.userRepository.updateSignupOtp(user.id, {
      otpHash,
      otpAttempts: user.otpAttempts,
      otpExpiresAt,
      isVerified: false,
    });
  }

  private async issueSignupOtp(
    userId: string,
    email: string,
    firstName: string,
    otpAttempts: number,
  ) {
    this.authOtpSharedService.assertOtpActionLimit(
      otpAttempts,
      'OTP limit exceeded. Please sign up again',
    );

    const otp = this.generateOtp();
    const otpHash = await this.passwordService.hash(otp);
    const updatedUser = await this.userRepository.updateSignupOtp(userId, {
      otpHash,
      otpAttempts,
      otpExpiresAt: this.authOtpSharedService.createOtpExpiryDate(),
      isVerified: false,
    });

    await this.otpMailService.sendSignupOtp(email, firstName, otp);
    return updatedUser;
  }

  private assertUniqueSignupFields(
    email: string,
    phone: string,
    existingUser: Awaited<ReturnType<UsersRepository['findByEmailOrPhone']>>,
    emailOwner: Awaited<ReturnType<UsersRepository['findByEmail']>>,
    phoneOwner: Awaited<ReturnType<UsersRepository['findByPhone']>>,
  ) {
    if (
      emailOwner?.isVerified &&
      (!existingUser || emailOwner.id !== existingUser.id)
    ) {
      throw new ConflictException('Email already exists');
    }
    if (
      phoneOwner?.isVerified &&
      (!existingUser || phoneOwner.id !== existingUser.id)
    ) {
      throw new ConflictException('Phone number already exists');
    }
    if (existingUser?.isVerified && existingUser.email === email) {
      throw new ConflictException('Email already exists');
    }
    if (existingUser?.isVerified && existingUser.phone === phone) {
      throw new ConflictException('Phone number already exists');
    }
    if (
      emailOwner &&
      existingUser &&
      emailOwner.id !== existingUser.id &&
      !emailOwner.isVerified
    ) {
      throw new ConflictException('Email already exists');
    }
  }

  private generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
