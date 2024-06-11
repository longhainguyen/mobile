import request from '../config/request';
import { IComment } from '../type/Comment.type';

interface IPostComment {
    postId: string;
    content: string;
    userId: number;
    parentId: number;
}

interface IResponsePostComment {
    content: string;
    post: {
        id: number;
        caption: string;
        createdAt: string;
    };
    user: {
        id: number;
        username: string;
        createdAt: string;
    };
    message?: string;
    id: number;
    createdAt: string;

    status: number;
}

const postComment = async (data: IPostComment) => {
    var _resopnse: IResponsePostComment = {
        content: '',
        post: {
            caption: '',
            createdAt: '',
            id: -1,
        },
        user: {
            createdAt: '',
            id: -1,
            username: '',
        },
        message: '',
        createdAt: '',
        id: -1,

        status: 0,
    };

    await request
        .post<IResponsePostComment>(`/posts/comment-post/${data.postId}`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            // console.log(response.data.content);

            _resopnse = response.data;
            _resopnse.status = response.status;
        })
        .catch((e) => {
            if (e.response) {
                _resopnse = e.response.data;
                _resopnse.status = e.response.status;
            }
        });
    return _resopnse;
};

const getComment = async (idPost: string, limit?: number, page?: number) => {
    return await request.get<IComment[]>(`/posts/get-comments/${idPost}`, {
        params: {
            limit,
            page,
        },
    });
};

const adjustCommentApi = async (
    idPost: string,
    content: string,
    userId: number,
    commentId: number,
) => {
    return await request.patch(
        `/posts/update-comment-post/${idPost}`,
        {
            content: content,
            userId: userId,
            commentId: commentId,
        },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
};

export { postComment, getComment, adjustCommentApi };
