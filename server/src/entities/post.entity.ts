import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationCount } from 'typeorm';
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

    @OneToMany(() => ImageEntity, (image) => image.post)
    images: ImageEntity[];

    @OneToMany(() => VideoEntity, (video) => video.post)
    videos: VideoEntity[];

    @Column({ type: 'int', default: 0 })
    shares: number;

    @OneToMany(() => LikeEntity, (like) => like.post)
    likes: LikeEntity[];

    @OneToMany(() => CommentEntity, (comment) => comment.post)
    comments: CommentEntity[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ManyToOne(() => UserEntity, (user) => user.posts)
    user: UserEntity;
}
