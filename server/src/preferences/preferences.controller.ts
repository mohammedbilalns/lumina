import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import {type JwtPayload } from 'src/auth/types/jwt-payload.type';
import { JwtGuard } from 'src/security/guards/jwt/jwt.guard';
import { PreferencesService } from './preferences.service';
import { SaveUserPreferencesDto } from './dto/save-user-preferences.dto';

@Controller('preferences')
export class PreferencesController {

  constructor(
    private readonly preferencesService: PreferencesService,
  ){}


  @Get()
  @UseGuards(JwtGuard)
  async getUserPreferences(
    @CurrentUser()
    user: JwtPayload,
  ) {
    const result = await this.preferencesService.getUserPreferences({
      userId: user.sub,
    })

    return {
      message: 'User preferences fetched successfully',
      data: {
        preferences: result.preferences
      }
    }

  }

  @Post()
  @UseGuards(JwtGuard)
  async saveUserPreferences(
    @CurrentUser()
    user: JwtPayload,

    @Body()
    data : Omit<SaveUserPreferencesDto , "userId">
  ){
    await this.preferencesService.saveUserPreferences({
      userId: user.sub,
      categoryids: data.categoryids
    })
  }
}
