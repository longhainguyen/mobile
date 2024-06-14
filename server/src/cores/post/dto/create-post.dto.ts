import { IsDefined, IsString, isDefined } from 'class-validator';

export class CreatePostDto {
    @IsDefined()
    @IsString()
    caption: string;
    checkin?: string;
    images?: string[];
    videos?: string[];
}
