import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class GetArticleDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  userId?: string;

  @IsUUID('4')
  articleId: string;
}
