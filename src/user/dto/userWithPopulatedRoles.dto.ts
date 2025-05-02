import { Role } from 'src/role/role.entity';
import { User } from 'src/user/user.entity';

export interface UserWithPopulatedRolesDto extends Omit<User, 'roles'> {
  roles: Role[]; // Override roles to use Role[] instead of ObjectId[]
}
