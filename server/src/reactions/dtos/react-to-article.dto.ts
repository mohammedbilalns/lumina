import { IsIn, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ReactToArticleDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsUUID('4')
  articleId: string;

  @IsIn(['LIKE', 'DISLIKE'])
  reactionType: 'LIKE' | 'DISLIKE';
}
