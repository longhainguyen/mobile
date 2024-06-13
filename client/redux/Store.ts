import { createSlice, configureStore } from '@reduxjs/toolkit';
import stateCommentSlice from './stateComment/stateComment';
import stateUserSlice from './stateUser/stateUser';
import statePageSlice from './stateLoadMore/statePage';
import stateHistorySlice from './stateHistorySearch/stateHistory';
import { socketSlice } from './socket/socket.slice';
import { notifySlice } from './notify/notify.slice';

export const store = configureStore({
    reducer: {
        reducer: stateCommentSlice.reducer,
        reducerUser: stateUserSlice.reducer,
        reducerLoadMore: statePageSlice.reducer,
        reducerHistorySearch: stateHistorySlice.reducer,
        socketReducer: socketSlice.reducer,
        notifyReducer: notifySlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
