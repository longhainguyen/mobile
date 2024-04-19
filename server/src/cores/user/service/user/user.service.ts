import { PostEntity } from '@entities/post.entity';
import { ProfileEntity } from '@entities/profile.entity';
import { UserEntity } from '@entities/user.entity';
import { ICreatePost, ICreateProfile, IFindUser, IUpdateUser, IUserInfor } from '@interfaces/user.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private UserReposity: Repository<UserEntity>,
        @InjectRepository(ProfileEntity) private ProfileReposity: Repository<ProfileEntity>,
        @InjectRepository(PostEntity) private PostReposity: Repository<PostEntity>,
    ) {}
    getUsers() {
        return this.UserReposity.find({ relations: ['profile', 'posts'] });
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
}
