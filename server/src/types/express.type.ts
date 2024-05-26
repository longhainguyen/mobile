import { Request as _Request } from 'express';

export type Request = _Request & {
    user: {
        id: number;
        username: string;
    };
};
