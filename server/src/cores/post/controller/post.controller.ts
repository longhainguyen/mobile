import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Req,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostService } from '../service/post.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateCaptionDto } from '../dto/update-caption.dto';
import { CommentPostDto } from '../dto/comment-post.dto';
import { UpdateCommentPostDto } from '../dto/update-comment-post.dto';
import { DeleteCommentDto } from '../dto/delete-comment-post.dto';
import { GetPostService } from '../service/get-post/get-post.service';
import { EditPostService } from '../service/edit-post/edit-post.service';
import { InteractPostService } from '../service/interact-post/interact-post.service';
import { AuthGuard } from '@cores/auth/guard/auth.guard';
import { JwtAuthGuard } from '@cores/auth/guard/jwt.guard';
import { Request } from '@customs/express.type';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostController {
    constructor(
        private readonly PostService: PostService,
        private readonly GetPostService: GetPostService,
        private readonly EditPostService: EditPostService,
        private readonly InteractPostService: InteractPostService,
    ) {}

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
    getPosts(
        @Req() req: Request,
        @Query('limit', ParseIntPipe) limit: number,
        @Query('page', ParseIntPipe) page: number,
    ) {
        return this.GetPostService.getPosts(req?.user.id, { limit, page });
    }

    @Get('get-posts/:postId')
    getPostById(@Req() req: Request, @Param('postId', ParseIntPipe) postId: number) {
        return this.GetPostService.getSinglePost(req.user.id, postId);
    }

    @Get('get-posts-by-id/:id')
    getPostByUserId(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Query('limit', ParseIntPipe) limit: number,
        @Query('page', ParseIntPipe) page: number,
    ) {
        return this.GetPostService.getPosts(req?.user.id, { limit, page }, true, id);
    }

    @Patch('update-caption-post/:id')
    updateCaptionPost(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe()) data: UpdateCaptionDto) {
        return this.EditPostService.updateCaptionPost(id, data.caption, data.userId);
    }

    @Patch('update-comment-mode/:postId')
    updateCommentMode(@Param('postId', ParseIntPipe) postId: number, @Req() req: Request) {
        return this.EditPostService.updateCommentMode({ postId, userId: req.user.id });
    }

    @Post('like-post/:id')
    likePost(@Param('id', ParseIntPipe) id: number, @Body('userId', ParseIntPipe) userId: number) {
        return this.InteractPostService.likePost({ userId, postId: id });
    }

    @Post('comment-post/:id')
    commentPost(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe()) { content, parentId, userId }: CommentPostDto,
    ) {
        return this.InteractPostService.commentPost({ content, parentId, userId, postId: id });
    }

    @Patch('update-comment-post/:id')
    updateCommentPost(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ValidationPipe()) { content, commentId, userId }: UpdateCommentPostDto,
    ) {
        return this.EditPostService.updateCommentPost({ content, commentId, userId, postId: id });
    }

    @Delete('delete-comment-post/:id')
    deleteCommentPost(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe()) data: DeleteCommentDto) {
        return this.EditPostService.deleteCommentPost({ postId: id, ...data });
    }

    @Post('share-post/:id')
    sharePost(
        @Param('id', ParseIntPipe) id: number,
        @Body('originId', ParseIntPipe) originId: number,
        @Body('caption') caption: string,
    ) {
        return this.InteractPostService.sharePost(id, { originId, caption });
    }

    @Delete('delete-post/:id')
    deletePost(@Param('id', ParseIntPipe) id: number, @Body('userId', ParseIntPipe) userId: number) {
        return this.EditPostService.deletePost({ postId: id, userId });
    }

    @Get('search-posts')
    searchPosts(
        @Req() req: Request,
        @Query('keyword') keyword: string,
        @Query('limit', ParseIntPipe) limit: number,
        @Query('page', ParseIntPipe) page: number,
    ) {
        return this.GetPostService.getPostsByKeyWord(req?.user.id, keyword, { limit, page });
    }

    @Get('get-comments/:id')
    getComments(
        @Param('id', ParseIntPipe) id: number,
        @Query('limit', ParseIntPipe) limit: number,
        @Query('page', ParseIntPipe) page: number,
    ) {
        return this.GetPostService.getComments(id, { limit, page });
    }
}
