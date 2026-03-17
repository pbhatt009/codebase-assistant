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
        clear_threads: (state) => {
            state.threads = [];
        }
    },
});

export const { setThreads, addThread, clear_threads } = threadsSlice.actions;
export default threadsSlice.reducer;