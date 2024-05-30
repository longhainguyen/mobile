import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('notifications')
export class NotificationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    ownerId: number;

    @Column({ type: 'int' })
    postId: number;

    @Column({ type: 'boolean', default: false })
    isReaded: boolean;

    @Column({ type: 'varchar', length: 255 })
    type: string;

    @Column({ type: 'int', nullable: true, select: false })
    likeId: number;

    @Column({ type: 'int', nullable: true, select: false })
    commentId: number;

    @ManyToOne(() => UserEntity, (user) => user.notifications, { onDelete: 'CASCADE' })
    user: UserEntity;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}
