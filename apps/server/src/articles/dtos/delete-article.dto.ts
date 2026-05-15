import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class DeleteArticleDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsUUID('4')
  articleId: string;
}
