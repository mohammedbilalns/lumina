import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class LoginDto {
  @ValidateIf((o) => !o.phone)
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @ValidateIf((o) => !o.email)
  @IsPhoneNumber('IN')
  @IsNotEmpty()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
