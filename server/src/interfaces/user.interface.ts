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
    images?: string[];
    videos?: string[];
}

export interface ICreateFormDataPost {
    caption: string;
    checkin?: string;
    images?: Express.Multer.File[];
    videos?: Express.Multer.File[];
    commentMode: {
        mode: string;
        visibleUsers?: number[];
    };
}

export interface IFollowUser {
    userId: number;
    followingId: number;
}

export interface IChangePassword {
    oldPassword: string;
    newPassword: string;
}
