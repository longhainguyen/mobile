import { Module } from '@nestjs/common';
import { PostService } from '../service/post.service';
import { PostController } from '../controller/post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '@entities/post.entity';
import { UserEntity } from '@entities/user.entity';
import { VideoEntity } from '@entities/video.entity';
import { ImageEntity } from '@entities/image.entity';
import { CloudinaryModule } from '@shares/modules/cloudinary/cloudinary.module';

@Module({
    providers: [PostService],
    controllers: [PostController],
    imports: [TypeOrmModule.forFeature([PostEntity, UserEntity, ImageEntity, VideoEntity]), CloudinaryModule],
})
export class PostModule {}
