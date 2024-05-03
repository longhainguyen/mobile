import { PostEntity } from '@entities/post.entity';
import { UserEntity } from '@entities/user.entity';
import { IGetPost } from '@interfaces/post.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GetPostService {
    constructor(
        @InjectRepository(UserEntity) private UserReposity: Repository<UserEntity>,
        @InjectRepository(PostEntity) private PostReposity: Repository<PostEntity>,
    ) {}
    async getPosts({ limit = 10, page = 0 }: IGetPost) {
        const posts = await this.PostReposity.find({
            select: ['id', 'caption', 'createdAt'],
            relations: [
                'images',
                'videos',
                'likes',
                'comments',
                'comments.childrens',
                'user.profile',
                'user.followers',
                'user.followings',
                'shareds',
                'origin',
                'origin.images',
                'origin.videos',
                'origin.user',
                'origin.user.profile',
            ],
            order: { createdAt: 'DESC' },
            skip: limit * page,
            take: limit,
        });

        // const count = await this.PostReposity.createQueryBuilder('posts')
        //     .leftJoin('posts.likes', 'likes')
        //     .select('posts.id', 'id')
        //     .addSelect('COUNT(likes.postId)', 'likeCount')
        //     .groupBy('id')
        //     .skip(limit * page)
        //     .limit(limit)
        //     .getRawMany();

        return posts.map((post) => {
            const filterPost = {
                ...post,
                likeCount: post.likes.length,
                commentCount: post.comments.length + post.comments.reduce((acc, cur) => acc + cur.childrens.length, 0),
            };
            delete filterPost.comments;
            delete filterPost.likes;
            return filterPost;
        });
    }

    async getPostByUserId(userId: number, { limit = 5, page = 0 }: IGetPost) {
        const user = await this.UserReposity.findOneBy({ id: userId });
        if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        const posts = await this.PostReposity.find({
            select: ['id', 'caption', 'createdAt'],
            relations: [
                'images',
                'videos',
                'likes',
                'comments',
                'comments.childrens',
                'user.profile',
                'user.followers',
                'user.followings',
                'shareds',
                'origin',
                'origin.images',
                'origin.videos',
            ],
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
            skip: limit * page,
            take: limit,
        });
        return posts.map((post) => {
            const filterPost = {
                ...post,
                likeCount: post.likes.length,
                commentCount: post.comments.length + post.comments.reduce((acc, cur) => acc + cur.childrens.length, 0),
            };
            delete filterPost.comments;
            delete filterPost.likes;
            return filterPost;
        });
    }
}
