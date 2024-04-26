import { Module } from '@nestjs/common';
import { PostService } from '../service/post.service';
import { PostController } from '../controller/post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity, CommentEntity, ImageEntity, LikeEntity, UserEntity, VideoEntity } from '@entities/index';
import { CloudinaryModule } from '@shares/modules/cloudinary/cloudinary.module';

@Module({
    providers: [PostService],
    controllers: [PostController],
    imports: [
        TypeOrmModule.forFeature([PostEntity, UserEntity, ImageEntity, VideoEntity, LikeEntity, CommentEntity]),
        CloudinaryModule,
    ],
})
export class PostModule {}
