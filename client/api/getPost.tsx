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

        if (_page === 0) {
            return _postList;
        } else {
            return postList.concat(_postList);
        }

        return _postList;
    } catch (error) {
        console.log(error);
    }
};

export { getDataById };
