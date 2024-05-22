import request from '../config/request';

interface ILogin {
    email: string;
    password: string;
}

interface IFollow {
    id: number;
    username: string;
    createdAt: string;
}

interface IResponseLogin {
    id: number;
    username: string;
    email: string;
    profile: {
        id: number;
        avatar: string;
    };

    posts: [];
    flolowers: IFollow[];
    followings: IFollow[];
    message?: string;
    status: number;
}

const loginApi = async (data: ILogin) => {
    var _response: IResponseLogin = {
        email: '',
        flolowers: [],
        followings: [],
        id: -1,
        posts: [],
        profile: {
            avatar: '',
            id: -1,
        },
        username: '',
        status: 0,
        message: '',
    };

    await request
        .post<IResponseLogin>('/auth/login', data, {
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
