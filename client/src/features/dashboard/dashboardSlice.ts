import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../app/store';
import axios from 'axios'
import { useSelector } from 'react-redux';

interface IAdvice {
  id: number,
  creator: string,
  name: string,
  location: string
  category: string
  likes: string[]
}

type advicesState = IAdvice[]

const initialState = {
  currentUser: "",
  advices: [
    {
      id: 3,
      creator: "nikolacvetic86@gmail.com",
      name: "Cheap bicycle parts",
      location: "Ivankovačka 16",
      category: "sport, bicycle, hobby",
      likes: []
    },
    {
      id: 2,
      creator: "nikolacvetic86@gmail.com",
      name: "Good takeaway pasta",
      location: "Kraljice Marije 12",
      category: "food",
      likes: []
    },
    {
      id: 4,
      creator: "nikolacvetic86@gmail.com",
      name: "Natural sports creams - Mala ruska apoteka",
      location: "Goldsvordijeva 3",
      category: "health, sport",
      likes: []
    },
    {
      id: 5,
      creator: "nikolacvetic86@gmail.com",
      name: "Cheap takeway coffee - Caffe Boulevard",
      location: "Bulevar Kralja Aleksandra 103",
      category: "lifestyle, food, free time",
      likes: []
    },
    {
      id: 6,
      creator: "nikolacvetic86@gmail.com",
      name: "Cheap bicycle parts",
      location: "Ivankovačka 16",
      category: "sport, bicycle, hobby",
      likes: []
    },
    {
      id: 1,
      creator: "nikolacvetic86@gmail.com",
      name: "Cheap bicycle parts",
      location: "Ivankovačka 16",
      category: "sport, bicycle, hobby",
      likes: []
    },
  ] as advicesState,
  filterAdvices: [] as advicesState,
  chatReduxState: false
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<advicesState>) => {
      return {
        ...state,
        filterAdvices: action.payload,
        advices: action.payload
      };
    },
    setCurrentUser: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        currentUser: action.payload
      };
    },
    categoryAdvicesAction: (state, action: PayloadAction<string>) => {
      const filteredByCategory = state.filterAdvices.filter((el) => {
        return el.category.includes(action.payload)
      })
      return {
        ...state,
        advices: filteredByCategory
      };
    },
    filterAdvicesAction: (state, action: PayloadAction<string>) => {
      let filteredItems = state.filterAdvices.filter((el) => {
        return el.name.toLowerCase().includes(action.payload) ||
          el.location.toLowerCase().includes(action.payload) ||
          el.category.toLowerCase().includes(action.payload)
      })
      return {
        ...state,
        advices: filteredItems
      };
    },
    likeAction: (state, action: PayloadAction<IAdvice>) => {
      const { id, likes } = action.payload;
      let newLikes = likes;
      !likes.includes(state.currentUser) ?
        (newLikes = likes.concat(state.currentUser))
        : (newLikes = likes.filter((el) => el !== state.currentUser))
      axios.put("/api/advices", {
        id: { id: id },
        update: {
          ...action.payload,
          likes: newLikes
        }
      });
      const editedLikesAdvices: IAdvice[] = state.advices.map((advice) => {
        return (advice.id === action.payload.id ? { ...action.payload, likes: newLikes } : advice)
      }
      );
      return {
        ...state,
        advices: editedLikesAdvices,
      };
    },
    addItems: (state, action: PayloadAction<IAdvice>) => {
      const { id, creator, name, location, category, likes } = action.payload;
      axios.post("/api/advices", {
        id: id,
        creator: creator,
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

export const { setItems, setCurrentUser, filterAdvicesAction, categoryAdvicesAction, likeAction, addItems } = dashboardSlice.actions;

export const advicesState = (state: RootState) => state.dashboard;
export const chatReduxState = (state: RootState) => state.dashboard;

export default dashboardSlice.reducer;
