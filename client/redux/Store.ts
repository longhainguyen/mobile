import { createSlice, configureStore } from '@reduxjs/toolkit';
import stateCommentSlice from './stateComment/stateComment';
import stateUserSlice from './stateUser/stateUser';

export const store = configureStore({
    reducer: {
        reducer: stateCommentSlice.reducer,
        reducerUser: stateUserSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
