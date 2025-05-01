import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/role/role.decorator';
import { RoleEnum } from 'src/role/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const userRoles = (user.role || []) as RoleEnum[];

    // if user is admin then allow all roles
    if (userRoles.includes(RoleEnum.Admin)) {
      return true;
    }

    const haveRole = requiredRoles.some((role) => userRoles?.includes(role));

    return haveRole;
  }
}
