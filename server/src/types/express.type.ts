import { Request as _Request } from 'express';
import { Socket as _Socket } from 'socket.io';
export type Request = _Request & {
    user: {
        id: number;
        username: string;
    };
};

export type Socket = _Socket & {
    user: {
        id: number;
        username: string;
        iat: number;
        exp: number;
    };
};
