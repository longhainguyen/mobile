export interface ItemItemProps {
    uri: string;
    id: string;
    type: string;
    name: string;
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

export interface IPost {
    id: string;
    idUser: string;
    userName: string;
    avartar: string;
    shares: string[];
    likes: number;
    comments: number;
    createAt: string;
    content: string;
    images: IImage[];
    videos: IVideo[];
}
