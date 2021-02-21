import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import axios from 'axios'

interface User {
  id: number,
  email: string,
  firstName: string,
  lastName: string,
  role: string,
  image: string
}

const initialState: User = {
  id: 0,
  email: "",
  firstName: "",
  lastName: "",
  role: "",
  image: " "
};

let usersCollection = "datas"

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setLoggedUser: (state, action: PayloadAction<User>) => {
      const { email, firstName, lastName, role, image } = action.payload;
      return {
        ...state,
        firstName: firstName,
        lastName: lastName,
        email: email,
        role: role,
        image: image
      }
    },
    logOutUser: (state) => {
      return {
        ...state,
        image: "",
        role: ""
      }
    },
    changeRole: (state, action: PayloadAction<User>) => {
      const { email, role } = action.payload;
      (state.role == "USER_BEGINNER") && (state.role = "USER_ADVANCED")

      axios.put(`/api/${usersCollection}`, {
        email: { email: email },
        update: {
          ...action.payload,
          role: role === "USER_BEGINNER" ? "USER_ADVANCED" :
            (role === "USER_ADVANCED" ? "USER_ADVANCED" : "ADMIN")
        }
      });
    }
  },
});

export const { setLoggedUser, logOutUser, changeRole } = loginSlice.actions;

export const loggedUser = (state: RootState) => state.login;

export default loginSlice.reducer;
