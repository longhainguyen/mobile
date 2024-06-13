import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { INotifyItem, INotifyState } from '../../type/notify.type';
import request from '../../config/request';

const initialNotifyState: INotifyState = {
    isNotify: false,
    data: [],
};

export const fetchNotification = createAsyncThunk(
    'notify/fetchNotification',
    async (userId: any) => {
        const response = await request.get<INotifyItem[]>(`users/notifications/${userId}`);
        return response.data;
    },
);

export const notifySlice = createSlice({
    name: 'notify',
    initialState: initialNotifyState,
    reducers: {
        setNotify: (state, action: PayloadAction<INotifyItem[]>) => {
            state.data = action.payload;
        },
        addNotify: (state, action: PayloadAction<INotifyItem>) => {
            state.data.unshift(action.payload);
        },
        removeNotify: (state, action: PayloadAction<number>) => {
            state.data = state.data.filter((item) => item.id !== action.payload);
        },
        readNotify: (state, action: PayloadAction<number>) => {
            state.data = state.data.map((item) =>
                item.id === action.payload ? { ...item, isReaded: true } : item,
            );
        },
        setNotifyStatus: (state, action: PayloadAction<boolean>) => {
            state.isNotify = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchNotification.fulfilled, (state, action) => {
            console.log('fetchNotification.fulfilled', action.payload);
            state.data = action.payload;
        });
    },
});

export const notifyAction = notifySlice.actions;
