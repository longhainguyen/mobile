import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfileEntity } from './profile.entity';
import { PostEntity } from './post.entity';

@Entity({ name: 'users' })
export class UserEntity {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @OneToOne(() => ProfileEntity)
    @JoinColumn()
    profile: ProfileEntity;

    @OneToMany(() => PostEntity, (post) => post.user)
    posts: PostEntity[];
    @ManyToMany(() => UserEntity, (user) => user.followings)
    @JoinTable()
    followers: UserEntity[];

    @ManyToMany(() => UserEntity, (user) => user.followers)
    followings: UserEntity[];
}
