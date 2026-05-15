import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class BlockArticleDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsUUID('4')
  articleId: string;
}
