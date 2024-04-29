import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface PageState {
    index: number;
}

const initialState: PageState = {
    index: 0,
};

const statePageSlice = createSlice({
    name: 'state_page',
    initialState,
    reducers: {
        incremented: (state) => {
            state.index += 1;
        },
        setState: (state, action: PayloadAction<number>) => {
            state.index = action.payload;
        },
    },
});

export const { setState, incremented } = statePageSlice.actions;

export default statePageSlice;
