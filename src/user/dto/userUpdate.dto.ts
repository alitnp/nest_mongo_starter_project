import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './userCreate.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
