import { configureStore } from "@reduxjs/toolkit";
import currRepoReducer from "./curr_repo";
import repoDataReducer from "./repo_data";
export const store = configureStore({
  reducer: {
    currRepo: currRepoReducer,
    repoData: repoDataReducer,
  },
});

// Types for TS
