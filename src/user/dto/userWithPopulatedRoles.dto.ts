import { Role } from 'src/role/role.schema';
import { User } from 'src/user/user.schema';

export interface UserWithPopulatedRolesDto extends Omit<User, 'roles'> {
  roles: Role[]; // Override roles to use Role[] instead of ObjectId[]
}
