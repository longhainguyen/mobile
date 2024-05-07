import request from '../config/request';

interface IPostComment {
    postId: string;
    content: string;
    userId: number;
    parentId: number;
}

interface IResponsePostComment {
    data: {
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
    };
    id: number;
    createdAt: number;
    status: number;
}

const postComment = async (data: IPostComment) => {
    console.log(data);

    await request
        .post<IResponsePostComment>(`/posts/comment-post/${data.postId}`)
        .then((response) => {
            console.log(response.data);
        })
        .catch((e) => {
            if (e.response) {
                console.log(e.response.data);
            }
        });
};

export { postComment };
