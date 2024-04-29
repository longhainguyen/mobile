import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCommentPostDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;
    @IsNotEmpty()
    @IsNumber()
    commentId: number;
    @IsNotEmpty()
    @IsString()
    content: string;
}
