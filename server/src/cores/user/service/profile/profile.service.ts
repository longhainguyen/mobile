import { ProfileEntity } from '@entities/profile.entity';
import { UserEntity } from '@entities/user.entity';
import { ICreateProfile } from '@interfaces/user.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(UserEntity) private UserReposity: Repository<UserEntity>,
        @InjectRepository(ProfileEntity) private ProfileReposity: Repository<ProfileEntity>,
    ) {}

    async createProfile(id: number, profile: ICreateProfile) {
        const user = await this.UserReposity.findOneBy({ id });
        if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        const newProfile = this.ProfileReposity.create({ ...profile });
        const savedProfile = await this.ProfileReposity.save(newProfile);
        user.profile = savedProfile;
        return this.UserReposity.save(user);
    }

    async updateAvatar(id: number, avatar: Express.Multer.File) {
        const user = await this.UserReposity.findOneBy({ id });
        if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        console.log(avatar);
        return user;
    }
}
