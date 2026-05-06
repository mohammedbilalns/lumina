import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateArticleDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsUUID('4')
  articleId: string;

  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(255)
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(20)
  content?: string;

  @IsString()
  @IsOptional()
  featuredImage?: string;

  @IsUUID('4')
  @IsOptional()
  categoryId?: string;
}
