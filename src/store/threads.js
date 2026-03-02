import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    threads:[]
}

const threadsSlice = createSlice({
    name: "threads",
    initialState,
    reducers: {
        setThreads: (state, action) => {
            state.threads = action.payload;
        },
        addThread: (state, action) => {
            state.threads.push(action.payload);
        },
    },
});

export const { setThreads, addThread } = threadsSlice.actions;
export default threadsSlice.reducer;