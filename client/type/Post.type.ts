import { IShared } from './ResultSearch.type';

export interface ItemItemProps {
    uri: string;
    id: string;
    type?: string;
    name?: string;
}

export interface IImage {
    uri: string;
    id: string;
    type?: string;
}

export interface IVideo {
    uri: string;
    id: string;
    type?: string;
}

export interface IFile {
    url: string;
    id: string;
}

export interface IPost {
    id: string;
    idUser: string;
    userName: string;
    isPublic: boolean;
    background: string;
    avartar: string;
    shares: IShared[];
    likes: number;
    comments: number;
    content: string;
    images: IFile[];
    videos: IFile[];
    isLiked: boolean;
    isFollowed: boolean;
    createdAt: string;
    origin?: IOrigin;
    mode: string;
    publicUsers: IPublicUser[];
}

export interface IPublicUser {
    id: number;
    username: string;
}

export interface IOrigin {
    id: number;
    caption: string;
    createdAt: string;
    images: IFile[];
    videos: IFile[];
    user: {
        id: number;
        username: string;
        createdAt: string;
        profile: {
            id: number;
            avatar: string;
            avatarPublicId: any;
            backgroundPublicId: any;
        };
    };
}
