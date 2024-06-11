import request from '../config/request';

interface IRequestDeletePost {
    userId: number;
}

const deletePost = async (data: IRequestDeletePost, idPost: string) => {
    return await request.delete(`/posts/delete-post/${idPost}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        data: data,
    });
};

export { deletePost };
