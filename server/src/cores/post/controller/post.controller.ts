import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostService } from '../service/post.service';

@Controller('posts')
export class PostController {
    constructor(private PostService: PostService) {}
    @Post('create-post/:id')
    @UsePipes(new ValidationPipe())
    createPost(@Param('id', ParseIntPipe) id: number, @Body() post: CreatePostDto) {
        return this.PostService.createPost(id, { ...post });
    }

    @Get('get-posts')
    getPosts(@Query('limit', ParseIntPipe) limit: number, @Query('page', ParseIntPipe) page: number) {
        return this.PostService.getPosts({ limit, page });
    }
}
