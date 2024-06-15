import { ChangePasswordDto } from '@cores/user/dto/change-password.dto';
import { CreateUserDto } from '@cores/user/dto/create-user.dto';
import { FindUserDto } from '@cores/user/dto/find-user.dto';
import { FollowUserDto } from '@cores/user/dto/follow-user.dto';
import { UserService } from '@cores/user/service/user/user.service';
import { IUpdateUser } from '@interfaces/user.interface';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
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

    @Get('find-by-name')
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe())
    getUsersByName(@Body() findUserDto: FindUserDto) {
        console.log(findUserDto);
        return this.UserService.getUsersByName({ ...findUserDto });
    }

    @Get(':userId')
    @HttpCode(HttpStatus.OK)
    getUsers(@Param('userId', ParseIntPipe) userId: number) {
        return this.UserService.getUserById(userId);
    }

    @Patch('update-user/:id')
    @UsePipes(new ValidationPipe())
    @HttpCode(HttpStatus.CREATED)
    updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUser: IUpdateUser) {
        return this.UserService.updateUser(id, { ...updateUser });
    }

    @Delete('delete-user/:id')
    @HttpCode(HttpStatus.OK)
    deleateUser(@Param('id', ParseIntPipe) id: number) {
        return this.UserService.deleteUser(id);
    }

    @Post('follow-user')
    @UsePipes(new ValidationPipe())
    @HttpCode(HttpStatus.CREATED)
    followUser(@Body() followUserData: FollowUserDto) {
        return this.UserService.followUser({ ...followUserData });
    }

    @Post('unfollow-user')
    @UsePipes(new ValidationPipe())
    @HttpCode(HttpStatus.CREATED)
    unFollowUser(@Body() followUserData: FollowUserDto) {
        return this.UserService.unFollowUser({ ...followUserData });
    }

    @Patch('change-password/:id')
    @HttpCode(HttpStatus.CREATED)
    changePassword(@Param('id', ParseIntPipe) id: number, @Body(new ValidationPipe()) data: ChangePasswordDto) {
        return this.UserService.changePassword(id, { ...data });
    }

    @Get('notifications/:id')
    @HttpCode(HttpStatus.OK)
    getNotifications(@Param('id', ParseIntPipe) id: number) {
        return this.UserService.getNotification(id);
    }

    @Patch('notifications/read/:id')
    @HttpCode(HttpStatus.OK)
    readNotification(@Param('id', ParseIntPipe) id: number, @Body('userId', ParseIntPipe) userId: number) {
        return this.UserService.markReadedNotification(userId, id);
    }
}
