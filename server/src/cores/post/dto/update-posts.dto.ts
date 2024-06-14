import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePostDto {
    @IsNotEmpty()
    @IsString()
    caption: string;
    checkin?: string;
}
