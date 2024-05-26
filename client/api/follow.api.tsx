import request from '../config/request';

interface IRequestFollow {
    userId: number;
    followingId: number;
}

const followUser = async (data: IRequestFollow) => {
    return await request.post('/users/follow-user', data, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

const unFollowUser = async (data: IRequestFollow) => {
    return await request.post('/users/unfollow-user', data, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export { followUser, unFollowUser };
