import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Authenticated user ID. Set internally by the server.',
    example: '7ccce2c9-8fd1-4e1c-a4b7-236812f504d9',
    readOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Current password for verification.',
    example: 'Password@123',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  oldPassword: string;

  @ApiProperty({
    description: 'New password with uppercase, lowercase, number, and special character.',
    example: 'NewPassword@123',
    minLength: 8,
    maxLength: 32,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message:
      'Password must contain uppercase, lowercase, number, and special character',
  })
  newPassword: string;
}
