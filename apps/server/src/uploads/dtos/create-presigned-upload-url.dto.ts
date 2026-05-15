import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePresignedUploadUrlDto {
  @IsString()
  @IsNotEmpty()
  contentType: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  fileName?: string;
}
