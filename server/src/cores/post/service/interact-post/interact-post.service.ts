import { CommentType } from '@constants/enums/comment.enum';
import { CommentEntity, LikeEntity, PostEntity, UserEntity } from '@entities/index';
import { ICommentPost, ILikePost, ISharePost } from '@interfaces/post.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class InteractPostService {
    constructor(
        @InjectRepository(UserEntity) private UserReposity: Repository<UserEntity>,
        @InjectRepository(PostEntity) private PostReposity: Repository<PostEntity>,
        @InjectRepository(CommentEntity) private CommentReposity: Repository<CommentEntity>,
        @InjectRepository(LikeEntity) private LikeReposity: Repository<LikeEntity>,
    ) {}

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

    async likePost({ postId, userId }: ILikePost) {
        const user = await this.UserReposity.findOneBy({ id: userId });
        if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
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
