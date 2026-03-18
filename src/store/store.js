import { configureStore } from "@reduxjs/toolkit";
import currRepoReducer from "./curr_repo";
import repoDataReducer from "./repo_data";
import threadsReducer from "./threads";

export const store = configureStore({
  reducer: {
    currRepo: currRepoReducer,
    repoData: repoDataReducer,
    threads: threadsReducer,
 
  },
});

// Types for TS
