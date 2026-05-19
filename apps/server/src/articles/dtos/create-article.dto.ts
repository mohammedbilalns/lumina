import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({
    description: 'Authenticated user ID. Set internally by the server.',
    example: '7ccce2c9-8fd1-4e1c-a4b7-236812f504d9',
    readOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Article title.',
    example: 'How to design a clean reading experience',
    minLength: 5,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Full article content.',
    example: 'This article explains how to structure typography, spacing, and content hierarchy...',
    minLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  content: string;

  @ApiPropertyOptional({
    description: 'Optional featured image URL.',
    example: 'https://cdn.example.com/uploads/feature-image.jpg',
  })
  @IsString()
  @IsOptional()
  featuredImage?: string;

  @ApiProperty({
    description: 'Category UUID that the article belongs to.',
    example: '2a8cf78e-6b75-4cc0-b0f3-b0b59c7fd89e',
    format: 'uuid',
  })
  @IsUUID('4')
  categoryId: string;
}
