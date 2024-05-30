import { CanActivate, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';

@Injectable()
export class GatewayGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}
    async canActivate(context: any): Promise<boolean> {
        const token = context?.args[0]?.handshake?.headers?.authorization.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            context.args[0].user = payload;
        } catch (error) {
            if (error instanceof TokenExpiredError) throw new UnauthorizedException({ message: 'Token expired' });
            throw new UnauthorizedException({ message: 'Invalid token' });
        }
        return true;
    }
}
