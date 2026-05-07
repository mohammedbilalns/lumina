import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import type { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtGuard } from '../security/guards/jwt/jwt.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { type JwtPayload } from './types/jwt-payload.type';
import { VerifySignupOtpDto } from './dto/verify-signup-otp.dto';
import { ResendSignupOtpDto } from './dto/resend-signup-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResendForgotPasswordOtpDto } from './dto/resend-forgot-password-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('signup')
  async signup(@Body() data: SignupDto) {
    const result = await this.authService.signup(data);

    return {
      message: 'OTP sent to your email',
      data: result,
    };
  }

  @Post('signup/verify-otp')
  async verifySignupOtp(
    @Body() data: VerifySignupOtpDto,

    @Res({
      passthrough: true,
    })
    response: Response,
  ) {
    const result = await this.authService.verifySignupOtp(data);

    this.setRefreshCookie(result.refreshToken, response);

    return {
      message: 'Signup successful',
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    };
  }

  @Post('signup/resend-otp')
  async resendSignupOtp(@Body() data: ResendSignupOtpDto) {
    const result = await this.authService.resendSignupOtp(data);

    return {
      message: 'OTP resent to your email',
      data: result,
    };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() data: ForgotPasswordDto) {
    const result = await this.authService.forgotPassword(data);

    return {
      message: 'OTP sent to your email',
      data: result,
    };
  }

  @Post('forgot-password/resend-otp')
  async resendForgotPasswordOtp(@Body() data: ResendForgotPasswordOtpDto) {
    const result = await this.authService.resendForgotPasswordOtp(data);

    return {
      message: 'OTP resent to your email',
      data: result,
    };
  }

  @Post('reset-password')
  async resetPassword(@Body() data: ResetPasswordDto) {
    await this.authService.resetPassword(data);

    return {
      message: 'Password reset successful',
    };
  }

  @Post('login')
  async login(
    @Body() data: LoginDto,

    @Res({
      passthrough: true,
    })
    response: Response,
  ) {
    const result = await this.authService.login(data);
    this.setRefreshCookie(result.refreshToken, response);

    return {
      message: 'Login successful',
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    };
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  async logout(
    @CurrentUser()
    user: JwtPayload,

    @Res({
      passthrough: true,
    })
    response: Response,
  ) {
    await this.authService.logout({
      userId: user.sub,
    });

    response.clearCookie('refreshToken');

    return { message: 'Logged out successfully' };
  }

  @Post('refresh-token')
  async refreshToken(
    @Req()
    request: Request,

    @Res({
      passthrough: true,
    })
    response: Response,
  ) {
    const refreshToken = request.cookies['refreshToken'] as string | undefined;

    if (!refreshToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const result = await this.authService.refreshToken({
      refreshToken,
    });

    this.setRefreshCookie(result.refreshToken, response);
    return {
      message: 'Refresh token successful',
      data: {
        accessToken: result.accessToken,
        user: result.user,
      },
    };
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
