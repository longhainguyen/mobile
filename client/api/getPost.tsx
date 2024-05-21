import request from '../config/request';
import { IImage, IPost, IVideo } from '../type/Post.type';

const getDataById = async (_page: number, _limit: number, idUser: string, postList: IPost[]) => {
    try {
        const response = await request.get(
            `/posts/get-posts/${idUser}?limit=${_limit}&page=${_page}`,
        );
        var _postList: IPost[] = [];

        response.data.map((post: any) => {
            const _images: IImage[] = post.images.map((image: any) => {
                const _image: IImage = {
                    id: image.id,
                    uri: image.url,
                    type: 'image',
                };
                return _image;
            });

            const _videos: IVideo[] = post.videos.map((video: any) => {
                const _video: IVideo = {
                    id: video.id,
                    uri: video.url,
                    type: 'video',
                };
                return _video;
            });
            const _post: IPost = {
                id: post.id,
                content: post.caption,
                comments: post.commentCount,
                likes: post.likeCount,
                shares: post.shares,
                createAt: post.createdAt,
                avartar: post.user.profile.avatar,
                idUser: post.user.id,
                userName: post.user.username,
                images: _images,
                videos: _videos,
            };
            _postList.push(_post);
        });

        // console.log(_postList);
        // if(_postList.length == 0) {}

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

export { getDataById, likePost };
