import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CommentPostDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;
    @IsNotEmpty()
    @IsNumber()
    parentId: number;
    @IsNotEmpty()
    @IsString()
    content: string;
}
