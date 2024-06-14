import { IsDefined, IsString, isDefined } from 'class-validator';

export class CreatePostDto {
    @IsDefined()
    @IsString()
    caption: string;

    @IsDefined()
    @IsString()
    mode: string;
    images?: string[];
    videos?: string[];
}
