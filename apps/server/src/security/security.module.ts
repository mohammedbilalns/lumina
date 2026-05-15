import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './guards/jwt/jwt.guard';

@Module({
  imports: [JwtModule.register({})],
  providers: [PasswordService, JwtGuard],
  exports: [PasswordService, JwtGuard, JwtModule],
})
export class SecurityModule {}
