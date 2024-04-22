export interface IUserInfor {
    email: string;
    username: string;
    password: string;
}

export interface ILogin {
    email: string;
    password: string;
}

export interface IUpdateUser {
    email?: string;
    username?: string;
    password?: string;
}

export interface IFindUser {
    keyword: string;
    limit?: number;
    page?: number;
}

export interface ICreateProfile {
    name: string;
    age: number;
    birthday: Date;
    avatar: string;
    background: string;
}

export interface ICreatePost {
    caption: string;
}

export interface IFollowUser {
    userId: number;
    followingId: number;
}
