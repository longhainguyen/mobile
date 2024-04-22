import { DEFAULT_AVATAR, DEFAULT_COVER_PHOTO } from '@constants/profile.constant';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'profiles' })
export class ProfileEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ nullable: true, default: null })
    age: number;
    @Column({ nullable: true, default: null })
    birthday: Date;
    @Column({ default: DEFAULT_AVATAR })
    avatar: string;
    @Column({ default: DEFAULT_COVER_PHOTO })
    background: string;
}
