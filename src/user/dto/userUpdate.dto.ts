import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/userCreate.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
