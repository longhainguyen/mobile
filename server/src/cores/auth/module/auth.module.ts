import { Module } from '@nestjs/common';
import { AuthController } from '@cores/auth/controller/auth.controller';
import { AuthService } from '@cores/auth/service/auth.service';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
