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
        clear_curr_repo: (state) => {
            state.repo_info = {};
            state.tree = [];
        }
    },
});

export const { curr_repo_info, addTree ,clear_curr_repo} = currRepoSlice.actions;
export default currRepoSlice.reducer;