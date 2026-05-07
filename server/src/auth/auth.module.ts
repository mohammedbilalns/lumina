import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { SecurityModule } from 'src/security/security.module';
import { TokenService } from './token.service';
import { OtpMailService } from './otp-mail.service';

@Module({
  imports: [JwtModule.register({}), SecurityModule, UsersModule],

  controllers: [AuthController],
  providers: [AuthService, TokenService, OtpMailService],
})
export class AuthModule {}
