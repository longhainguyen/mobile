import { ImageEntity, PostEntity, UserEntity, VideoEntity } from '@entities/index';
import { ICreateFormDataPost } from '@interfaces/user.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from '@shares/modules/cloudinary/cloudinary.service';
import { Repository } from 'typeorm';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { CommentMode } from '@constants/enums/comment.enum';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(UserEntity) private UserReposity: Repository<UserEntity>,
        @InjectRepository(PostEntity) private PostReposity: Repository<PostEntity>,
        @InjectRepository(ImageEntity) private ImageReposity: Repository<ImageEntity>,
        @InjectRepository(VideoEntity) private VideoReposity: Repository<VideoEntity>,
        private readonly CloudinaryService: CloudinaryService,
    ) {}

    async createPost(id: number, { caption, images, videos, mode = CommentMode.ALL }: ICreateFormDataPost) {
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
        newPost.mode = mode;
        if (mode === CommentMode.FOLLOWERS) {
            newPost.publicUsers = user?.followers || [];
        }
        const savedPost = await this.PostReposity.save(newPost);
        return savedPost;
    }
}
