import { Socket } from 'socket.io-client';

export interface ISocketState {
    socket: Socket;
    isConnected: boolean;
}
