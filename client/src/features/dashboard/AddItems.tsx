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
  const [validationState, setValidationState] = useState<boolean>(false);

  const handleAdviceData = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.currentTarget;
    const date = new Date();
    let currentMilliseconds = date.getTime();
    let filteredCat = categoriesState.filter((el) => el.trim() !== "");
    setAdvice({
      ...advice,
      id: currentMilliseconds,
      [id]: value,
      category: filteredCat.join(","),
      creator: `${loggedUserSelector.email}/n${loggedUserSelector.firstName}/n${loggedUserSelector.image}`,
    });
  };

  const addNewAdvice = (e: React.FormEvent) => {
    e.preventDefault();
    let filteredCat = categoriesState.filter((el) => el.trim() !== "");

    dispatch(addItems(advice));
    setAdvice({
      ...advice,
      id: advice.id + 1,
      category: filteredCat.join(",").trim(),
      creator: `${loggedUserSelector.email}/n${loggedUserSelector.firstName}/n${loggedUserSelector.image}`,
    });
    history.push("/");
  };

  const addCategoryToState = (e: React.FormEvent) => {
    e.preventDefault();
    let filteredCat = categoriesState.filter((el) => el.trim() !== "");
    setAdvice({
      ...advice,
      category:
        categoriesState && [...filteredCat, addCategoriesInput].join(","),
    });
    setCategoriesState([...categoriesState, addCategoriesInput.trim()]);
  };

  let emptyFields = Object.values(advice).filter((adv) => {
    return adv === "";
  });

  return (
    <div className="Add-advice">
      <form>
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
            ) =>
              e.currentTarget.value.trim() &&
              setAddCategoriesInput(e.currentTarget.value.trim())
            }
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
          {categoriesState.map((cat) => {
            return cat.trim() && <span>{cat}</span>;
          })}
        </div>
        <div>
          <button
            type="submit"
            onClick={
              emptyFields.length > 0
                ? (e: React.FormEvent) => {
                    e.preventDefault();
                    setValidationState(true);
                  }
                : addNewAdvice
            }
          >
            Add advice
          </button>
        </div>
        <div style={{ color: "red" }}>
          {validationState && "All fields must be filled"}
        </div>
      </form>
    </div>
  );
};
