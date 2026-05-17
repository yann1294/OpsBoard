import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verifyToken } from '@clerk/backend';
import type { Request } from 'express';

type RequestWithUser = Request & {
  user?: unknown;
};

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const [scheme, token] = authorization.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Bearer token is missing');
    }

    const secretKey = this.configService.get<string>('CLERK_SECRET_KEY');
    if (!secretKey) {
      throw new UnauthorizedException('Token is invalid');
    }

    try {
      const payload = await verifyToken(token, { secretKey });
      if (!payload) {
        throw new UnauthorizedException('Token is invalid');
      }

      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token is invalid');
    }
  }
}
