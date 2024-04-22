import { IsDefined, IsEmail, IsEmpty, IsString } from 'class-validator';

export class CreateUserDto {
    @IsDefined()
    @IsString()
    username: string;
    @IsDefined()
    @IsString()
    @IsEmail()
    email: string;
    @IsDefined()
    @IsString()
    password: string;
}
