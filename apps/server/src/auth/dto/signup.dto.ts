import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { MinAge } from 'src/common/decorators/min-age.decorator';

export class SignupDto {
  @ApiProperty({
    description: 'User first name. Letters and spaces only.',
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
    description: 'User last name. Letters and spaces only.',
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
    description: 'Unique email address for the account.',
    example: 'jane@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Indian phone number in E.164 or local valid IN format.',
    example: '+919876543210',
  })
  @IsNotEmpty()
  @IsPhoneNumber('IN')
  phone: string;

  @ApiProperty({
    description:
      'Date of birth in ISO 8601 format. User must be at least 15 years old.',
    example: '2000-05-15',
    format: 'date',
  })
  @IsNotEmpty()
  @MinAge(15)
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({
    description:
      'Password with uppercase, lowercase, number, and special character.',
    example: 'Password@123',
    minLength: 8,
    maxLength: 32,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message:
      'Password must contain uppercase, lowercase, number, and special character',
  })
  password: string;
}
