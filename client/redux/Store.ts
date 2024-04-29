import { createSlice, configureStore } from '@reduxjs/toolkit';
import stateCommentSlice from './stateComment/stateComment';
import stateUserSlice from './stateUser/stateUser';
import statePageSlice from './stateLoadMore/statePage';

export const store = configureStore({
    reducer: {
        reducer: stateCommentSlice.reducer,
        reducerUser: stateUserSlice.reducer,
        reducerLoadMore: statePageSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
