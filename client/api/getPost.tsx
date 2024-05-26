import request from '../config/request';
import { IFile, IImage, IPost, IVideo } from '../type/Post.type';

export interface IPostHome {
    id: number;
    caption: string;
    createdAt: string;
    images: IFile[];
    videos: IFile[];
    user: {
        id: number;
        username: string;
        createdAt: string;
        profile: {
            id: number;
            avatar: string;
            background: string;
            avatarPublicId: any;
            backgroundPublicId: any;
        };
    };
    shareds: [];
    origin: {
        id: number;
        caption: string;
        createdAt: string;
        images: IFile[];
        videos: IFile[];
        user: {
            id: number;
            username: string;
            createdAt: string;
            profile: {
                id: number;
                avatar: string;
                avatarPublicId: any;
                backgroundPublicId: any;
            };
        };
    };

    likeCount: number;
    commentCount: number;
    isLiked: boolean;
    isFollowed: boolean;
}
interface IResponseGetPostHome {
    data: IPostHome[];
    message?: string;
    status: number;
}

const getPostHome = async (idUser: string, limit: number, page: number) => {
    var _response: IResponseGetPostHome = {
        data: [],
        status: 0,
        message: '',
    };
    await request
        .get(`/posts/get-posts`, {
            params: {
                limit: limit,
                page: page,
            },
        })
        .then((response) => {
            _response.data = response.data;
            _response.status = response.status;
        })
        .catch((e) => {
            if (e.response) {
                _response = e.response.data;
                _response.status = e.response.status;
            }
        });

    return _response;
};

const getDataById = async (_page: number, _limit: number, idUser: string, postList: IPost[]) => {
    try {
        var _response: IResponseGetPostHome = {
            data: [],
            status: 0,
            message: '',
        };
        await request
            .get(`/posts/get-posts-by-id/${idUser}?limit=${_limit}&page=${_page}`)
            .then((response) => {
                _response.data = response.data;
                _response.status = response.status;
            })
            .catch((e) => {
                if (e.response) {
                    _response = e.response.data;
                    _response.status = e.response.status;
                }
            });
        var _postList: IPost[] = [];
        _response.data.map((post) => {
            _postList.push({
                avartar: post.user.profile.avatar,
                comments: post.commentCount,
                content: post.caption,
                id: post.id + '',
                idUser: post.user.id + '',
                images: post.images,
                isFollowed: post.isFollowed,
                isLiked: post.isLiked,
                likes: post.likeCount,
                shares: post.shareds,
                userName: post.user.username,
                videos: post.videos,
                createdAt: post.createdAt,
                origin: post.origin,
                background: post.user.profile.background,
            });
        });

        if (_page === 0) {
            return _postList;
        } else {
            return postList.concat(_postList);
        }
    } catch (error) {
        console.log(error);
    }
};

interface ILikePost {
    postId: number;
    userId: number;
}
interface IResponseLikePost {
    status: number;
}

const likePost = async (data: ILikePost) => {
    var _response: IResponseLikePost = {
        status: 0,
    };

    await request
        .post<IResponseLikePost>(`/posts/like-post/${data.postId}`, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        .then((response) => {
            _response.status = response.status;
        })
        .catch((e) => {
            if (e.response) {
                _response.status = e.response.status;
            }
        });
    return _response;
};

export { getDataById, likePost, getPostHome };
