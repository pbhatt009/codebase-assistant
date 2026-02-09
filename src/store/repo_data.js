import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    "repos": {
    }
}

const currRepoSlice = createSlice({
    name: "RepoData",
    initialState,
    reducers: {
        addRepo: (state, action) => {
            state.repos[action.payload.id] = action.payload;
        },

        getrepo:(state,action)=>{
            return state.repos[action.payload.id]

        },
    },
});

export const { addRepo,getrepo} = currRepoSlice.actions;
export default currRepoSlice.reducer;

// {
//     "id": 996912715,

//     "name": "Video-Sharing-Platform-Frontend",
   
//     "private": false,
//     "owner": {
//       "login": "pbhatt009",
     
//       "avatar_url": "https://avatars.githubusercontent.com/u/177448307?v=4",
      
//     },

//     "description": null,
    //   "score":
// }