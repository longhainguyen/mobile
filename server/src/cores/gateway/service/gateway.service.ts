import { IOnlineUser } from '@interfaces/gateway.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GatewayService {
    private onlineUsers: IOnlineUser[] = [];

    get onlineUsersList(): IOnlineUser[] {
        return this.onlineUsers;
    }

    set setOnlineUser(user: IOnlineUser) {
        this.onlineUsers.push(user);
    }
}
