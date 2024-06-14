import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../type/User.type';

const initialState: IUser[] = [];

const selectedUserSlice = createSlice({
    name: 'selectedUser',
    initialState,
    reducers: {
        setStateSelectedUsers: (users, action: PayloadAction<IUser[]>) => {
            users = action.payload;
        },

        pushStateSelectedUser: (users, action: PayloadAction<IUser>) => {
            users.push(action.payload);
        },

        deletedStateSelectedUserById: (users, action: PayloadAction<IUser>) => {
            users = users.filter((users) => users.id !== action.payload.id);
        },
    },
});

export const { setStateSelectedUsers, pushStateSelectedUser, deletedStateSelectedUserById } =
    selectedUserSlice.actions;

export default selectedUserSlice;
