import { createSlice } from "@reduxjs/toolkit";

const requestsSlice = createSlice({
    name: 'requests',
    initialState: null,
    reducers: {
        addrequest: (state, action) => {
            return action.payload;
        },
        removerequest: (state, action) => {
            const newArray = state.filter(r => r._id !== action.payload);
            return newArray;
        },
    },
});

export const {addrequest, removerequest} = requestsSlice.actions;
export default requestsSlice.reducer;