import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class UserAddRoleDto {
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  roleId: string; // Role ID to be added to the user

  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  userId: string; // User ID to which the role will be added
}
