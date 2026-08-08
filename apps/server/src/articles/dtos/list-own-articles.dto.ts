import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class ListOwnArticlesDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsInt()
  @Min(1)
  page: number;

  @IsInt()
  @IsIn([10, 20, 30])
  limit: number;

  @IsString()
  @IsOptional()
  categoryId: string;
}
