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

  async checkPreferencesStatus(userId: string): Promise<boolean> {
    const [, preferences] = await Promise.all([
      this.userValidationService.validateActiveUserId(userId),
      this.preferencesRepository.fetchUserPreferences(userId),
    ]);
    return !!preferences && preferences.length > 0;
  }

  async saveUserPreferences(dto: SaveUserPreferencesDto) {
    await this.userValidationService.validateActiveUserId(dto.userId);

    await this.preferencesRepository.saveUserPreferences(
      dto.userId,
      dto.categoryids,
    );
  }
}
