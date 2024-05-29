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
import { CommentEntity } from './comment.entity';

@Entity({ name: 'users' })
export class UserEntity {
    @PrimaryGeneratedColumn({ type: 'int' })
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true, select: false })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', select: false })
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

    @OneToMany(() => CommentEntity, (comment) => comment.user)
    comments: CommentEntity[];
}
