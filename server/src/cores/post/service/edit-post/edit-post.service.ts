import { CommentMode } from '@constants/enums/comment.enum';
import { CommentEntity, ImageEntity, LikeEntity, PostEntity, UserEntity, VideoEntity } from '@entities/index';
import {
    ICanSeePost,
    IDeleteCommentPost,
    IDeletePost,
    IUpdateCommentPost,
    IUpdatePost,
} from '@interfaces/post.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from '@shares/modules/cloudinary/cloudinary.service';
import { Repository } from 'typeorm';

@Injectable()
export class EditPostService {
    constructor(
        @InjectRepository(PostEntity) private PostReposity: Repository<PostEntity>,
        @InjectRepository(CommentEntity) private CommentReposity: Repository<CommentEntity>,
        @InjectRepository(UserEntity) private UserReposity: Repository<UserEntity>,
        @InjectRepository(ImageEntity) private ImageReposity: Repository<ImageEntity>,
        @InjectRepository(VideoEntity) private VideoReposity: Repository<VideoEntity>,
        private readonly CloudinaryService: CloudinaryService,
    ) {}

    private async getPublicUsers({ postId, userId, visibleUsers }: ICanSeePost) {
        const post = await this.PostReposity.findOne({
            where: { id: postId, user: { id: userId } },
            relations: ['publicUsers'],
        });
        if (!post) throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
        // if (visibleUsers.length > 0) post.isPublic = false;
        const filterPublicUsers = post.publicUsers.filter((item) => visibleUsers.includes(item.id));
        const filterVisibleUsers = visibleUsers.filter((item) => !filterPublicUsers.find((user) => user.id === item));
        await Promise.all(
            filterVisibleUsers.map(async (_userId) => {
                const user = await this.UserReposity.findOneBy({ id: _userId });
                if (!user) throw new HttpException(`User ${_userId} not found`, HttpStatus.BAD_REQUEST);
                filterPublicUsers.push(user);
            }),
        );
        return { post, filterPublicUsers };
    }

    async updatePost({
        caption,
        deleted,
        postId,
        userId,
        images = [],
        videos = [],
        commentMode,
        checkin,
    }: IUpdatePost) {
        const user = await this.UserReposity.findOne({
            select: ['id', 'username'],
            relations: ['followers'],
            where: { id: userId },
        });
        if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        const post = await this.PostReposity.findOne({
            select: ['id', 'caption', 'mode'],
            where: { id: postId, user: { id: userId } },
            relations: ['images', 'videos', 'publicUsers'],
        });
        if (!post) throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
        post.caption = caption;
        if (checkin) post.checkin = checkin;
        if (commentMode) {
            post.mode = commentMode.mode;
            if (commentMode.mode === CommentMode.ALL) post.publicUsers = [];
            if (commentMode.mode === CommentMode.FOLLOWERS) post.publicUsers = user.followers;
            if (commentMode.mode === CommentMode.POINT && commentMode?.visibleUsers)
                post.publicUsers = (
                    await this.getPublicUsers({ postId, userId, visibleUsers: commentMode.visibleUsers })
                ).filterPublicUsers;
        }

        if (deleted?.images) {
            await Promise.all(
                deleted.images.map(async (imageId) => {
                    const image = await this.ImageReposity.findOne({
                        select: ['id', 'public_id', 'url'],
                        where: { id: imageId },
                    });
                    if (!image) throw new HttpException('Image not found', HttpStatus.BAD_REQUEST);
                    try {
                        const response = await this.CloudinaryService.deleteImageFile(image.public_id);
                        const deletedImage = await this.ImageReposity.delete({ id: imageId });
                        post.images = post.images.filter((item) => item.id !== imageId);
                    } catch (error) {
                        console.log(error);
                        throw new HttpException('Delete image failed', HttpStatus.BAD_REQUEST);
                    }
                }),
            );
        }

        if (deleted?.videos) {
            await Promise.all(
                deleted.videos.map(async (videoId) => {
                    const video = await this.VideoReposity.findOne({
                        select: ['id', 'public_id', 'url'],
                        where: { id: videoId },
                    });
                    if (!video) throw new HttpException('Image not found', HttpStatus.BAD_REQUEST);
                    try {
                        const response = await this.CloudinaryService.deleteImageFile(video.public_id);
                        const deteledVideo = await this.VideoReposity.delete({ id: videoId });
                        post.videos = post.videos.filter((item) => item.id !== videoId);
                    } catch (error) {
                        console.log(error);
                        throw new HttpException('Delete video failed', HttpStatus.BAD_REQUEST);
                    }
                }),
            );
        }

        if (images) {
            const imageEntities = await Promise.all(
                images.map(async (image) => {
                    const response = await this.CloudinaryService.uploadImageFile(image);
                    if (!response?.public_id) {
                        throw new HttpException('Upload image failed', HttpStatus.BAD_REQUEST);
                    }
                    const newImage = this.ImageReposity.create({
                        url: response.secure_url,
                        public_id: response.public_id,
                    });
                    return await this.ImageReposity.save(newImage);
                }),
            );
            post.images = [...post.images, ...imageEntities];
        }

        if (videos) {
            const videoEntities = await Promise.all(
                videos.map(async (video) => {
                    const response = await this.CloudinaryService.uploadVideoFile(video);
                    if (!response?.public_id) {
                        throw new HttpException('Upload video failed', HttpStatus.BAD_REQUEST);
                    }
                    const newVideo = this.ImageReposity.create({
                        url: response.secure_url,
                        public_id: response.public_id,
                    });
                    return await this.VideoReposity.save(newVideo);
                }),
            );
            post.videos = [...post.videos, ...videoEntities];
        }
        return this.PostReposity.save(post);
    }

    async updateCaptionPost(id: number, caption: string, userId: number) {
        const post = await this.PostReposity.findOneBy({ id: id, user: { id: userId } });
        if (!post) throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
        post.caption = caption;
        return this.PostReposity.save(post);
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

    async updateCommentMode({ userId, postId }) {
        const post = await this.PostReposity.findOne({ where: { id: postId, user: { id: userId } } });
        if (!post) throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
        post.isPublic = !post.isPublic;
        return this.PostReposity.save(post);
    }

    async deleteCommentPost({ commentId, postId, userId, isParent }: IDeleteCommentPost) {
        const comment = await (isParent
            ? this.CommentReposity.findOneBy({
                  id: commentId,
                  user: { id: userId },
                  post: { id: postId },
              })
            : this.CommentReposity.findOneBy({
                  id: commentId,
                  user: { id: userId },
              }));
        if (!comment) throw new HttpException('Comment not found', HttpStatus.BAD_REQUEST);
        return this.CommentReposity.delete({ id: commentId });
    }

    async deletePost({ postId, userId }: IDeletePost) {
        const post = await this.PostReposity.findOneBy({ id: postId, user: { id: userId } });
        if (!post) throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
        return this.PostReposity.delete({ id: postId });
    }

    async updateWhoCanCommentPost(data: ICanSeePost) {
        const { post } = await this.getPublicUsers({ ...data });
        return this.PostReposity.save(post);
    }
}
