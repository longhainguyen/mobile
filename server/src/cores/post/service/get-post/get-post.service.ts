import { LikeEntity, PostEntity, UserEntity } from '@entities/index';
import { IGetPost } from '@interfaces/post.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class GetPostService {
    constructor(
        @InjectRepository(UserEntity) private UserReposity: Repository<UserEntity>,
        @InjectRepository(PostEntity) private PostReposity: Repository<PostEntity>,
        @InjectRepository(LikeEntity) private LikeReposity: Repository<LikeEntity>,
    ) {}
    async getPosts(id: number, { limit = 10, page = 0 }: IGetPost, isByUserId: boolean = false) {
        const user = await this.UserReposity.findOneBy({ id });
        if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        const postOptions: FindManyOptions<PostEntity> = {
            select: ['id', 'caption', 'createdAt'],
            relations: [
                'images',
                'videos',
                'likes',
                'comments',
                'comments.childrens',
                'user.profile',
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
        };
        if (isByUserId) postOptions.where = { user: { id } };
        const posts = await this.PostReposity.find(postOptions);

        const filterPosts = await Promise.all(
            posts.map(async (post) => {
                const likeUser = await this.LikeReposity.findOne({ where: { userId: id, post: { id: post.id } } });
                const followUser = await this.UserReposity.findOne({
                    where: { id: id, followings: { id: post.user.id } },
                });

                const filterPost = {
                    ...post,
                    likeCount: post.likes.length,
                    commentCount:
                        post.comments.length + post.comments.reduce((acc, cur) => acc + cur.childrens.length, 0),
                    isLiked: !!likeUser,
                    isFollowed: !!followUser,
                };
                delete filterPost.comments;
                delete filterPost.likes;
                return filterPost;
            }),
        );

        return filterPosts;
    }
}
