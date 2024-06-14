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

const updatePost = async (formData: FormData, idPost: string) => {
    console.log(formData);

    return await request.patch(`/posts/update-post/${idPost}`, formData, {
        headers: {
            accept: 'application/json',
            'Content-Type': 'multipart/form-data',
        },
    });
};

export { deletePost, updatePost };
