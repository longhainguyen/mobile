import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { CreateUserDto } from '@cores/user/dto/create-user.dto';
import { AuthService } from '../service/auth.service';

@Controller('auth')
@UsePipes(new ValidationPipe())
export class AuthController {
    constructor(private AuthService: AuthService) {}
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() data: LoginDto) {
        const user = await this.AuthService.login({ ...data });
        delete user.user.password;
        return { ...user };
    }

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() createUserDto: CreateUserDto) {
        const newUser = await this.AuthService.register(createUserDto);
        delete newUser.password;
        return { ...newUser };
    }
}
