import { IFile, IOrigin } from './Post.type';
import { IUser } from './User.type';

export interface IPostOfSearch {
    id: number;
    caption: string;
    isPublic: boolean;
    createdAt: string;
    images: IFile[];
    videos: IFile[];
    user: IUser;
    shareds: IShared[];
    origin: IOrigin;
    publicUsers: [];
    likeCount: number;
    commentCount: number;
    isLiked: boolean;
    isFollowed: boolean;
}

export interface IShared {
    id: number;
    caption: string;
    isPublic: boolean;
    createdAt: string;
}

export interface IResultSearch {
    users: IUser[];
    posts: IPostOfSearch[];
}
