import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: "feed",
    initialState: {
        users: [],
        currentPage: 1,
        hasMore: true,
        isLoading: false
    },
    reducers: {
        addFeed: (state, action) => {
            // Replace all users (for initial load)
            state.users = action.payload;
            state.currentPage = 1;
            state.hasMore = action.payload.length === 10; // Assume more if we got 10 users
        },
        appendFeed: (state, action) => {
            // Append new users (for pagination)
            state.users = [...state.users, ...action.payload];
            state.currentPage += 1;
            state.hasMore = action.payload.length === 10; // Assume more if we got 10 users
        },
        removeuserfromFeed: (state, action) => {
            state.users = state.users.filter((user) => user._id !== action.payload);
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        resetFeed: (state) => {
            state.users = [];
            state.currentPage = 1;
            state.hasMore = true;
            state.isLoading = false;
        }
    },
});

export const {addFeed, appendFeed, removeuserfromFeed, setLoading, resetFeed} = feedSlice.actions;
export default feedSlice.reducer;