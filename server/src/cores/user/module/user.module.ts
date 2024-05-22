import { ProfileEntity, PostEntity, UserEntity } from '@entities/index';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '../controllers/user/user.controller';
import { ProfileController } from '../controllers/profile/profile.controller';
import { UserService } from '../service/user/user.service';
import { ProfileService } from '../service/profile/profile.service';
import { AuthModule } from '@cores/auth/module/auth.module';
import { CloudinaryModule } from '@shares/modules/cloudinary/cloudinary.module';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, ProfileEntity, PostEntity]), AuthModule, CloudinaryModule],
    controllers: [UserController, ProfileController],
    providers: [UserService, ProfileService],
})
export class UserModule {}
