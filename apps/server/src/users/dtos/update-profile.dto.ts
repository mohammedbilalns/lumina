import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Authenticated user ID. Set internally by the server.',
    example: '7ccce2c9-8fd1-4e1c-a4b7-236812f504d9',
    readOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Updated first name. Letters and spaces only.',
    example: 'Jane',
    minLength: 2,
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'First name can only contain letters',
  })
  firstName: string;

  @ApiProperty({
    description: 'Updated last name. Letters and spaces only.',
    example: 'Doe',
    minLength: 2,
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Last name can only contain letters',
  })
  lastName: string;

  @ApiProperty({
    description: 'Date of birth in ISO 8601 format. User must remain at least 15 years old.',
    example: '2000-05-15',
    format: 'date',
  })
  @MinAge(15)
  @IsDateString()
  dateOfBirth: string;
}
