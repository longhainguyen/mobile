import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PostEntity } from './post.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'comments' })
export class CommentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    content: string;

    @ManyToOne(() => PostEntity, (post) => post.comments)
    post: PostEntity;

    @ManyToOne(() => CommentEntity, (comment) => comment.childrens)
    parent: CommentEntity;

    @OneToMany(() => CommentEntity, (comment) => comment.parent)
    childrens: CommentEntity[];

    @ManyToOne(() => UserEntity, (user) => user.comments)
    user: UserEntity;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
