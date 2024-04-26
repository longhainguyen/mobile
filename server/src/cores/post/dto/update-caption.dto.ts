import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCaptionDto {
    @IsNotEmpty()
    @IsString()
    caption: string;
}
