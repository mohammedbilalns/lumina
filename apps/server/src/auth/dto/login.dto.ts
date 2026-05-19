import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email address or phone number used to log in.',
    example: 'jane@example.com',
  })
  @IsString()
  @IsNotEmpty()
  credential: string;

  @ApiProperty({
    description: 'Account password. Minimum 8 characters.',
    example: 'Password@123',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
