import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

export class DeleteCommentDto {
    @IsNotEmpty()
    @IsInt()
    userId: number;
    @IsNotEmpty()
    @IsInt()
    commentId: number;
    @IsNotEmpty()
    @IsBoolean()
    isParent: boolean;
}
