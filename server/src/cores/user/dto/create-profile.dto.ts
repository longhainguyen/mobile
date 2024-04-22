import { IsDate, IsDefined, IsNumber, IsString } from 'class-validator';

export class CreateProfileDto {
    @IsDefined()
    @IsString()
    name: string;

    @IsDefined()
    @IsNumber()
    age: number;
    @IsDefined()
    @IsDate()
    birthday: Date;
    @IsDefined()
    @IsString()
    avatar: string;
    @IsDefined()
    @IsString()
    background: string;
}
