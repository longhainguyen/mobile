import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    RelationCount,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ImageEntity } from './image.entity';
import { VideoEntity } from './video.entity';
import { LikeEntity } from './like.entity';
import { CommentEntity } from './comment.entity';
@Entity({ name: 'posts' })
export class PostEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    caption: string;

    @Column({ type: 'boolean', default: true })
    isPublic: boolean;

    @Column({ type: 'varchar', nullable: true })
    mode: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @OneToMany(() => ImageEntity, (image) => image.post)
    images: ImageEntity[];

    @OneToMany(() => VideoEntity, (video) => video.post)
    videos: VideoEntity[];

    @ManyToOne(() => PostEntity, (post) => post.shareds, { onDelete: 'CASCADE' })
    origin: PostEntity;

    @OneToMany(() => PostEntity, (post) => post.origin)
    shareds: PostEntity[];

    @OneToMany(() => LikeEntity, (like) => like.post)
    likes: LikeEntity[];

    @OneToMany(() => CommentEntity, (comment) => comment.post)
    comments: CommentEntity[];

    @ManyToOne(() => UserEntity, (user) => user.posts)
    user: UserEntity;

    @ManyToMany(() => UserEntity)
    @JoinTable({
        name: 'public_post_for_users',
        joinColumn: { name: 'postId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
    })
    publicUsers: UserEntity[];
}
