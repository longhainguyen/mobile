import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from './post.entity';
@Entity({ name: 'images' })
export class ImageEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'varchar', select: false })
    public_id: string;
    @Column({ type: 'varchar' })
    url: string;
    @ManyToOne(() => PostEntity, (post) => post.images, { onDelete: 'CASCADE' })
    post: PostEntity;
}
