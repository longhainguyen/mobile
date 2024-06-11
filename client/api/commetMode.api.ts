import request from '../config/request';

interface IUpdateCommentMode {
    id: number;
    caption: string;
    isPublic: boolean;
    createdAt: string;
}

const updateCommentMode = async (idPost: string) => {
    return await request.patch<IUpdateCommentMode>(`/posts/update-comment-mode/${idPost}`);
};

export { updateCommentMode };
