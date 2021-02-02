import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useReactRouter from "use-react-router";

import { addItems } from "./dashboardSlice";
import { loggedUser } from "../login/loginSlice";
import { spawn } from "child_process";

interface IAdvice {
  id: number;
  creator: string;
  name: string;
  location: string;
  category: string;
  likes: string[];
}

type Props = {
  saveAdvice: (advice: IAdvice) => void;
};

export const AddItems: React.FC<Props> = ({ saveAdvice }) => {
  const dispatch = useDispatch();
  const loggedUserSelector = useSelector(loggedUser);

  const { history } = useReactRouter();

  useEffect(() => {
    loggedUserSelector.role === "USER_BEGINNER" && history.push("/");
  }, []);

  const [addCategoriesInput, setAddCategoriesInput] = useState<string>("");
  const [categoriesState, setCategoriesState] = useState<string[]>([]);
  const [advice, setAdvice] = useState<IAdvice>({
    id: 0,
    creator: "",
    name: "",
    location: "",
    category: categoriesState.join(","),
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
      category: categoriesState && categoriesState.join(","),
      creator: `${loggedUserSelector.email}/n${loggedUserSelector.firstName}/n${loggedUserSelector.image}`,
    });
  };

  const addNewAdvice = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addItems(advice));
    setAdvice({
      ...advice,
      id: advice.id + 1,
      category: categoriesState.join(","),
      creator: `${loggedUserSelector.email}/n${loggedUserSelector.firstName}/n${loggedUserSelector.image}`,
    });
    history.push("/");
  };

  const addCategoryToState = (e: React.FormEvent) => {
    e.preventDefault();
    setAdvice({
      ...advice,
      category: [...categoriesState, addCategoriesInput].join(","),
    });
    setCategoriesState([...categoriesState, addCategoriesInput]);
  };

  return (
    <div className="Add-advice">
      <form onSubmit={addNewAdvice}>
        <div>
          <input type="hidden" id="id" placeholder="Id" value={advice.id} />
        </div>
        <p>Name:</p>
        <div>
          <input
            type="text"
            id="name"
            placeholder="Name"
            onChange={handleAdviceData}
          />
        </div>
        <p>Location:</p>
        <div>
          <input
            type="text"
            id="location"
            placeholder="Location"
            onChange={handleAdviceData}
          />
        </div>
        <p>Categories:</p>
        <div className="categoriesInputs">
          <input
            className="addedCategoriesInput"
            type="text"
            id="inputCategory"
            placeholder="Add new category to the list"
            onChange={(
              e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => setAddCategoriesInput(e.currentTarget.value)}
          />
          <button
            className="addCategoryButton"
            id="category"
            onClick={addCategoryToState}
          >
            +
          </button>
        </div>
        <div className="addedCategoriesDiv">
          {categoriesState.map((cat) => (
            <span>{cat}</span>
          ))}
        </div>
        <div>
          <button disabled={advice === undefined}>Add advice</button>
        </div>
      </form>
    </div>
  );
};
