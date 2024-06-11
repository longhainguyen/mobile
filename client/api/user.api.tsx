import request from '../config/request';
import mime from 'mime';
import { IUser } from '../type/User.type';

interface IRequestUpdateUser {
    username: string;
}

const updateUser = async (data: IRequestUpdateUser, idUser: string) => {
    return await request.patch(`/users/update-user/${idUser}`, data, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
};

interface IResponseUpdateAvatar {
    avatar: string;
}

const updateAvatar = async (avatar: string, idUser: string) => {
    const newImageUri = 'file:///' + avatar.split('file:/').join('');
    const image = {
        uri: newImageUri,
        type: mime.getType(newImageUri),
        name: newImageUri.split('/').pop(),
    };
    const formData = new FormData();
    formData.append('avatar', image);
    return await request.patch(`/profiles/update-avatar/${idUser}`, formData, {
        headers: {
            accept: 'application/json',
            'Content-Type': 'multipart/form-data',
        },
    });
};

const updateBg = async (bg: string, idUser: string) => {
    const newImageUri = 'file:///' + bg.split('file:/').join('');
    const image = {
        uri: newImageUri,
        type: mime.getType(newImageUri),
        name: newImageUri.split('/').pop(),
    };
    const formData = new FormData();
    formData.append('background', image);
    return await request.patch(`/profiles/update-background/${idUser}`, formData, {
        headers: {
            accept: 'application/json',
            'Content-Type': 'multipart/form-data',
        },
    });
};

const getUserById = async (idUser: string) => {
    return await request.get<IUser>(`/users/${idUser}`);
};

export { updateUser, updateAvatar, updateBg, getUserById };
