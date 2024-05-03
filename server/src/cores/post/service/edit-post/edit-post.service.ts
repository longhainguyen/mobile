import { CommentEntity, LikeEntity, PostEntity, UserEntity } from '@entities/index';
import { IDeleteCommentPost, IDeletePost, ILikePost, ISharePost, IUpdateCommentPost } from '@interfaces/post.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EditPostService {
    constructor(
        @InjectRepository(PostEntity) private PostReposity: Repository<PostEntity>,
        @InjectRepository(CommentEntity) private CommentReposity: Repository<CommentEntity>,
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
}
