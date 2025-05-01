import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { BaseService } from 'src/common/services/baseService';
import { getHash } from 'src/common/utils/bcrypt';
import {
  SuccessResponse,
  SuccessResponseData,
} from 'src/common/utils/responseStandardizer';
import { RoleService } from 'src/role/role.service';
import { UpdateUserDto } from 'src/user/dto/userUpdate.dto';
import { UserWithPopulatedRolesDto } from 'src/user/dto/userWithPopulatedRoles.dto';
import { User } from 'src/user/user.schema';
import { CreateUserDto } from './dto/userCreate.dto';

@Injectable()
export class UserService extends BaseService<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly roleService: RoleService,
  ) {
    super(userModel, ['username'], '-password', 'roles');
  }

  async findByUserName(
    username: string,
  ): Promise<SuccessResponseData<UserWithPopulatedRolesDto>> {
    const user = await this.userModel
      .findOne({
        username,
      })
      .populate<{
        roles: UserWithPopulatedRolesDto['roles'];
      }>('roles');
    if (!user) {
      throw new NotFoundException(`User not found`);
    }
    return SuccessResponse.data<UserWithPopulatedRolesDto>(user);
  }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<SuccessResponseData<User>> {
    const user = new this.userModel();
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.username = createUserDto.username;
    user.password = await getHash(createUserDto.password);
    user.roles = [];

    await user.save();
    return await this.findOne(user._id);
  }

  async addRole(
    _id: string,
    roleId: string,
  ): Promise<SuccessResponseData<User>> {
    const user = await this.userModel.findById(_id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const role = await this.roleService.findOne(roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Check if the role already exists in the user's roles
    if (user.roles.includes(new ObjectId(roleId))) {
      throw new BadRequestException('Role already exists in user roles');
    }

    user.roles.push(new ObjectId(roleId));
    await user.save();

    return await this.findOne(user._id);
  }

  async removeRole(
    _id: string,
    roleId: string,
  ): Promise<SuccessResponseData<User>> {
    const user = await this.userModel.findById(_id);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const roleIndex = user.roles.indexOf(new ObjectId(roleId));
    if (roleIndex === -1) {
      throw new BadRequestException('Role not found in user roles');
    }

    user.roles.splice(roleIndex, 1);
    await user.save();

    return await this.findOne(user._id);
  }
}
