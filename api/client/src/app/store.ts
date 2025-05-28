import { configureStore, type ThunkAction } from '@reduxjs/toolkit';

import { combineReducers, type Action } from "redux";
import { persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage'; 
import loginReducer from '../features/login/loginSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';

import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

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
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<any>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
