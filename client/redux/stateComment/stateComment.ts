import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface CommentState {
    index: number;
}

const initialState: CommentState = {
    index: -1,
};

const stateCommentSlice = createSlice({
    name: 'state_comment',
    initialState,
    reducers: {
        decremented: (state) => {
            state.index -= 1;
        },
        setState: (state, action: PayloadAction<number>) => {
            state.index = action.payload;
        },
    },
});

export const { setState, decremented } = stateCommentSlice.actions;

export default stateCommentSlice;
