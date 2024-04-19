import { PostEntity } from '@entities/post.entity';
import { UserEntity } from '@entities/user.entity';
import { ICreatePost } from '@interfaces/user.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(UserEntity) private UserReposity: Repository<UserEntity>,
        @InjectRepository(PostEntity) private PostReposity: Repository<PostEntity>,
    ) {}
    async createPost(id: number, post: ICreatePost) {
        const user = await this.UserReposity.findOneBy({ id });
        if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        const newPost = this.PostReposity.create({ ...post, user });
        const savedPost = await this.PostReposity.save(newPost);
        return savedPost;
    }
}
