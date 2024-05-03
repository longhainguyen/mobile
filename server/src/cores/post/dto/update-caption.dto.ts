import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateCaptionDto {
    @IsNotEmpty()
    @IsInt()
    userId: number;
    @IsNotEmpty()
    @IsString()
    caption: string;
}
