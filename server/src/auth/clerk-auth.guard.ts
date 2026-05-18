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

    const authorizedParties = this.getAuthorizedParties();

    try {
      const payload = await verifyToken(token, {
        secretKey,
        ...(authorizedParties.length > 0 ? { authorizedParties } : {}),
      });
      if (!payload) {
        throw new UnauthorizedException('Token is invalid');
      }

      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token is invalid');
    }
  }

  private getAuthorizedParties(): string[] {
    const explicitAuthorizedParties = this.configService.get<string>(
      'CLERK_AUTHORIZED_PARTIES',
    );

    if (explicitAuthorizedParties) {
      return explicitAuthorizedParties
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);
    }

    const clientUrl = this.configService.get<string>('CLIENT_URL');
    if (!clientUrl) {
      return [];
    }

    return [clientUrl];
  }
}
