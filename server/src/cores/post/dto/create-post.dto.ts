import { IsDefined, IsString } from 'class-validator';

export class CreatePostDto {
    @IsDefined()
    @IsString()
    caption: string;
}