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
    background: string;
    avartar: string;
    shares: string[];
    likes: number;
    comments: number;
    content: string;
    images: IFile[];
    videos: IFile[];
    isLiked: boolean;
    isFollowed: boolean;
    createdAt: string;
    origin?: IOrigin;
}

interface IOrigin {
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
