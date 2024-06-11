import { IUser } from './User.type';

interface IComment {
    id: number;
    content: string;
    createdAt: string;
    user: IUser;
    childrens: IComment[];
}

export { IComment };
