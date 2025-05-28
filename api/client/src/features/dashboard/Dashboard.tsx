import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

import {
  advicesState,
  setCurrentUser,
  initialLoadItems,
  filterAdvicesAction,
  categoryAdvicesAction,
  likeAction,
} from "./dashboardSlice";
import { changeRole, loggedUser } from "../login/loginSlice";
import "../../App.css";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContentText,
  Button,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { IconButton, Input } from "@material-ui/core";

interface IAdvice {
  id: number;
  creator: string;
  name: string;
  location: string;
  category: string;
  likes: string[];
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  image: string;
}

export const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const advicesSelector = useSelector(advicesState);
  const loggedUserSelector = useSelector(loggedUser);
  const navigate = useNavigate();

  const [open, setOpen] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState(
    'Like to turn on new Route \n Like one advice to turn on \n the "Add advices" Route in the header'
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    loggedUserSelector.role == "USER_BEGINNER" && handleClickOpen();
    dispatch(initialLoadItems());
    dispatch(setCurrentUser(loggedUserSelector.email));
    loggedUserSelector.role === "" && navigate("/login");
    loggedUserSelector.role !== "" && navigate("/");
  }, []);

  const likeFunction = (e: React.MouseEvent, advice: any, user: User) => {
    e.stopPropagation();
    dispatch(likeAction(advice));
    dispatch(changeRole(user));
    loggedUserSelector.role == "USER_BEGINNER" &&
      setDialogMessage(
        "You have become an Advanced User! \n You unlocked new routes in the Header. \n You can add your own advices now!"
      );
  };

  useEffect(() => {
    dialogMessage.split("\n")[0] == "You have become an Advanced User! " &&
      handleClickOpen();
  }, [dialogMessage]);

  let user = loggedUserSelector;

  const Item = (advice: IAdvice) => {
    // const [creatorImage, setCreatorImage] = useState<any>({
    //   id: 0,
    //   email: "",
    //   firstName: "",
    //   lastName: "",
    //   role: "",
    //   image: " ",
    // });

    const getItemcreatorInfo = (infoArg: string) => {
      axios.get(`/api/datas`, {
        params: {
          email: infoArg,
        },
      });
    };

    useEffect(() => {
      getItemcreatorInfo(advice.creator.split("/n")[0]);
    }, []);

    let profileImageName = advice.creator.split("/n")[2];

    return (
      <React.Fragment>
        <Grid item xs={12} lg={4}>
          <div className="advice-item">
            <Paper className={"paper"}>
              <b>Title</b>
              <p className="itemName">{advice.name}</p>
              <b>Location</b>
              <p className="itemLocation">{advice.location}</p>
              <div className="categories-div">
                <b>Category</b>
                <p>
                  {advice.category.split(",").map((el, i) => (
                    <span
                      key={i}
                      onClick={() => dispatch(categoryAdvicesAction(el))}
                    >
                      {el}
                    </span>
                  ))}
                </p>
              </div>
              <p className="likes">
                <span>
                  <b>Likes: </b>
                </span>
                {advice.likes.length}
              </p>
              <div className="creator-info">
                <div>By:</div>
                <div>{advice.creator.split("/n")[1]}</div>
                <div className="image-wrapper">
                  {profileImageName !== " " && (
                    <img src={`./profileImage/${profileImageName}`} />
                  )}
                </div>
              </div>

               <Button
              className="fa fa-thumbs-o-up"
              variant="contained"
              onClick={(e: React.MouseEvent) => likeFunction(e, advice, user)}
            />
            </Paper>
          </div>
        </Grid>
      </React.Fragment>
    );
  };

  const adviceList = advicesSelector.advices.map((advice: IAdvice) => (
    <Item
      id={advice.id}
      name={advice.name}
      creator={advice.creator}
      location={advice.location}
      category={advice.category}
      likes={advice.likes}
      key={advice.id}
    />
  ));

  return (
    <div className="dashboard">
      <div className="flex-wrapper advice-list">
        <Grid
          container
          spacing={0}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid
            container
            spacing={2}
            className="filter-advices"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingRight: "calc(15rem - 10vw)",
              alignItems: "center",
            }}
          >
            <Grid item xs={12} lg={1}>
              <span
                className="all-button"
                onClick={() => dispatch(categoryAdvicesAction(""))}
              >
                All
              </span>
            </Grid>
            <SearchIcon />
            <Grid item xs={12} lg={2}>
              <Input
                type="text"
                className="filter-input"
                placeholder="search items"
                onChange={(e) => dispatch(filterAdvicesAction(e.target.value))}
              />
            </Grid>
          </Grid>
        </Grid>
        {adviceList}
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {dialogMessage.split("\n")[0]}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogMessage.split("\n")[1]}
            <br />
            {dialogMessage.split("\n")[2]}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
