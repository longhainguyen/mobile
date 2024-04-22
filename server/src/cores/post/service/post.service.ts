import { ImageEntity } from '@entities/image.entity';
import { PostEntity } from '@entities/post.entity';
import { UserEntity } from '@entities/user.entity';
import { VideoEntity } from '@entities/video.entity';
import { IGetPost } from '@interfaces/post.interface';
import { ICreatePost } from '@interfaces/user.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(UserEntity) private UserReposity: Repository<UserEntity>,
        @InjectRepository(PostEntity) private PostReposity: Repository<PostEntity>,
        @InjectRepository(ImageEntity) private ImageReposity: Repository<ImageEntity>,
        @InjectRepository(VideoEntity) private VideoReposity: Repository<VideoEntity>,
    ) {}

    async createPost(id: number, { caption, images, videos }: ICreatePost) {
        const user = await this.UserReposity.findOneBy({ id });
        if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        const newPost = this.PostReposity.create({ caption, user });
        if (images) {
            const imageEntities = await Promise.all(
                images.map(async (image) => {
                    const newImage = this.ImageReposity.create({ url: image, public_id: 'public_id' });
                    return await this.ImageReposity.save(newImage);
                }),
            );
            newPost.images = [...imageEntities];
        }
        if (videos) {
            const videoEntities = await Promise.all(
                videos.map(async (video) => {
                    const newVideo = this.VideoReposity.create({ url: video, public_id: 'public_id' });
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
            select: ['id', 'caption', 'likes', 'shares', 'comments', 'createdAt'],
            relations: ['user', 'user.profile', 'images', 'videos'],
            order: { createdAt: 'DESC' },
            skip: limit * page,
            take: limit,
        });
        return posts || [];
    }
}
