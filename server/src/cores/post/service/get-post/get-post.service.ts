import { SearchDefault } from '@constants/enums/default.enum';
import { CommentEntity, LikeEntity, PostEntity, UserEntity } from '@entities/index';
import { IGetPost } from '@interfaces/post.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Like, Repository } from 'typeorm';

@Injectable()
export class GetPostService {
    constructor(
        @InjectRepository(UserEntity) private UserReposity: Repository<UserEntity>,
        @InjectRepository(PostEntity) private PostReposity: Repository<PostEntity>,
        @InjectRepository(LikeEntity) private LikeReposity: Repository<LikeEntity>,
        @InjectRepository(CommentEntity) private CommentReposity: Repository<CommentEntity>,
    ) {}

    public basePostOptions: FindManyOptions<PostEntity> = {
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
    };

    public baseUserOptions: FindManyOptions<UserEntity> = {
        select: ['id', 'username'],
        relations: ['profile'],
    };

    async filterPosts(posts: PostEntity[], userId: number) {
        return Promise.all(
            posts.map(async (post) => {
                const likeUser = await this.LikeReposity.findOne({ where: { userId, post: { id: post.id } } });
                const followUser = await this.UserReposity.findOne({
                    where: { id: userId, followings: { id: post.user.id } },
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
    }

    async getPosts(
        userId: number,
        { limit = SearchDefault.LIMIT, page = SearchDefault.PAGE }: IGetPost,
        isByUserId: boolean = false,
        id?: number,
    ) {
        const user = await this.UserReposity.findOneBy({ id });
        if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        const postOptions: FindManyOptions<PostEntity> = {
            ...this.basePostOptions,
            order: { createdAt: 'DESC' },
            skip: limit * page,
            take: limit,
        };
        if (isByUserId) postOptions.where = { user: { id } };
        const posts = await this.PostReposity.find(postOptions);

        return this.filterPosts(posts, userId);
    }

    async getSinglePost(userId: number, postId: number) {
        const post = await this.PostReposity.findOne({
            ...this.basePostOptions,
            where: { id: postId },
        });
        if (!post) throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
        const filterPost = await this.filterPosts([{ ...post }], userId);
        return filterPost[0] || {};
    }

    async getPostsByKeyWord(
        id: number,
        keyword: string,
        { limit = SearchDefault.LIMIT, page = SearchDefault.PAGE }: IGetPost,
    ) {
        const userOptions: FindManyOptions<UserEntity> = {
            ...this.baseUserOptions,
            order: { username: 'ASC' },
            skip: limit * page,
            take: limit,
            where: { username: Like(`%${keyword}%`) },
        };
        const postOptions: FindManyOptions<PostEntity> = {
            ...this.basePostOptions,
            order: { createdAt: 'DESC' },
            skip: limit * page,
            take: limit,
            where: { caption: Like(`%${keyword}%`) },
        };
        const posts = await this.PostReposity.find(postOptions);
        const users = await this.UserReposity.find(userOptions);
        const filterPosts = await this.filterPosts(posts, id);
        return { users, posts: filterPosts };
    }

    async getComments(postId: number, { limit = SearchDefault.LIMIT, page = SearchDefault.PAGE }: IGetPost) {
        const post = await this.PostReposity.findOneBy({ id: postId });
        if (!post) throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
        const comments = await this.CommentReposity.find({
            select: ['id', 'content', 'createdAt'],
            where: { post: { id: postId } },
            relations: ['user.profile', 'childrens.user.profile'],
            order: { createdAt: 'DESC' },
            skip: limit * page,
            take: limit,
        });
        return comments;
    }
}
