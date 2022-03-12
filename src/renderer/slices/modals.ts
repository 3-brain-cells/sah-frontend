import { combineReducers, createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ShowModalState = {
    isOpen: boolean;
};

const initialState: ShowModalState = {
    isOpen: false,
};

const aboutSlice = createSlice({
    name: 'aboutModal',
    initialState,
    reducers: {
        setShowAboutModal: (state, action: PayloadAction<boolean>) => {
            state.isOpen = action.payload;
        },
    },
});

const modalReducers = combineReducers({
    aboutSlice: aboutSlice.reducer,
});

export const { setShowAboutModal } = aboutSlice.actions;
export default modalReducers;
