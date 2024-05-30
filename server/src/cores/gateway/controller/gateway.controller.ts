import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GatewayService } from '../service/gateway.service';
import { UseGuards } from '@nestjs/common';
import { GatewayGuard } from '../guard/gateway.guard';
import { Socket as GatewaySocket } from '@customs/express.type';
import { ILikeData } from '@interfaces/gateway.interface';
@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class SocialGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private GatewayService: GatewayService) {}
    @WebSocketServer()
    server: Server;

    afterInit(server: Server) {
        console.log('Socket server init');
    }

    @UseGuards(GatewayGuard)
    handleConnection(client: Socket, ...args: any[]) {
        console.log(`Client ${client.id} connected`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client ${client.id} disconnected`);
        this.GatewayService.removeOnlineUser(client.id);
        console.log('online users', this.GatewayService.onlineUsersList);
    }

    @UseGuards(GatewayGuard)
    @SubscribeMessage('join-app')
    onJoinApp(@MessageBody() data: any, @ConnectedSocket() client: GatewaySocket) {
        this.GatewayService.setOnlineUser = {
            id: client.user.id,
            socketId: client.id,
            username: client.user.username,
        };
        console.log('online users', this.GatewayService.onlineUsersList);
    }

    @UseGuards(GatewayGuard)
    @SubscribeMessage('like-post')
    async onLikePost(@MessageBody() data: ILikeData, @ConnectedSocket() client: GatewaySocket) {
        const notification = await this.GatewayService.getNotificationById(data.notificationId);
        if (!notification) return;
        const receiver = this.GatewayService.onlineUsersList.find((user) => user.id === notification.ownerId);
        if (receiver) this.server.to(receiver.socketId).emit('liked-post', notification);
    }
}
