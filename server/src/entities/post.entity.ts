import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { ImageEntity } from './image.entity';
import { VideoEntity } from './video.entity';
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

    @Column({ type: 'int', default: 0 })
    likes: number;

    @Column({ type: 'int', default: 0 })
    comments: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ManyToOne(() => UserEntity, (user) => user.posts)
    user: UserEntity;
}
