import request from '../config/request';

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
    console.log(data);

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

export { postComment };
