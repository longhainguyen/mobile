import AsyncStorage from '@react-native-async-storage/async-storage';
import { Socket, io } from 'socket.io-client';
import { ILikeSocket, ISocketState } from '../../type/socket.type';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { INotifyItem, OnLikedPostCallBack } from '../../type/notify.type';
const baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.106:3000';
const socket: Socket = io(baseURL, {
    autoConnect: false,
});

const initialSocketState: ISocketState = {
    socket: socket,
    isConnected: false,
};

export const connectSocket = createAsyncThunk('socket/fetchAccessToken', async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    return accessToken;
});

export const socketSlice = createSlice({
    name: 'socket',
    initialState: initialSocketState,
    reducers: {
        onJoinApp(state) {
            state.socket.emit('join-app');
        },
        onLikePost(state, action: PayloadAction<ILikeSocket>) {
            state.socket.emit('like-post', action.payload);
        },
        onLikedPost(state, action: PayloadAction<OnLikedPostCallBack>) {
            state.socket.on('liked-post', (data: INotifyItem) => {
                action.payload(data);
            });
        },
        offLikedPost(state) {
            state.socket.off('liked-post');
        },
        disconnectSocket(state) {
            state.socket.disconnect();
            state.isConnected = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(connectSocket.fulfilled, (state, action) => {
            if (action.payload) {
                state.socket.io.opts.extraHeaders = {
                    Authorization: `Bearer ${action.payload}`,
                };
                state.socket.connect();
                state.isConnected = true;
            }
        });
    },
});

export const socketActions = socketSlice.actions;
