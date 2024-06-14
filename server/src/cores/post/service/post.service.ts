import { ImageEntity, PostEntity, UserEntity, VideoEntity } from '@entities/index';
import { ICreateFormDataPost } from '@interfaces/user.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from '@shares/modules/cloudinary/cloudinary.service';
import { Repository } from 'typeorm';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { CommentMode } from '@constants/enums/comment.enum';
import { ICanSeePost } from '@interfaces/post.interface';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(UserEntity) private UserReposity: Repository<UserEntity>,
        @InjectRepository(PostEntity) private PostReposity: Repository<PostEntity>,
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
        return filterPublicUsers;
    }

    async createPost(id: number, { caption, images, videos, commentMode, checkin }: ICreateFormDataPost) {
        const user = await this.UserReposity.findOne({
            select: ['id', 'username'],
            relations: ['followers'],
            where: { id },
        });
        if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        const newPost = this.PostReposity.create({ caption, user });
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
            newPost.images = [...imageEntities];
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
            newPost.videos = [...videoEntities];
        }
        newPost.mode = commentMode.mode;
        if (commentMode.mode === CommentMode.ALL) newPost.publicUsers = [];
        if (commentMode.mode === CommentMode.FOLLOWERS) newPost.publicUsers = user.followers;
        if (commentMode.mode === CommentMode.POINT && commentMode?.visibleUsers)
            newPost.publicUsers = await this.getPublicUsers({
                postId: newPost.id,
                userId: id,
                visibleUsers: commentMode.visibleUsers,
            });
        if (checkin) newPost.checkin = checkin;
        const savedPost = await this.PostReposity.save(newPost);
        return savedPost;
    }
}
