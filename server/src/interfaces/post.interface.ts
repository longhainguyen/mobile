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

export interface IUpdatePost {
    userId: number;
    postId: number;
    caption: string;
    checkin?: string;
    images?: Express.Multer.File[];
    videos?: Express.Multer.File[];
    deleted: {
        images?: number[];
        videos?: number[];
    };
    commentMode?: {
        mode: string;
        visibleUsers?: number[];
    };
}

export interface IUpdateCommentPost {
    userId: number;
    postId: number;
    content: string;
    commentId: number;
}

export interface IDeleteCommentPost {
    userId: number;
    postId: number;
    commentId: number;
    isParent: boolean;
}

export interface ISharePost {
    originId: number;
    caption: string;
}

export interface IDeletePost {
    userId: number;
    postId: number;
}

export interface ICanSeePost {
    userId: number;
    postId: number;
    visibleUsers: number[];
}
