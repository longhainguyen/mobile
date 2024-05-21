import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from './post.entity';

@Entity({ name: 'likes' })
export class LikeEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int', select: true })
    userId: number;

    @ManyToOne(() => PostEntity, (post) => post.likes, { onDelete: 'CASCADE' })
    post: PostEntity;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', select: false })
    createdAt: Date;
}
