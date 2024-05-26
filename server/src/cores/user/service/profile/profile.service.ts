import { DEFAULT_AVATAR, DEFAULT_COVER_PHOTO } from '@constants/profile.constant';
import { ProfileEntity } from '@entities/profile.entity';
import { UserEntity } from '@entities/user.entity';
import { ICreateProfile } from '@interfaces/user.interface';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from '@shares/modules/cloudinary/cloudinary.service';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(UserEntity) private UserReposity: Repository<UserEntity>,
        @InjectRepository(ProfileEntity) private ProfileReposity: Repository<ProfileEntity>,
        private readonly CloudinaryService: CloudinaryService,
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
        const user = await this.UserReposity.findOne({ where: { id }, relations: ['profile'] });
        if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        const response = await this.CloudinaryService.uploadImageFile(avatar);
        if (!response?.public_id) throw new HttpException('Upload avatar failed', HttpStatus.BAD_REQUEST);
        const profile = await this.ProfileReposity.update(user.profile.id, {
            avatar: response.secure_url,
            avatarPublicId: response.public_id,
        });
        return { avatar: response.secure_url };
    }

    async updateBackground(id: number, background: Express.Multer.File) {
        const user = await this.UserReposity.findOne({ where: { id }, relations: ['profile'] });
        if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        const response = await this.CloudinaryService.uploadImageFile(background);
        if (!response?.public_id) throw new HttpException('Upload background failed', HttpStatus.BAD_REQUEST);
        const profile = await this.ProfileReposity.update(user.profile.id, {
            background: response.secure_url,
            backgroundPublicId: response.public_id,
        });
        return { background: response.secure_url };
    }

    async deleteAvatar(id: number) {
        const user = await this.UserReposity.createQueryBuilder('user')
            .select(['user.id', 'profile.avatarPublicId'])
            .where('user.id = :id', { id: id })
            .innerJoinAndSelect('user.profile', 'profile')
            .getOne();
        if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        if (!user.profile.avatarPublicId)
            throw new HttpException('User does not have an avatar', HttpStatus.BAD_REQUEST);
        await this.CloudinaryService.deleteImageFile(user.profile.avatarPublicId);
        const profile = await this.ProfileReposity.update(user.profile.id, {
            avatar: DEFAULT_AVATAR,
            avatarPublicId: null,
        });
        return {
            avatar: DEFAULT_AVATAR,
        };
    }
    async deleteBackground(id: number) {
        const user = await this.UserReposity.createQueryBuilder('user')
            .select(['user.id', 'profile.backgroundPublicId'])
            .where('user.id = :id', { id: id })
            .innerJoinAndSelect('user.profile', 'profile')
            .getOne();
        if (!user) throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
        if (!user.profile.backgroundPublicId)
            throw new HttpException('User does not have an avatar', HttpStatus.BAD_REQUEST);
        await this.CloudinaryService.deleteImageFile(user.profile.backgroundPublicId);
        const profile = await this.ProfileReposity.update(user.profile.id, {
            background: DEFAULT_COVER_PHOTO,
            backgroundPublicId: null,
        });
        return {
            avatar: DEFAULT_AVATAR,
        };
    }
}
