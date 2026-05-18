import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import type { UserProfile } from '@lumina/shared-types';
import type { SuccessResponse } from 'src/common/types/api-response.type';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/security/guards/jwt/jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { type JwtPayload } from 'src/auth/types/jwt-payload.type';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtGuard)
  async getUserProfile(
    @CurrentUser()
    user: JwtPayload,
  ): Promise<SuccessResponse<{ user: UserProfile }>> {
    const result = await this.usersService.getUserProfile({
      userId: user.sub,
    });

    return {
      message: 'User profile fetched successfully',
      data: {
        user: result.user,
      },
    };
  }

  @Post('profile')
  @UseGuards(JwtGuard)
  async updateUserProfile(
    @CurrentUser()
    user: JwtPayload,

    @Body()
    data: Omit<UpdateProfileDto, 'userId'>,
  ): Promise<SuccessResponse<{ user: UserProfile }>> {
    const result = await this.usersService.updateUserProfile({
      userId: user.sub,
      ...data,
    });

    return {
      message: 'User profile updated successfully',
      data: {
        user: result.user,
      },
    };
  }

  @Post('change-password')
  @UseGuards(JwtGuard)
  async changePassword(
    @CurrentUser()
    user: JwtPayload,

    @Body()
    data: Omit<ChangePasswordDto, 'userId'>,
  ): Promise<SuccessResponse<void>> {
    await this.usersService.changePassword({
      userId: user.sub,
      ...data,
    });
    return {
      message: 'Password changed successfully',
    };
  }
}
