import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { configuration } from 'src/common/config/configuration';
import { compareHash } from 'src/common/utils/bcrypt';
import {
  SuccessResponse,
  SuccessResponseData,
} from 'src/common/utils/responseStandardizer';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    password: string,
  ): Promise<SuccessResponseData<User & { access_token: string }>> {
    const userResponse = await this.userService.findByUserName(username);
    const user = userResponse.data;
    if (!user) {
      throw new BadRequestException('User not found');
    }
    // Here you would normally check the password
    const isMatched = await compareHash(password, user.password);
    if (!isMatched) {
      throw new BadRequestException('Invalid password');
    }

    if (!user.roles) user.roles = [];
    const payload = {
      username: user.username,
      sub: user._id,
      role: user.roles.map((role) => role.title),
    };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
      secret: configuration().jwt.secret,
    });

    const resultUser = await this.userService.findOne(user._id);
    return SuccessResponse.data({
      ...resultUser.data,
      access_token: token,
    });
  }
}
