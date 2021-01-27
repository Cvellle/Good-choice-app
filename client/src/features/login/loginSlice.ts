import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import axios from 'axios'

interface User {
  id: number,
  email: string,
  role: string
}

const initialState: User = {
  id: 0,
  email: "",
  role: ""
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setLoggedUser: (state, action: PayloadAction<User>) => {
      const { email, role } = action.payload;
      state.email = email;
      state.role = role;
    },
    logOutUser: (state) => {
      state.email = "";
      state.role = "";
    },
    changeRole: (state, action: PayloadAction<User>) => {
      const { id, role } = action.payload;
      (state.role == "USER_BEGINNER") && (state.role = "USER_ADVANCED")

      axios.put("/api/datas", {
        id: { _id: id },
        update: {
          ...action.payload,
          role: role == "USER_BEGINNER" && "USER_ADVANCED"
        }
      });
    }
  },
});

export const { setLoggedUser, logOutUser, changeRole } = loginSlice.actions;

export const loggedUser = (state: RootState) => state.login;

export default loginSlice.reducer;
