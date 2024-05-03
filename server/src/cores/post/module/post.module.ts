import { Module } from '@nestjs/common';
import { PostService } from '../service/post.service';
import { PostController } from '../controller/post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity, CommentEntity, ImageEntity, LikeEntity, UserEntity, VideoEntity } from '@entities/index';
import { CloudinaryModule } from '@shares/modules/cloudinary/cloudinary.module';
import { EditPostService } from '../service/edit-post/edit-post.service';
import { InteractPostService } from '../service/interact-post/interact-post.service';
import { GetPostService } from '../service/get-post/get-post.service';

@Module({
    providers: [PostService, EditPostService, InteractPostService, GetPostService],
    controllers: [PostController],
    imports: [
        TypeOrmModule.forFeature([PostEntity, UserEntity, ImageEntity, VideoEntity, LikeEntity, CommentEntity]),
        CloudinaryModule,
    ],
})
export class PostModule {}
