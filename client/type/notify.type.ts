export interface INotifyItem {
    id: number;
    type: string;
    ownerId: number;
    isReaded: boolean;
    createdAt: string;
    postId: number;
    user: {
        id: number;
        username: string;
        profile: {
            id: number;
            avatar: string;
            background: string;
        };
    };
}

export interface INotifyState {
    isNotify: boolean;
    data: INotifyItem[];
}

export type OnLikedPostCallBack = (notification: INotifyItem) => void;
