import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../type/User.type';

interface UserState extends Omit<IUser, 'isLoggedIn'> {
    profile: Omit<IUser['profile'], 'birthday'>;
}

const initialState: UserState = {
    email: '',
    id: '',
    username: '',
    profile: {
        avatar: '',
        background: '',
        age: -1,
        address: '',
        phoneNumber: '',
    },
};

const stateUserSlice = createSlice({
    name: 'user_state',
    initialState,
    reducers: {
        setStateUser: (user, action: PayloadAction<UserState>) => {
            (user.username = action.payload.username),
                (user.email = action.payload.email),
                (user.id = action.payload.id),
                (user.profile = action.payload.profile);
        },
    },
});

export const { setStateUser } = stateUserSlice.actions;

export default stateUserSlice;
