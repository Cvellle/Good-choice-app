import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import useReactRouter from 'use-react-router';

import {
  addItems
} from './dashboardSlice';
import {
  loggedUser,
} from '../login/loginSlice';

interface IAdvice {
  id: number,
  creator: string,
  name: string,
  location: string
  category: string
  likes: string[]
}

type Props = {
  saveAdvice: (advice: IAdvice) => void;
};

export const AddItems: React.FC<Props> = ({ saveAdvice }) => {
  const dispatch = useDispatch();
  const loggedUserSelector = useSelector(loggedUser);

  const { history } = useReactRouter()

  useEffect(() => {
    loggedUserSelector.role === "USER_BEGINNER" && history.push('/');
  }, [])

  const [advice, setAdvice] = useState<IAdvice>({
    id: 0,
    creator: "",
    name: "",
    location: "",
    category: "",
    likes: [],
  });

  const handleAdviceData = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.currentTarget;
    const date = new Date();
    let currentMilliseconds = date.getTime();
    setAdvice({
      ...advice,
      id: currentMilliseconds,
      [id]: value,
      creator: loggedUserSelector.email
    });
  };

  const addNewAdvice = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addItems(advice))
    setAdvice({
      ...advice,
      id: advice.id + 1,
      creator: loggedUserSelector.email
    });
    history.push('/');
  };

  return (
    <form onSubmit={addNewAdvice} className="Add-advice">
      <div>
        <input type="hidden" id="id" placeholder="Id" value={advice.id} />
      </div>
      <div>
        <input
          type="text"
          id="name"
          placeholder="Name"
          onChange={handleAdviceData}
        />
      </div>
      <div>
        <input
          type="text"
          id="location"
          placeholder="Location"
          onChange={handleAdviceData}
        />
      </div>
      <div>
        <input
          type="text"
          id="category"
          placeholder="Category"
          onChange={handleAdviceData}
        />
      </div>
      <button disabled={advice === undefined}>Add advice</button>
    </form>
  );
};