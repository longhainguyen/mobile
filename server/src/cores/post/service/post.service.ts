import { CommentType } from '@constants/enums/comment.enum';
import { CommentEntity, ImageEntity, LikeEntity, PostEntity, UserEntity, VideoEntity } from '@entities/index';
import { ICommentPost, IGetPost, ILikePost } from '@interfaces/post.interface';
import { ICreateFormDataPost, ICreatePost } from '@interfaces/user.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from '@shares/modules/cloudinary/cloudinary.service';
import { In, Repository } from 'typeorm';

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
            select: ['id', 'caption', 'shares', 'comments', 'createdAt'],
            relations: [
                'user.profile',
                'images',
                'videos',
                'user.followers',
                'user.followings',
                'likes',
                'comments',
                'comments.childrens',
                'comments.user',
                'comments.childrens.user',
                'comments.childrens.user.profile',
            ],
            order: { createdAt: 'DESC' },
            skip: limit * page,
            take: limit,
        });

        const filerPosts = posts.map((post) => {
            const { user, ...props } = post;
            return {
                ...props,
                user: {
                    id: user.id,
                    username: user.username,
                    followers: user.followers,
                    followings: user.followings,
                    profile: user.profile,
                },
            };
        });
        return filerPosts || [];
    }

    async updateCaptionPost(id: number, caption: string) {
        const post = await this.PostReposity.findOneBy({ id });
        if (!post) throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
        post.caption = caption;
        return await this.PostReposity.save(post);
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
        return await this.CommentReposity.save(newComment);
    }
}
