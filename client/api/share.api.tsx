import request from '../config/request';

interface IResquestSharePost {
    originId: string;
    caption: string;
}

interface IResponseSharePost {
    data: {
        caption: string;
        origin: {
            id: number;
            caption: string;
            createdAt: string;
        };
        user: {
            id: number;
            username: string;
            createAt: string;
        };
        id: number;
        createdAt: string;
        message?: string;
    };

    status: number;
}
const sharePost = async (data: IResquestSharePost, idUser: string) => {
    var _response: IResponseSharePost = {
        data: {
            caption: '',
            createdAt: '',
            id: -1,
            origin: {
                caption: '',
                createdAt: '',
                id: -1,
            },
            user: {
                createAt: '',
                id: -1,
                username: '',
            },
            message: '',
        },
        status: -1,
    };

    await request
        .post<IResponseSharePost>(`/posts/share-post/${idUser}`, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        .then((response) => {
            _response = response.data;
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

export { sharePost };
