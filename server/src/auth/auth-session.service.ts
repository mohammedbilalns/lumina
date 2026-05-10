import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from 'src/users/users.repository';
import { UserValidationService } from 'src/users/user-validation.service';
import { PasswordService } from '../security/password.service';
import { AuthMapper } from './mappers/auth.mapper';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtPayload } from './types/jwt-payload.type';
import { TokenService } from './token.service';

@Injectable()
export class AuthSessionService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userValidationService: UserValidationService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async login(dto: LoginDto) {
    let user = await this.userRepository.findByCredential(dto.credential);

    user = this.userValidationService.validateActiveUser(user);

    const isValid = await this.passwordService.verify(
      user.passwordHash,
      dto.password,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueSession(user.id, user);
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
          secret: this.configService.get('REFRESH_TOKEN_SECRET'),
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

    if (!isValidToken) {
      throw new UnauthorizedException('Invalid token');
    }

    return this.issueSession(user.id, user);
  }

  async issueSession(
    userId: string,
    user: Parameters<typeof AuthMapper.toAuthResponse>[0],
  ) {
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(userId);

    await this.persistRefreshToken(userId, refreshToken);

    return AuthMapper.toAuthResponse(user, accessToken, refreshToken);
  }

  private async persistRefreshToken(userId: string, refreshToken: string) {
    const hash = await this.passwordService.hash(refreshToken);

    await this.userRepository.udpateRefreshToken(userId, hash);
  }
}
