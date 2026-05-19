import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type {
  AuthResponse,
  OtpResponse,
} from '@lumina/shared-types';
import type { SuccessResponse } from 'src/common/types/api-response.type';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import type { Request } from 'express';
import { JwtGuard } from '../security/guards/jwt/jwt.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { type JwtPayload } from './types/jwt-payload.type';
import { VerifySignupOtpDto } from './dto/verify-signup-otp.dto';
import { ResendSignupOtpDto } from './dto/resend-signup-otp.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResendForgotPasswordOtpDto } from './dto/resend-forgot-password-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthResponseMessages } from './constants/ResponseMessages';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  @ApiOperation({
    summary: 'Start signup',
    description: 'Creates a pending signup and sends a 6-digit OTP to the provided email address.',
  })
  @ApiBody({ type: SignupDto })
  async signup(
    @Body() data: SignupDto,
  ): Promise<SuccessResponse<OtpResponse>> {
    const result = await this.authService.signup(data);

    return {
      message: AuthResponseMessages.OTP_SENT,
      data: result,
    };
  }

  @Post('signup/verify-otp')
  @ApiOperation({
    summary: 'Verify signup OTP',
    description: 'Validates the email OTP and returns access and refresh tokens for the new account.',
  })
  @ApiBody({ type: VerifySignupOtpDto })
  async verifySignupOtp(
    @Body() data: VerifySignupOtpDto,
  ): Promise<SuccessResponse<AuthResponse>> {
    const result = await this.authService.verifySignupOtp(data);

    return {
      message: AuthResponseMessages.SIGNUP_SUCCESS,
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      },
    };
  }

  @Post('signup/resend-otp')
  @ApiOperation({
    summary: 'Resend signup OTP',
    description: 'Sends a fresh signup OTP to the email address used during registration.',
  })
  @ApiBody({ type: ResendSignupOtpDto })
  async resendSignupOtp(
    @Body() data: ResendSignupOtpDto,
  ): Promise<SuccessResponse<OtpResponse>> {
    const result = await this.authService.resendSignupOtp(data);

    return {
      message: AuthResponseMessages.OTP_RESENT,
      data: result,
    };
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Request password reset OTP',
    description: 'Sends a 6-digit OTP to the email address for password reset.',
  })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(
    @Body() data: ForgotPasswordDto,
  ): Promise<SuccessResponse<OtpResponse>> {
    const result = await this.authService.forgotPassword(data);

    return {
      message: AuthResponseMessages.OTP_SENT,
      data: result,
    };
  }

  @Post('forgot-password/resend-otp')
  @ApiOperation({
    summary: 'Resend password reset OTP',
    description: 'Sends a new password reset OTP to the provided email address.',
  })
  @ApiBody({ type: ResendForgotPasswordOtpDto })
  async resendForgotPasswordOtp(
    @Body() data: ResendForgotPasswordOtpDto,
  ): Promise<SuccessResponse<OtpResponse>> {
    const result = await this.authService.resendForgotPasswordOtp(data);

    return {
      message: AuthResponseMessages.OTP_RESENT,
      data: result,
    };
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset password',
    description: 'Resets the account password using the email address, OTP, and a new password.',
  })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(
    @Body() data: ResetPasswordDto,
  ): Promise<SuccessResponse<void>> {
    await this.authService.resetPassword(data);

    return {
      message: AuthResponseMessages.PASSWORD_RESET_SUCCESS,
    };
  }

  @Post('login')
  @ApiOperation({
    summary: 'Sign in',
    description: 'Authenticates a user with email or phone plus password.',
  })
  @ApiBody({ type: LoginDto })
  async login(
    @Body() data: LoginDto,
  ): Promise<SuccessResponse<AuthResponse>> {
    const result = await this.authService.login(data);

    return {
      message: AuthResponseMessages.SIGNED_IN,
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      },
    };
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Log out',
    description: 'Invalidates the authenticated user session.',
  })
  async logout(
    @CurrentUser()
    user: JwtPayload,
  ): Promise<SuccessResponse<void>> {
    await this.authService.logout({
      userId: user.sub,
    });

    return { message: AuthResponseMessages.LOGGED_OUT };
  }

  @Post('refresh-token')
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Issues a new access token and refresh token. Swagger documents the body form, but the refresh token may also be read from the refreshToken cookie.',
  })
  @ApiCookieAuth('refreshToken')
  @ApiBody({ type: RefreshTokenDto, required: false })
  async refreshToken(
    @Req()
    request: Request,
    @Body()
    body?: RefreshTokenDto,
  ): Promise<SuccessResponse<AuthResponse>> {
    const refreshToken =
      body?.refreshToken ||
      (request.cookies['refreshToken'] as string | undefined);

    if (!refreshToken) {
      throw new UnauthorizedException('Invalid token');
    }

    const result = await this.authService.refreshToken({
      refreshToken,
    });

    return {
      message: AuthResponseMessages.REFRESH_TOKEN_SUCCESS,
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      },
    };
  }
}
