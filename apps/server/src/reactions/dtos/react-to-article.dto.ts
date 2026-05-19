import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ReactToArticleDto {
  @ApiProperty({
    description: 'Authenticated user ID. Set internally by the server.',
    example: '7ccce2c9-8fd1-4e1c-a4b7-236812f504d9',
    readOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Article UUID being reacted to.',
    example: '55de50b8-27e6-44d0-a3ec-a851f6cb3659',
    format: 'uuid',
  })
  @IsUUID('4')
  articleId: string;

  @ApiProperty({
    description: 'Reaction to apply to the article.',
    enum: ['LIKE', 'DISLIKE'],
    example: 'LIKE',
  })
  @IsIn(['LIKE', 'DISLIKE'])
  reactionType: 'LIKE' | 'DISLIKE';
}
