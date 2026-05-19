import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class SaveUserPreferencesDto {
  @ApiProperty({
    description: 'Authenticated user ID. Set internally by the server.',
    example: '7ccce2c9-8fd1-4e1c-a4b7-236812f504d9',
    readOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'List of category UUIDs selected by the user.',
    example: [
      '2a8cf78e-6b75-4cc0-b0f3-b0b59c7fd89e',
      'b4e9e286-146e-4970-8357-d4ff74055d1d',
    ],
    type: [String],
    format: 'uuid',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', {
    each: true,
  })
  categoryids: string[];
}
