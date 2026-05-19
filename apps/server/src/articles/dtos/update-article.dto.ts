import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateArticleDto {
  @ApiProperty({
    description: 'Authenticated user ID. Set internally by the server.',
    example: '7ccce2c9-8fd1-4e1c-a4b7-236812f504d9',
    readOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Article UUID. Passed as a route parameter in public requests.',
    example: '55de50b8-27e6-44d0-a3ec-a851f6cb3659',
    format: 'uuid',
    readOnly: true,
  })
  @IsUUID('4')
  articleId: string;

  @ApiPropertyOptional({
    description: 'Updated article title.',
    example: 'Improving content hierarchy for long-form articles',
    minLength: 5,
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MinLength(5)
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    description: 'Updated article content.',
    example: 'An updated article body with clearer sections, examples, and structure...',
    minLength: 20,
  })
  @IsString()
  @IsOptional()
  @MinLength(20)
  content?: string;

  @ApiPropertyOptional({
    description: 'Updated featured image URL.',
    example: 'https://cdn.example.com/uploads/updated-feature-image.jpg',
  })
  @IsString()
  @IsOptional()
  featuredImage?: string;

  @ApiPropertyOptional({
    description: 'Updated category UUID.',
    example: '2a8cf78e-6b75-4cc0-b0f3-b0b59c7fd89e',
    format: 'uuid',
  })
  @IsUUID('4')
  @IsOptional()
  categoryId?: string;
}
