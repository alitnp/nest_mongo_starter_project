import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { Public } from 'src/auth/auth.decorator';
import { Roles } from 'src/role/role.decorator';
import { RoleEnum } from 'src/role/role.enum';
import { UserAddRoleDto } from 'src/user/dto/userAddRole.dto';
import { CreateUserDto } from 'src/user/dto/userCreate.dto';
import { UserRemoveRoleDto } from 'src/user/dto/userRemoveRole.dto';
import { UpdateUserDto } from 'src/user/dto/userUpdate.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Controller({
  path: 'user',
  version: '1',
})
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  @ApiCreatedResponse({
    type: User,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Roles(RoleEnum.Admin)
  @Post('addRole')
  addRole(@Body() addRole: UserAddRoleDto) {
    return this.userService.addRole(addRole.userId, addRole.roleId);
  }

  @Roles(RoleEnum.Admin)
  @Post('removeRole')
  removeRole(@Body() removeRole: UserRemoveRoleDto) {
    return this.userService.removeRole(removeRole.userId, removeRole.roleId);
  }
}
