import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string; // User's name

  @IsString()
  @IsNotEmpty()
  lastName: string; // User's surname

  @IsString()
  username: string; // User's username

  @IsString()
  @Length(8, 20)
  @Matches(/\d/, { message: 'Password must contain at least one number' })
  password: string; // User's password
}
