import AsyncStorage from '@react-native-async-storage/async-storage';
import { Socket, io } from 'socket.io-client';
import { ISocketState } from '../../type/socket.type';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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

export const socketReducer = socketSlice.reducer;
export const socketActions = socketSlice.actions;
