import { CommentEntity, LikeEntity, PostEntity, UserEntity } from '@entities/index';
import { ICanSeePost, IDeleteCommentPost, IDeletePost, IUpdateCommentPost } from '@interfaces/post.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EditPostService {
    constructor(
        @InjectRepository(PostEntity) private PostReposity: Repository<PostEntity>,
        @InjectRepository(CommentEntity) private CommentReposity: Repository<CommentEntity>,
        @InjectRepository(UserEntity) private UserReposity: Repository<UserEntity>,
    ) {}
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

    async updateWhoCanCommentPost({ postId, userId, visibleUsers }: ICanSeePost) {
        const post = await this.PostReposity.findOne({
            where: { id: postId, user: { id: userId } },
            relations: ['publicUsers'],
        });
        if (!post) throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
        if (visibleUsers.length > 0) post.isPublic = false;
        const filterPublicUsers = post.publicUsers.filter((item) => visibleUsers.includes(item.id));
        const filterVisibleUsers = visibleUsers.filter((item) => !filterPublicUsers.find((user) => user.id === item));
        await Promise.all(
            filterVisibleUsers.map(async (_userId) => {
                const user = await this.UserReposity.findOneBy({ id: _userId });
                if (!user) throw new HttpException(`User ${_userId} not found`, HttpStatus.BAD_REQUEST);
                filterPublicUsers.push(user);
            }),
        );
        post.publicUsers = filterPublicUsers;
        return this.PostReposity.save(post);
    }
}
