import {
  IsDateString,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MinAge } from 'src/common/decorators/min-age.decorator';

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

  @MinAge(15)
  @IsDateString()
  dateOfBirth: string;
}
