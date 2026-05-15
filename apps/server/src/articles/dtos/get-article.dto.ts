import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class GetArticleDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsUUID('4')
  articleId: string;
}
