import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";

import loginReducer from '../features/login/loginSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';



const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['login', 'dashboard'],
};

const rootReducer = combineReducers({
  dashboard: dashboardReducer,
  login: loginReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
