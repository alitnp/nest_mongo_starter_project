import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/common/services/baseService';
import { RoleDescriptions, RoleEnum } from 'src/role/role.enum';
import { Role } from 'src/role/role.schema';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService
  extends BaseService<Role, CreateRoleDto, UpdateRoleDto>
  implements OnApplicationBootstrap
{
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {
    super(roleModel, 'title');
  }

  async onApplicationBootstrap() {
    await this.ensureRolesExist();
  }

  private async ensureRolesExist() {
    const roles = Object.values(RoleEnum); // Get all roles from RoleEnum

    for (const roleTitle of roles) {
      const existingRole = await this.roleModel.findOne({ title: roleTitle });
      if (!existingRole) {
        await this.roleModel.create({
          title: roleTitle,
          description: RoleDescriptions[roleTitle],
        });
        console.log(`Role "${roleTitle}" created.`);
      }
    }
  }
}
