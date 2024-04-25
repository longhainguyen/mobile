interface IUser {
    id: string;
    username: string;
    email: string;
    isLoggedIn: boolean;
    profile: {
        age?: number;
        birthday?: Date;
        avatar: string;
        background: string;
    };
}
export { IUser };
