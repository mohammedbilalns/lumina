import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from 'src/users/users.repository';
import { UserValidationService } from 'src/users/user-validation.service';
import { PasswordService } from '../security/password.service';
import { AuthMapper } from './mappers/auth.mapper';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtPayload } from './types/jwt-payload.type';
import { TokenService } from './token.service';
import { OtpMailService } from './otp-mail.service';
import { VerifySignupOtpDto } from './dto/verify-signup-otp.dto';
import { ResendSignupOtpDto } from './dto/resend-signup-otp.dto';

@Injectable()
export class AuthService {
  private static readonly OTP_EXPIRY_MINUTES = 10;
  private static readonly OTP_ACTION_LIMIT = 5;

  constructor(
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
    private readonly userValidationService: UserValidationService,
    private readonly tokenService: TokenService,
    private readonly otpMailService: OtpMailService,
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

    if (existingUser?.isVerified) {
      if (existingUser.email === dto.email) {
        throw new ConflictException('Email already exists');
      }

      if (existingUser.phone === dto.phone) {
        throw new ConflictException('Phone number already exists');
      }
    }

    if (
      emailOwner &&
      existingUser &&
      emailOwner.id !== existingUser.id &&
      !emailOwner.isVerified
    ) {
      throw new ConflictException('Email already exists');
    }

    const otp = this.generateOtp();
    const passwordHash = await this.passwordService.hash(dto.password);
    const otpHash = await this.passwordService.hash(otp);

    let user = existingUser;

    if (!user) {
      user = await this.userRepository.createUser({
        ...dto,
        passwordHash,
        otpHash,
        otpAttempts: 0,
        otpExpiresAt: this.getOtpExpiryDate(),
        isVerified: false,
      });
    } else {
      this.assertOtpActionLimit(user.otpAttempts);

      user = await this.userRepository.updateSignupUser(user.id, {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        dateOfBirth: dto.dateOfBirth,
        passwordHash,
      });

      user = await this.userRepository.updateSignupOtp(user.id, {
        otpHash,
        otpAttempts: user.otpAttempts,
        otpExpiresAt: this.getOtpExpiryDate(),
        isVerified: false,
      });
    }

    await this.otpMailService.sendSignupOtp(dto.email, dto.firstName, otp);

    return {
      email: user.email,
      attemptsRemaining: this.getAttemptsRemaining(user.otpAttempts),
    };
  }

  async verifySignupOtp(dto: VerifySignupOtpDto) {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new NotFoundException('Pending signup not found');
    }

    if (user.isVerified) {
      throw new ConflictException('Account already verified');
    }

    if (!user.otpHash || !user.otpExpiresAt) {
      throw new BadRequestException('OTP not found. Please sign up again');
    }

    this.assertOtpActionLimit(user.otpAttempts);

    if (user.otpExpiresAt.getTime() < Date.now()) {
      throw new BadRequestException('OTP expired. Please request a new OTP');
    }

    const isValidOtp = await this.passwordService.verify(user.otpHash, dto.otp);

    if (!isValidOtp) {
      const updatedUser = await this.userRepository.updateSignupOtp(user.id, {
        otpHash: user.otpHash,
        otpAttempts: user.otpAttempts + 1,
        otpExpiresAt: user.otpExpiresAt,
      });

      this.assertOtpActionLimit(
        updatedUser.otpAttempts,
        'OTP limit exceeded. Please sign up again',
      );

      throw new BadRequestException('Invalid OTP');
    }

    const verifiedUser = await this.userRepository.updateSignupOtp(user.id, {
      otpHash: null,
      otpAttempts: 0,
      otpExpiresAt: null,
      isVerified: true,
    });

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(verifiedUser.id);

    await this.persistRefreshToken(verifiedUser.id, refreshToken);

    return AuthMapper.toAuthResponse(verifiedUser, accessToken, refreshToken);
  }

  async resendSignupOtp(dto: ResendSignupOtpDto) {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new NotFoundException('Pending signup not found');
    }

    if (user.isVerified) {
      throw new ConflictException('Account already verified');
    }

    const nextAttemptCount = user.otpAttempts + 1;
    this.assertOtpActionLimit(
      nextAttemptCount,
      'OTP limit exceeded. Please sign up again',
    );

    const otp = this.generateOtp();
    const otpHash = await this.passwordService.hash(otp);

    const updatedUser = await this.userRepository.updateSignupOtp(user.id, {
      otpHash,
      otpAttempts: nextAttemptCount,
      otpExpiresAt: this.getOtpExpiryDate(),
      isVerified: false,
    });

    await this.otpMailService.sendSignupOtp(
      updatedUser.email,
      updatedUser.firstName,
      otp,
    );

    return {
      email: updatedUser.email,
      attemptsRemaining: this.getAttemptsRemaining(updatedUser.otpAttempts),
    };
  }

  async login(dto: LoginDto) {
    let user = await this.userRepository.findByCredential(dto.credential);

    user = this.userValidationService.validateActiveUser(user);

    const isValid = await this.passwordService.verify(
      user.passwordHash,
      dto.password,
    );

    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(user.id);

    await this.persistRefreshToken(user.id, refreshToken);

    return AuthMapper.toAuthResponse(user, accessToken, refreshToken);
  }

  async logout(dto: LogoutDto) {
    await this.userRepository.udpateRefreshToken(dto.userId, '');
  }

  async refreshToken(dto: RefreshTokenDto) {
    let payload: JwtPayload;

    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(
        dto.refreshToken,
        {
          secret: this.configService.get('JWT_SECRET'),
        },
      );
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    let user = await this.userRepository.findById(payload.sub);

    user = this.userValidationService.validateActiveUser(user);

    if (!user.refreshToken) {
      throw new UnauthorizedException('Session expired');
    }

    const isValidToken = await this.passwordService.verify(
      user.refreshToken,
      dto.refreshToken,
    );

    if (!isValidToken) throw new UnauthorizedException('Invalid token');

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(user.id);
    await this.persistRefreshToken(user.id, refreshToken);
    return AuthMapper.toAuthResponse(user, accessToken, refreshToken);
  }

  private async persistRefreshToken(userId: string, refreshToken: string) {
    const hash = await this.passwordService.hash(refreshToken);

    await this.userRepository.udpateRefreshToken(userId, hash);
  }

  //FIX: seperate utilities 
  private generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private getOtpExpiryDate() {
    return new Date(Date.now() + AuthService.OTP_EXPIRY_MINUTES * 60 * 1000);
  }

  private getAttemptsRemaining(otpAttempts: number) {
    return Math.max(AuthService.OTP_ACTION_LIMIT - otpAttempts, 0);
  }

  private assertOtpActionLimit(
    otpAttempts: number,
    message = 'OTP limit exceeded. Please sign up again',
  ) {
    if (otpAttempts >= AuthService.OTP_ACTION_LIMIT) {
      throw new BadRequestException(message);
    }
  }
}
