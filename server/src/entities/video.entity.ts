import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from './post.entity';
@Entity({ name: 'videos' })
export class VideoEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'varchar', select: false })
    public_id: string;
    @Column({ type: 'varchar' })
    url: string;
    @ManyToOne(() => PostEntity, (post) => post.videos)
    post: PostEntity;
}
