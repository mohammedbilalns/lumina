import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { type JwtPayload } from 'src/auth/types/jwt-payload.type';
import { JwtGuard } from 'src/security/guards/jwt/jwt.guard';
import { CreatePresignedUploadUrlDto } from './dtos/create-presigned-upload-url.dto';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('presigned-url')
  @UseGuards(JwtGuard)
  async createPresignedUrl(
    @CurrentUser()
    user: JwtPayload,

    @Body()
    data: CreatePresignedUploadUrlDto,
  ) {
    const result = await this.uploadsService.createPresignedUploadUrl(
      user.sub,
      data,
    );

    return {
      message: 'Presigned upload URL generated successfully',
      data: result,
    };
  }
}
