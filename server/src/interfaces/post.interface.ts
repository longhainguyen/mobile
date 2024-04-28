export interface IGetPost {
    limit?: number;
    page?: number;
}

export interface ILikePost {
    userId: number;
    postId: number;
}

export interface ICommentPost {
    userId: number;
    postId: number;
    content: string;
    parentId: number;
}

export interface ISharePost {
    originId: number;
    caption: string;
}
