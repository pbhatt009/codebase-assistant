import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    "repo_info":{},
    "tree": [],
}

const currRepoSlice = createSlice({
    name: "currRepo",
    initialState,
    reducers: {
        curr_repo_info: (state, action) => {
            state.repo_info = action.payload;
        },
        addTree: (state, action) => {
            state.tree = action.payload;
        },
    },
});

export const { curr_repo_info, addTree } = currRepoSlice.actions;
export default currRepoSlice.reducer;