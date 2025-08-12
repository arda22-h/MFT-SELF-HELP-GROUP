import { configureStore } from '@reduxjs/toolkit';
import styleReducer from './styleSlice';
import mainReducer from './mainSlice';
import authSlice from './authSlice';

import usersSlice from "./users/usersSlice";
import bank_accountsSlice from "./bank_accounts/bank_accountsSlice";
import contributionsSlice from "./contributions/contributionsSlice";
import documentsSlice from "./documents/documentsSlice";
import expensesSlice from "./expenses/expensesSlice";
import finesSlice from "./fines/finesSlice";
import lettersSlice from "./letters/lettersSlice";
import loansSlice from "./loans/loansSlice";
import membersSlice from "./members/membersSlice";
import projectsSlice from "./projects/projectsSlice";
import welfare_contributionsSlice from "./welfare_contributions/welfare_contributionsSlice";

export const store = configureStore({
  reducer: {
    style: styleReducer,
    main: mainReducer,
    auth: authSlice,

users: usersSlice,
bank_accounts: bank_accountsSlice,
contributions: contributionsSlice,
documents: documentsSlice,
expenses: expensesSlice,
fines: finesSlice,
letters: lettersSlice,
loans: loansSlice,
members: membersSlice,
projects: projectsSlice,
welfare_contributions: welfare_contributionsSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
