import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const jwtConfigOptions: JwtModuleAsyncOptions = {
    useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '365d' },
    }),
    global: true,
};
