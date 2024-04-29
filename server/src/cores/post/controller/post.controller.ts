import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UploadedFiles,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostService } from '../service/post.service';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UpdateCaptionDto } from '../dto/update-caption.dto';
import { CommentPostDto } from '../dto/comment-post.dto';
import { UpdateCommentPostDto } from '../dto/update-comment-post.dto';

@Controller('posts')
export class PostController {
    constructor(private PostService: PostService) {}

    @Post('create-post/:id')
    @UsePipes(new ValidationPipe())
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'images', maxCount: 2 },
            { name: 'videos', maxCount: 2 },
        ]),
    )
    async createPost(
        @Param('id', ParseIntPipe) id: number,
        @Body() post: CreatePostDto,
        @UploadedFiles() files: { images: Express.Multer.File[]; videos: Express.Multer.File[] },
    ) {
        const newPost = await this.PostService.createPost(id, {
            ...post,
            images: files.images,
            videos: files.videos,
        });
        return { ...newPost, videos: newPost?.videos || [], images: newPost?.images || [] };
    }

    @Get('get-posts')
    getPosts(@Query('limit', ParseIntPipe) limit: number, @Query('page', ParseIntPipe) page: number) {
        return this.PostService.getPosts({ limit, page });
    }

    @Get('get-posts/:id')
    getPostByUserId(
        @Param('id', ParseIntPipe) id: number,
        @Query('limit', ParseIntPipe) limit: number,
        @Query('page', ParseIntPipe) page: number,
    ) {
        return this.PostService.getPostByUserId(id, { limit, page });
    }

    @Patch('update-caption-post/:id')
    updateCaptionPost(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe()) data: UpdateCaptionDto) {
        return this.PostService.updateCaptionPost(id, data.caption);
    }

    @Post('like-post/:id')
    likePost(@Param('id', ParseIntPipe) id: number, @Body('userId', ParseIntPipe) userId: number) {
        return this.PostService.likePost({ userId, postId: id });
    }

    @Post('comment-post/:id')
    commentPost(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe()) { content, parentId, userId }: CommentPostDto,
    ) {
        return this.PostService.commentPost({ content, parentId, userId, postId: id });
    }

    @Patch('update-comment-post/:id')
    updateCommentPost(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe()) { content, commentId, userId }: UpdateCommentPostDto,
    ) {
        return this.PostService.updateCommentPost({ content, commentId, userId, postId: id });
    }

    @Post('share-post/:id')
    sharePost(
        @Param('id', ParseIntPipe) id: number,
        @Body('originId', ParseIntPipe) originId: number,
        @Body('caption') caption: string,
    ) {
        return this.PostService.sharePost(id, { originId, caption });
    }
}
