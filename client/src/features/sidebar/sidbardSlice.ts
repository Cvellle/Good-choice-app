import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../app/store';
import axios from 'axios'

interface IAdvice {
  id: number,
  name: string,
  location: string
  category: string
  likes: number
}

type advicesState = IAdvice[]

const initialState = {
  advices: [] as advicesState
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<advicesState>) => {
      return {
        ...state,
        advices: action.payload
      };
    },
    LikeAction: (state, action: PayloadAction<IAdvice>) => {
      const { id } = action.payload;
      let newLikes = action.payload.likes + 1;
      axios.put("/api/advices", {
        id: { id: id },
        update: {
          ...action.payload,
          likes: newLikes
        }
      });
      const editedLikesAdvices: IAdvice[] = state.advices.map((advice) =>
        advice.id === action.payload.id ? { ...action.payload, likes: newLikes } : advice
      );
      return {
        ...state,
        advices: editedLikesAdvices,
      };
    },
    addItems: (state, action: PayloadAction<IAdvice>) => {
      const { id, name, location, category, likes } = action.payload;
      axios.post("/api/advices", {
        id: id,
        name: name,
        location: location,
        category: category,
        likes: likes,
      });
      let newItem = action.payload;
      return {
        ...state,
        advices: state.advices.concat(newItem),
      };
    },
  },
});

export const initialLoadItems = (): AppThunk => (dispatch) => {
  axios.get('api/advices')
    .then((response) => {
      dispatch(setItems(response.data))
    })
};

export const { setItems, LikeAction, addItems } = dashboardSlice.actions;

export const advicesStateArray = (state: RootState) => state.dashboard;

export default dashboardSlice.reducer;
