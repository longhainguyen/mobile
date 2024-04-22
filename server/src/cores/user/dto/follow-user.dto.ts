import { IsInt, IsNotEmpty } from 'class-validator';

export class FollowUserDto {
    @IsNotEmpty()
    @IsInt()
    userId: number;
    @IsNotEmpty()
    @IsInt()
    followingId: number;
}
