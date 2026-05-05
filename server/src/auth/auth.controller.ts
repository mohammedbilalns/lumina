import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('signup')
  async signup(
    @Body() dto: SignupDto,

    @Res({
      passthrough: true,
    })
    response: Response,
  ) {
    const result = await this.authService.signup(dto);

    this.setRefreshCookie(result.refreshToken, response);

    return {
      message: result.message,
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,

    @Res({
      passthrough: true,
    })
    response: Response,
  ) {
    const result = await this.authService.login(dto);
    this.setRefreshCookie(result.refreshToken, response);

    return {
      message: result.message,
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Post('logout')
  logout() {
    return { message: 'Logged out successfully' };
  }

  private setRefreshCookie(refreshToken: string, res: Response) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  }
}
