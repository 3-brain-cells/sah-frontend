import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CounterState = {
    value: number;
};

const initialState: CounterState = {
    value: 0,
};

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state, action: PayloadAction<number>) => {
            // eslint-disable-next-line no-param-reassign
            state.value += action.payload;
        },
        decrement: (state, action: PayloadAction<number>) => {
            // eslint-disable-next-line no-param-reassign
            state.value -= action.payload;
        },
    },
});

export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;
