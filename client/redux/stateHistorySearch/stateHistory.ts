import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IHistorySearchItem } from '../../type/historySearch.type';

const initialState: IHistorySearchItem[] = [];

const stateHistorySlice = createSlice({
    name: 'history_state',
    initialState,
    reducers: {
        setStateHistorySearch: (historyItem, action: PayloadAction<IHistorySearchItem[]>) => {
            historyItem = action.payload;
        },
    },
});

export const { setStateHistorySearch } = stateHistorySlice.actions;

export default stateHistorySlice;
