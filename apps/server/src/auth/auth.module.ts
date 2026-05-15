import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { SecurityModule } from 'src/security/security.module';
import { TokenService } from './token.service';
import { OtpMailService } from './otp-mail.service';
import { AuthOtpService } from './auth-otp.service';
import { AuthSessionService } from './auth-session.service';
import { AuthOtpSharedService } from './auth-otp-shared.service';
import { AuthSignupOtpService } from './auth-signup-otp.service';
import { AuthPasswordResetService } from './auth-password-reset.service';

@Module({
  imports: [JwtModule.register({}), SecurityModule, UsersModule],

  controllers: [AuthController],
  providers: [
    AuthService,
    AuthOtpService,
    AuthOtpSharedService,
    AuthSignupOtpService,
    AuthPasswordResetService,
    AuthSessionService,
    TokenService,
    OtpMailService,
  ],
})
export class AuthModule {}
