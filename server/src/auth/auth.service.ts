import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { PasswordService } from './password.service';
import { AuthMapper } from './mappers/auth.mapper';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtPayload } from './types/jwt-payload.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
  ) {}

  async signup(dto: SignupDto) {
    const existingUser = await this.authRepository.findByEmailOrPhone(
      dto.email,
      dto.phone,
    );

    if (existingUser) {
      if (existingUser.email === dto.email) {
        throw new ConflictException('Email already exists');
      }

      if (existingUser.phone === dto.phone) {
        throw new ConflictException('Phone number already exists');
      }
    }

    const passwordHash = await this.passwordService.hash(dto.password);

    const user = await this.authRepository.createUser({
      ...dto,
      dateOfBirth: dto.dateOfBirth,
      passwordHash,
    });

    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    const refreshTokenHash = await this.passwordService.hash(refreshToken);
    await this.authRepository.udpateRefreshToken(user.id, refreshTokenHash);

    return {
      message: 'Signup successful',
      ...AuthMapper.toAuthResponse(user, accessToken, refreshToken),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.authRepository.findByCredential(dto.credential);
    if (!user) throw new UnauthorizedException('Invalid credential');

    if (!user.isActive) {
      throw new ForbiddenException('Your account has been blocked');
    }

    const isValid = await this.passwordService.verify(
      user.passwordHash,
      dto.password,
    );

    if (!isValid) throw new UnauthorizedException('Invalid password');

    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    const refreshTokenHash = await this.passwordService.hash(refreshToken);

    await this.authRepository.udpateRefreshToken(user.id, refreshTokenHash);
    return {
      message: 'Login successful',
      ...AuthMapper.toAuthResponse(user, accessToken, refreshToken),
    };
  }

  async logout(dto: LogoutDto) {
    await this.authRepository.udpateRefreshToken(dto.userId, '');
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
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.authRepository.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Account blocked');
    }

    if (!user.refreshToken) {
      throw new UnauthorizedException('Session expired');
    }

    const isValidToken = await this.passwordService.verify(
      user?.refreshToken,
      dto.refreshToken,
    );

    if (!isValidToken) throw new UnauthorizedException('Invalid token');

    const { accessToken, refreshToken } = await this.generateTokens(user.id);
    const refreshTokenHash = await this.passwordService.hash(refreshToken);

    await this.authRepository.udpateRefreshToken(user.id, refreshTokenHash);
    return {
      message: 'Refresh token successful',
      ...AuthMapper.toAuthResponse(user, accessToken, refreshToken),
    };
  }

  private async generateTokens(userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ sub: userId }),
      this.jwtService.signAsync({ sub: userId }),
    ]);

    return { accessToken, refreshToken };
  }
}
