import { IsDefined, IsEmail, IsEmpty, IsNumber, IsString } from 'class-validator';

export class FindUserDto {
    @IsDefined()
    @IsString()
    keyword: string;
}
