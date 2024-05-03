import { Module } from '@nestjs/common';
import { AuthController } from '@cores/auth/controller/auth.controller';
import { AuthService } from '@cores/auth/service/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@entities/user.entity';
import { ProfileEntity } from '@entities/profile.entity';
import { BcryptService } from '@shares/services/bcrypt/bcrypt.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfigOptions } from '@configs/jwt.config';
import { JwtStrategy } from '../strategy/access-token.strategy';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, ProfileEntity]), JwtModule.registerAsync(jwtConfigOptions)],
    controllers: [AuthController],
    providers: [AuthService, BcryptService, JwtStrategy],
    exports: [BcryptService],
})
export class AuthModule {}
