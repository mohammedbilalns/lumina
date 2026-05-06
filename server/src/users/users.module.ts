import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UserValidationService } from './user-validation.service';
import { SecurityModule } from 'src/security/security.module';

@Module({
  imports: [ SecurityModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UserValidationService],
  exports: [UsersRepository, UserValidationService],
})
export class UsersModule {}
