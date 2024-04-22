import { ProfileEntity } from '@entities/profile.entity';
import { UserEntity } from '@entities/user.entity';
import { ILogin, IUserInfor } from '@interfaces/user.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BcryptService } from '@shares/services/bcrypt/bcrypt.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private UserReposity: Repository<UserEntity>,
        @InjectRepository(ProfileEntity) private ProfileReposity: Repository<ProfileEntity>,
        private readonly bcryptService: BcryptService,
    ) {}

    async login({ email, password }: ILogin) {
        const user = await this.UserReposity.findOne({
            select: ['id', 'email', 'username', 'password'],
            where: { email },
            relations: ['profile', 'posts', 'followers', 'followings'],
        });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        }
        const isPasswordMatch = await this.bcryptService.comparePassword(password, user.password);
        if (!isPasswordMatch) {
            throw new HttpException('Email or password Invalid', HttpStatus.BAD_REQUEST);
        }
        return user;
    }

    async register(userInfor: IUserInfor) {
        const exitedUser = await this.UserReposity.findOne({
            select: ['email'],
            where: { email: userInfor.email, password: userInfor.password },
        });
        if (exitedUser) throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
        const hashedPassword = await this.bcryptService.hashPassword(userInfor.password);
        const newUser = this.UserReposity.create({ ...userInfor, password: hashedPassword });
        const newProfile = this.ProfileReposity.create({});
        const savedProfile = await this.ProfileReposity.save(newProfile);
        newUser.profile = savedProfile;
        return this.UserReposity.save(newUser);
    }
}
