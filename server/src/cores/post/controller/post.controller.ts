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
}
