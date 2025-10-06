import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty({ message: 'Username must not be empty' })
  @IsString({ message: 'Username must be a string' })
  username: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty({ message: 'Password must not be empty' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
