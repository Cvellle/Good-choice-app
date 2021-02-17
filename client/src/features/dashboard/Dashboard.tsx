import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import useReactRouter from "use-react-router";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import SearchIcon from "@material-ui/icons/Search";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
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
import Chat from "../chat/Chat";

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: "center",
      color: theme.palette.text.secondary,
      margin: "1vw",
    },
  })
);

export const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const advicesSelector = useSelector(advicesState);
  const loggedUserSelector = useSelector(loggedUser);
  const { history } = useReactRouter();
  const classes = useStyles();

  const [open, setOpen] = useState(false);
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
    loggedUserSelector.role === "" && history.push("/login");
    loggedUserSelector.role !== "" && history.push("/");
  }, []);

  const likeFunction = (e: React.MouseEvent, advice: IAdvice, user: User) => {
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
    const [creatorImage, setCreatorImage] = useState<any>({
      id: 0,
      email: "",
      firstName: "",
      lastName: "",
      role: "",
      image: " ",
    });

    const getItemCreatorInfo = (infoArg: string) => {
      axios
        .get(`/api/datas`, {
          params: {
            email: infoArg,
          },
        })
        .then((res) => {
          res.data[0] && setCreatorImage(res.data[0]);
        });
    };

    useEffect(() => {
      getItemCreatorInfo(advice.creator.split("/n")[0]);
    }, []);

    let profileImageName = advice.creator.split("/n")[2];

    return (
      <React.Fragment>
        <Grid item xs={12} lg={4}>
          <div className="advice-item">
            <Paper className={classes.paper}>
              <b>Title</b>
              <p className="itemName">{advice.name}</p>
              <b>Location</b>
              <p className="itemLocation">{advice.location}</p>
              <div className="categoriesDiv">
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
              <div className="creatorInfo">
                <div>By:</div>
                <div>{advice.creator.split("/n")[1]}</div>
                <div className="imageWrapper">
                  {profileImageName !== " " && (
                    <img src={`./profileImage/${profileImageName}`} />
                  )}
                </div>
              </div>
            </Paper>
            <i
              className="fa fa-thumbs-o-up"
              style={
                advice.likes.includes(loggedUserSelector.email)
                  ? { color: "green" }
                  : { color: "unset" }
              }
              onClick={(e: React.MouseEvent) => likeFunction(e, advice, user)}
            ></i>
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
            className="filterAdvices"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid item xs={12} lg={1}>
              <span
                className="allButton"
                onClick={() => dispatch(categoryAdvicesAction(""))}
              >
                All
              </span>
            </Grid>
            <SearchIcon />
            <Grid item xs={12} lg={2}>
              <input
                type="text"
                className="filterInput"
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
      <Chat />
    </div>
  );
};
