import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from 'src/users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { PasswordService } from './password.service';
import { AuthMapper } from './mappers/auth.mapper';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtPayload } from './types/jwt-payload.type';
import { ConfigService } from '@nestjs/config';
import { UserValidationService } from 'src/users/user-validation.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
    private readonly userValidationService: UserValidationService,
  ) {}

  async signup(dto: SignupDto) {
    const existingUser = await this.userRepository.findByEmailOrPhone(
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

    const user = await this.userRepository.createUser({
      ...dto,
      dateOfBirth: dto.dateOfBirth,
      passwordHash,
    });

    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    await this.persistRefreshToken(user.id, refreshToken);

    return {
      message: 'Signup successful',
      ...AuthMapper.toAuthResponse(user, accessToken, refreshToken),
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

    const { accessToken, refreshToken } = await this.generateTokens(user.id);

    await this.persistRefreshToken(user.id, refreshToken);

    return {
      message: 'Login successful',
      ...AuthMapper.toAuthResponse(user, accessToken, refreshToken),
    };
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
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }

    let user = await this.userRepository.findById(payload.sub);

    user = this.userValidationService.validateActiveUser(user);

    if (!user.refreshToken) {
      throw new UnauthorizedException('Session expired');
    }

    const isValidToken = await this.passwordService.verify(
      user?.refreshToken,
      dto.refreshToken,
    );

    if (!isValidToken) throw new UnauthorizedException('Invalid token');

    const { accessToken, refreshToken } = await this.generateTokens(user.id);
    await this.persistRefreshToken(user.id, refreshToken);
    return {
      message: 'Refresh token successful',
      ...AuthMapper.toAuthResponse(user, accessToken, refreshToken),
    };
  }

  private async generateTokens(userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId },
        {
          secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        },
      ),
      this.jwtService.signAsync(
        { sub: userId },
        {
          secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async persistRefreshToken(userId: string, refreshToken: string) {
    const hash = await this.passwordService.hash(refreshToken);

    await this.userRepository.udpateRefreshToken(userId, hash);
  }
}
