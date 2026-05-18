import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import type {
  PreferencesStatus,
  UserPreference,
} from '@lumina/shared-types';
import type { SuccessResponse } from 'src/common/types/api-response.type';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { type JwtPayload } from 'src/auth/types/jwt-payload.type';
import { JwtGuard } from 'src/security/guards/jwt/jwt.guard';
import { PreferencesService } from './preferences.service';
import { SaveUserPreferencesDto } from './dto/save-user-preferences.dto';

@Controller('preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getUserPreferences(
    @CurrentUser()
    user: JwtPayload,
  ): Promise<SuccessResponse<{ preferences: UserPreference[] }>> {
    const result = await this.preferencesService.getUserPreferences({
      userId: user.sub,
    });

    return {
      message: 'User preferences fetched successfully',
      data: {
        preferences: result.preferences,
      },
    };
  }

  @Get('status')
  @UseGuards(JwtGuard)
  async checkPreferencesStatus(
    @CurrentUser()
    user: JwtPayload,
  ): Promise<SuccessResponse<PreferencesStatus>> {
    const isConfigured = await this.preferencesService.checkPreferencesStatus(user.sub);
    return {
      message: 'Preferences status fetched successfully',
      data: {
        isConfigured,
      },
    };
  }

  @Post()
  @UseGuards(JwtGuard)
  async saveUserPreferences(
    @CurrentUser()
    user: JwtPayload,

    @Body()
    data: Omit<SaveUserPreferencesDto, 'userId'>,
  ): Promise<void> {
    await this.preferencesService.saveUserPreferences({
      userId: user.sub,
      categoryids: data.categoryids,
    });
  }
}
