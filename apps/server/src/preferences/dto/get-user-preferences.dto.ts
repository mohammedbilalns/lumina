import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserPreferencesDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
