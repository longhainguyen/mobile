import request from '../config/request';

interface ILogin {
    email: string;
    password: string;
}

interface IPost {
    id: number;
    caption: string;
    createdAt: string;
}

interface IFollower {
    id: number;
    username: string;
    createdAt: string;
}

interface IResponseLogin {
    user: {
        id: number;
        username: string;
        email: string;
        profile: {
            id: number;
            avatar: string;
            background: string;
        };
        post: IPost[];
        followers: IFollower[];
        followings: [];
    };
    refreshToken: string;
    accessToken: string;
}

const loginApi = async (data: ILogin) => {
    return await request.post<IResponseLogin>('/auth/login', data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
};

interface IRegister {
    email: string;
    password: string;
    username: string;
}

interface IResponseRegister {
    username: string;
    email: string;
    profile: {
        age: number;
        birthday: string;
        id: number;
        avatar: string;
        background: string;
    };
    id: number;
    createdAt: string;
    status: number;
    message?: string;
}

const registerApi = async (data: IRegister) => {
    var _response: IResponseRegister = {
        createdAt: '',
        email: '',
        id: -1,
        profile: {
            age: -1,
            avatar: '',
            background: '',
            birthday: '',
            id: 1,
        },
        username: '',
        status: 0,
        message: '',
    };
    await request
        .post<IResponseRegister>('/auth/register', data, {
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

export { loginApi, registerApi };
