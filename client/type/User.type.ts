interface IUser {
    id: string;
    username: string;
    email: string;
    isLoggedIn?: boolean;
    profile: {
        phoneNumber?: string;
        address?: string;
        age?: number;
        birthday?: Date;
        avatar: string;
        background: string;
    };

    followers?: IFollower[];
    followings?: IFollower[];
}

interface IFollower {
    id: number;
    username: string;
}
export { IUser, IFollower };
