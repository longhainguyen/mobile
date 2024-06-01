import { IFile, IOrigin } from './Post.type';
import { IUser } from './User.type';

export interface IPostOfSearch {
    id: number;
    caption: string;
    isPulich: string;
    createdAt: string;
    images: IFile[];
    videos: IFile[];
    users: IUser;
    shares: [];
    origin: IOrigin;
    publicUsers: [];
    likeCount: number;
    commentCount: number;
    isLiked: boolean;
    isFollowed: boolean;
}

export interface IResultSearch {
    users: IUser[];
    posts: IPostOfSearch[];
}
