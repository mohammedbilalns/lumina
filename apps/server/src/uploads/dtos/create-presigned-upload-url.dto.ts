import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePresignedUploadUrlDto {
  @ApiProperty({
    description: 'MIME type of the file being uploaded.',
    example: 'image/jpeg',
  })
  @IsString()
  @IsNotEmpty()
  contentType: string;

  @ApiPropertyOptional({
    description: 'Original client file name.',
    example: 'cover-photo.jpg',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  fileName?: string;
}
