import { UserEntity, NotificationEntity } from '@entities/index';
import { IOnlineUser } from '@interfaces/gateway.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GatewayService {
    constructor(
        @InjectRepository(UserEntity) private UserReposity: Repository<UserEntity>,
        @InjectRepository(NotificationEntity) private NotifyReposity: Repository<NotificationEntity>,
    ) {}
    private onlineUsers: IOnlineUser[] = [];

    get onlineUsersList(): IOnlineUser[] {
        return this.onlineUsers;
    }

    set setOnlineUser(user: IOnlineUser) {
        const index = this.onlineUsers.findIndex((onlineUser) => onlineUser.id === user.id);
        if (index === -1) this.onlineUsers.push(user);
    }

    removeOnlineUser(socketId: string): void {
        this.onlineUsers = this.onlineUsers.filter((user) => user.socketId !== socketId);
    }

    async getNotificationById(notificationId: number): Promise<NotificationEntity> {
        return this.NotifyReposity.findOne({
            select: ['id', 'ownerId', 'type', 'isReaded', 'createdAt', 'postId'],
            relations: ['user.profile'],
            where: { id: notificationId },
        });
    }
}
