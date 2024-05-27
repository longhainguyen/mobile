import request from '../config/request';

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

export { updateUser };
