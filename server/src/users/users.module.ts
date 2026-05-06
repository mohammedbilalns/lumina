import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UserValidationService } from './user-validation.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UserValidationService],
  exports: [UsersRepository, UserValidationService],
})
export class UsersModule {}
