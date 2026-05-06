import { Injectable, NotFoundException } from '@nestjs/common';
import { PreferencesRepository } from './preferences.repository';
import { GetUserPreferencesDto } from './dto/get-user-preferences.dto';
import { UserPreferencesMapper } from './mappers/user-preferences.mapper';
import { UsersRepository } from 'src/users/users.repository';
import { UserValidationService } from 'src/users/user-validation.service';
import { SaveUserPreferencesDto } from './dto/save-user-preferences.dto';

@Injectable()
export class PreferencesService {
  constructor(
    private readonly preferencesRepository: PreferencesRepository,
    private readonly userRepository: UsersRepository,
    private readonly userValidationService: UserValidationService,
  ) {}

  async getUserPreferences(dto: GetUserPreferencesDto) {
    const preferences = await this.preferencesRepository.fetchUserPreferences(
      dto.userId,
    );

    if (!preferences) {
      throw new NotFoundException('User preferences not found');
    }

    return { preferences: UserPreferencesMapper.toResponse(preferences) };
  }

  async saveUserPreferences(dto: SaveUserPreferencesDto) {
    const user = await this.userRepository.findById(dto.userId);
    this.userValidationService.validateActiveUser(user);

    await this.preferencesRepository.saveUserPreferences(
      dto.userId,
      dto.categoryids,
    );
  }
}
