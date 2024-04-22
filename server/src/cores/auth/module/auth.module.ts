import { Module } from '@nestjs/common';
import { AuthController } from '@cores/auth/controller/auth.controller';
import { AuthService } from '@cores/auth/service/auth.service';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@entities/user.entity';
import { ProfileEntity } from '@entities/profile.entity';
import { BcryptService } from '@shares/services/bcrypt/bcrypt.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, ProfileEntity])],
    controllers: [AuthController],
    providers: [AuthService, BcryptService],
    exports: [BcryptService],
})
export class AuthModule {}
