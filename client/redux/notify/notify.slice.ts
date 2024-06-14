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

export const readNotification = createAsyncThunk(
    'notify/readNotification',
    async ({ notifyId, userId }: { notifyId: number; userId: string }) => {
        const response = await request.patch(`users/notifications/read/${notifyId}`, {
            userId,
        });
        return { notifyId };
    },
);

export const notifySlice = createSlice({
    name: 'notify',
    initialState: initialNotifyState,
    reducers: {
        addNotify: (state, action: PayloadAction<INotifyItem>) => {
            state.isNotify = true;
            state.data.unshift(action.payload);
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
            const isNotReaded = action.payload.some((item) => !item.isReaded);
            if (isNotReaded) {
                state.isNotify = true;
            }
        });
        builder.addCase(readNotification.fulfilled, (state, action) => {
            state.data = state.data.map((item) =>
                item.id === action.payload.notifyId ? { ...item, isReaded: true } : item,
            );
        });
    },
});

export const notifyAction = notifySlice.actions;
