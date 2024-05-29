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

    handleConnection(client: Socket, ...args: any[]) {
        console.log(`Client ${client.id} connected`);
        // console.log('Client', client.handshake.headers.authorization);
        // this.GatewayService.setOnlineUser = {
        //     id: client.id,
        //     username: 'Anonymous',
        //     socketId: client.id,
        // };
    }

    handleDisconnect(client: Socket) {
        console.log(`Client ${client.id} disconnected`);
    }

    @UseGuards(GatewayGuard)
    @SubscribeMessage('new-message')
    onNewMessage(@MessageBody() data: any, @ConnectedSocket() client: GatewaySocket) {
        console.log('user', client.user);
        client.broadcast.emit('incoming-message', data);
    }
}
