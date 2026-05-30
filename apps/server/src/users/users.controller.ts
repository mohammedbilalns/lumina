import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { UserProfile } from '@lumina/shared-types';
import type { SuccessResponse } from 'src/common/types/api-response.type';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/security/guards/jwt/jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { type JwtPayload } from 'src/auth/types/jwt-payload.type';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { UserResponseMessages } from './constants/response-messages';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Get profile',
    description: 'Returns the authenticated user profile.',
  })
  async getUserProfile(
    @CurrentUser()
    user: JwtPayload,
  ): Promise<SuccessResponse<{ user: UserProfile }>> {
    const result = await this.usersService.getUserProfile({
      userId: user.sub,
    });

    return {
      message: UserResponseMessages.FETCHED_PROFILE,
      data: {
        user: result.user,
      },
    };
  }

  @Post('profile')
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Update profile',
    description:
      'Updates first name, last name, and date of birth for the authenticated user.',
  })
  @ApiBody({ type: UpdateProfileDto })
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
      message: UserResponseMessages.UPDATED_PROFILE,
      data: {
        user: result.user,
      },
    };
  }

  @Post('change-password')
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Change password',
    description:
      'Changes the authenticated user password using the current password for verification.',
  })
  @ApiBody({ type: ChangePasswordDto })
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
      message: UserResponseMessages.UPDATED_PASSWORD,
    };
  }
}
