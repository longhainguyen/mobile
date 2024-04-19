import { Module } from '@nestjs/common';
import { PostService } from '../service/post.service';
import { PostController } from '../controller/post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '@entities/post.entity';
import { UserEntity } from '@entities/user.entity';

@Module({
    providers: [PostService],
    controllers: [PostController],
    imports: [TypeOrmModule.forFeature([PostEntity, UserEntity])],
})
export class PostModule {}
