import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const jwtConfigOptions: JwtModuleAsyncOptions = {
    useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '30s' },
    }),
    global: true,
};
