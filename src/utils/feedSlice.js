import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: "feed",
    initialState: [],
    reducers: {
        addFeed:(state, action) => {
            return action.payload;
        },
        removeuserfromFeed: (state, action) => {
            const newFeed = state.filter((user) => user._id !== action.payload);
            return newFeed;
        },
    },
});

export const {addFeed, removeuserfromFeed} = feedSlice.actions;
export default feedSlice.reducer;