import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/auth/auth.decorator';
import { configuration } from 'src/common/config/configuration';

export interface requestUser {
  id: number;
  email: string;
  roles: string[];
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    // If the route is not public, we need to check the JWT token

    // Get the request object from the context
    const request = context.switchToHttp().getRequest();

    // Extract the token from the request headers
    const token = this.extractTokenFromHeader(request);

    // If the token is not present, throw an UnauthorizedException
    if (!token) {
      throw new UnauthorizedException();
    }

    // Verify the token using the JWT service
    try {
      // 💡 The secret used to sign the JWT should be the same as the one used to verify it
      const payload = (await this.jwtService.verifyAsync(token, {
        secret: configuration().jwt.secret,
      })) as requestUser;
      // Attach the user information to the request object
      request['user'] = payload;
    } catch {
      // If the token is invalid or expired, throw an UnauthorizedException
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
