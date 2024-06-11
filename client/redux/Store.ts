import { createSlice, configureStore } from '@reduxjs/toolkit';
import stateCommentSlice from './stateComment/stateComment';
import stateUserSlice from './stateUser/stateUser';
import statePageSlice from './stateLoadMore/statePage';
import stateHistorySlice from './stateHistorySearch/stateHistory';

export const store = configureStore({
    reducer: {
        reducer: stateCommentSlice.reducer,
        reducerUser: stateUserSlice.reducer,
        reducerLoadMore: statePageSlice.reducer,
        reducerHistorySearch: stateHistorySlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
