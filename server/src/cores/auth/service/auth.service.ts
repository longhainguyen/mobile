import { UserEntity } from '@entities/user.entity';
import { ILogin, IUserInfor } from '@interfaces/user.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(UserEntity) private UserReposity: Repository<UserEntity>) {}

    async login({ email, password }: ILogin) {
        const user = await this.UserReposity.findOne({
            select: ['id', 'email', 'username'],
            where: { email, password },
            relations: ['profile'],
        });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        }
        return user;
    }

    register(userInfor: IUserInfor) {
        const newUser = this.UserReposity.create({ ...userInfor });
        return this.UserReposity.save(newUser);
    }
}
