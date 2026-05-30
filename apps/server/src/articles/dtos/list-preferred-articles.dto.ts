import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class ListPreferredArticlesDto {
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
  search?: string;
}
