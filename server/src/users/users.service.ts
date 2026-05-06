import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { GetProfileDto } from './dtos/get-profile.dto';
import { UserMapper } from './mappers/user.mapper';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { UserValidationService } from './user-validation.service';
import { PasswordService } from 'src/security/password.service';
import { ChangePasswordDto } from './dtos/change-password.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly userValidationService: UserValidationService,
    private readonly passwordService: PasswordService,
  ) {}

  async getUserProfile(dto: GetProfileDto) {
    let user = await this.userRepository.findById(dto.userId);

    user = this.userValidationService.validateActiveUser(user);

    return UserMapper.toUserResponse(user);
  }

  async updateUserProfile(dto: UpdateProfileDto) {
    let user = await this.userRepository.findById(dto.userId);

    user = this.userValidationService.validateActiveUser(user);

    const updatedUser = await this.userRepository.updateUser(dto.userId, {
      firstName: dto.firstName,
      lastName: dto.lastName,
      dateOfBirth: dto.dateOfBirth,
    });

    return UserMapper.toUserResponse(updatedUser);
  }

  async changePassword(dto: ChangePasswordDto) {
    let user = await this.userRepository.findById(dto.userId);
    user = this.userValidationService.validateActiveUser(user);

    const isValidPassword = await this.passwordService.verify(
      user.passwordHash,
      dto.oldPassword,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    await this.userRepository.updatePassword(user.id, dto.newPassword);
  }
}
