import { PostEntity } from '@entities/post.entity';
import { ProfileEntity } from '@entities/profile.entity';
import { UserEntity } from '@entities/user.entity';
import {
    IChangePassword,
    ICreatePost,
    ICreateProfile,
    IFindUser,
    IFollowUser,
    IUpdateUser,
    IUserInfor,
} from '@interfaces/user.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BcryptService } from '@shares/services/bcrypt/bcrypt.service';
import { Like, Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private UserReposity: Repository<UserEntity>,
        @InjectRepository(ProfileEntity) private ProfileReposity: Repository<ProfileEntity>,
        @InjectRepository(PostEntity) private PostReposity: Repository<PostEntity>,
        private readonly bcryptService: BcryptService,
    ) {}
    getUsers() {
        return this.UserReposity.find({
            select: ['id', 'email', 'username'],
            relations: ['profile', 'followers', 'followings'],
        });
    }

    getUsersByName({ keyword, limit = 5, page = 0 }: IFindUser) {
        return this.UserReposity.find({
            select: ['id', 'username', 'email'],
            where: { username: Like(`%${keyword}%`) },
            order: { username: 'ASC' },
            skip: limit * page,
            take: limit,
        });
    }

    updateUser(id: number, userInfor: IUpdateUser) {
        return this.UserReposity.update(id, userInfor);
    }

    deleteUser(id: number) {
        return this.UserReposity.delete({ id });
    }

    async followUser({ userId, followingId }: IFollowUser) {
        const user = await this.UserReposity.findOneOrFail({
            where: { id: userId },
            relations: ['followings', 'followers'],
            select: ['id', 'username', 'email'],
        });
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        const followingUser = await this.UserReposity.findOneOrFail({
            where: { id: followingId },
            relations: ['followings', 'followers'],
            select: ['id', 'username', 'email'],
        });
        if (!followingUser) throw new HttpException('Following User not found', HttpStatus.NOT_FOUND);
        if (user.followings) user.followings.push(followingUser);
        else user.followings = [followingUser];
        await this.UserReposity.save(user);
        return;
    }

    async unFollowUser({ userId, followingId }: IFollowUser) {
        const user = await this.UserReposity.findOneOrFail({
            where: { id: userId },
            relations: ['followings', 'followers'],
            select: ['id', 'username', 'email'],
        });
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        const followingUser = await this.UserReposity.findOneOrFail({
            where: { id: followingId },
            relations: ['followings', 'followers'],
            select: ['id', 'username', 'email'],
        });
        if (!followingUser) throw new HttpException('Following User not found', HttpStatus.NOT_FOUND);
        if (user.followings) user.followings = user.followings.filter((follow) => follow.id !== followingUser.id);
        await this.UserReposity.save(user);
        return;
    }

    async changePassword(id: number, { oldPassword, newPassword }: IChangePassword) {
        const user = await this.UserReposity.findOneBy({ id });
        if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        const isPasswordMatch = await this.bcryptService.comparePassword(oldPassword, user.password);
        if (!isPasswordMatch) throw new HttpException('Old password is incorrect', HttpStatus.BAD_REQUEST);
        const hashedPassword = await this.bcryptService.hashPassword(newPassword);
        user.password = hashedPassword;
        await this.UserReposity.save(user);
        return;
    }
}
