import { CommentType } from '@constants/enums/comment.enum';
import { CommentEntity, ImageEntity, LikeEntity, PostEntity, UserEntity, VideoEntity } from '@entities/index';
import { ICommentPost, IGetPost, ILikePost, ISharePost, IUpdateCommentPost } from '@interfaces/post.interface';
import { ICreateFormDataPost } from '@interfaces/user.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from '@shares/modules/cloudinary/cloudinary.service';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(UserEntity) private UserReposity: Repository<UserEntity>,
        @InjectRepository(PostEntity) private PostReposity: Repository<PostEntity>,
        @InjectRepository(ImageEntity) private ImageReposity: Repository<ImageEntity>,
        @InjectRepository(VideoEntity) private VideoReposity: Repository<VideoEntity>,
        @InjectRepository(LikeEntity) private LikeReposity: Repository<LikeEntity>,
        @InjectRepository(CommentEntity) private CommentReposity: Repository<CommentEntity>,
        private readonly CloudinaryService: CloudinaryService,
    ) {}

    async createPost(id: number, { caption, images, videos }: ICreateFormDataPost) {
        const user = await this.UserReposity.findOneBy({ id });
        if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        const newPost = this.PostReposity.create({ caption, user });
        // console.log('imgaes', JSON.stringify(images));
        if (images) {
            const imageEntities = await Promise.all(
                images.map(async (image) => {
                    const response = await this.CloudinaryService.uploadImageFile(image);
                    if (!response) {
                        throw new HttpException('Upload image failed', HttpStatus.BAD_REQUEST);
                    }
                    const newImage = this.ImageReposity.create({
                        url: response.secure_url,
                        public_id: response.public_id,
                    });
                    return await this.ImageReposity.save(newImage);
                }),
            );
            newPost.images = [...imageEntities];
        }
        if (videos) {
            const videoEntities = await Promise.all(
                videos.map(async (video) => {
                    const response = await this.CloudinaryService.uploadVideoFile(video);
                    if (!response) {
                        throw new HttpException('Upload video failed', HttpStatus.BAD_REQUEST);
                    }
                    const newVideo = this.ImageReposity.create({
                        url: response.secure_url,
                        public_id: response.public_id,
                    });
                    return await this.VideoReposity.save(newVideo);
                }),
            );
            newPost.videos = [...videoEntities];
        }
        const savedPost = await this.PostReposity.save(newPost);
        return savedPost;
    }

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

    async updateCaptionPost(id: number, caption: string) {
        const post = await this.PostReposity.findOneBy({ id });
        if (!post) throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
        post.caption = caption;
        return this.PostReposity.save(post);
    }

    async commentPost({ content, userId, parentId, postId }: ICommentPost) {
        const user = await this.UserReposity.findOneBy({ id: userId });
        if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        const post = await this.PostReposity.findOneBy({ id: postId });
        if (!post) throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
        if (parentId === CommentType.PARENT) {
            const newComment = this.CommentReposity.create({ content, user, post });
            return await this.CommentReposity.save(newComment);
        }
        const parentComment = await this.CommentReposity.findOneBy({ id: parentId });
        if (!parentComment) throw new HttpException('Parent comment not found', HttpStatus.BAD_REQUEST);
        const newComment = this.CommentReposity.create({ content, user, parent: parentComment });
        return this.CommentReposity.save(newComment);
    }

    async updateCommentPost({ content, userId, postId, commentId }: IUpdateCommentPost) {
        const post = await this.PostReposity.findOneBy({ id: postId });
        if (!post) throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
        const comment = await this.CommentReposity.findOneBy({ id: commentId, user: { id: userId } });
        if (!comment) throw new HttpException('Comment not found', HttpStatus.BAD_REQUEST);
        comment.content = content;
        comment.createdAt = new Date();
        return this.CommentReposity.save(comment);
    }

    async likePost({ postId, userId }: ILikePost) {
        const like = await this.LikeReposity.findOne({
            select: ['id', 'userId', 'post'],
            where: { userId, post: { id: postId } },
        });
        if (!like) {
            const post = await this.PostReposity.findOneBy({ id: postId });
            if (!post) throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
            const newLike = this.LikeReposity.create({ userId, post });
            await this.LikeReposity.save(newLike);
            return;
        }
        await this.LikeReposity.delete({ id: like.id });
        return;
    }

    async sharePost(id: number, { originId, caption }: ISharePost) {
        const user = await this.UserReposity.findOneBy({ id });
        if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        const origin = await this.PostReposity.findOneBy({ id: originId });
        if (!origin) throw new HttpException('Origin post not found', HttpStatus.BAD_REQUEST);
        const newPost = this.PostReposity.create({ caption, user, origin });
        return await this.PostReposity.save(newPost);
    }
}
