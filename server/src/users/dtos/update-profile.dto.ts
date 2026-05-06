import {
  IsDateString,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'First name can only contain letters',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Last name can only contain letters',
  })
  lastName: string;

  @IsDateString()
  dateOfBirth: string;
}
