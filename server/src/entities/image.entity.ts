import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from './post.entity';
@Entity({ name: 'images' })
export class ImageEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'varchar' })
    public_id: string;
    @Column({ type: 'varchar' })
    url: string;
    @ManyToOne(() => PostEntity, (post) => post.images)
    post: PostEntity;
}
