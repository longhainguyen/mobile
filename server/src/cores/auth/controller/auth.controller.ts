import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { CreateUserDto } from '@cores/user/dto/create-user.dto';
import { AuthService } from '../service/auth.service';

@Controller('auth')
@UsePipes(new ValidationPipe())
export class AuthController {
    constructor(private AuthService: AuthService) {}
    @Post('login')
    login(@Body() data: LoginDto) {
        return this.AuthService.login({ ...data });
    }

    @Post('register')
    register(@Body() createUserDto: CreateUserDto) {
        return this.AuthService.register(createUserDto);
    }
}
