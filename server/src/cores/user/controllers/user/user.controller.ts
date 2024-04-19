import { CreateUserDto } from '@cores/user/dto/create-user.dto';
import { FindUserDto } from '@cores/user/dto/find-user.dto';
import { UserService } from '@cores/user/service/user/user.service';
import { IUpdateUser } from '@interfaces/user.interface';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';

@Controller('users')
export class UserController {
    constructor(private UserService: UserService) {}
    @Get('find-user')
    getUsers() {
        return this.UserService.getUsers();
    }

    @Get('find-by-name')
    @UsePipes(new ValidationPipe())
    getUsersByName(@Body() findUserDto: FindUserDto) {
        return this.UserService.getUsersByName({ ...findUserDto });
    }

    @Patch('update-user/:id')
    @UsePipes(new ValidationPipe())
    updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUser: IUpdateUser) {
        return this.UserService.updateUser(id, { ...updateUser });
    }

    @Delete('delete-user/:id')
    deleateUser(@Param('id', ParseIntPipe) id: number) {
        return this.UserService.deleteUser(id);
    }
}
