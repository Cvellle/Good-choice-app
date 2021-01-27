import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useReactRouter from 'use-react-router';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import {
  advicesStateArray,
  initialLoadItems,
  likeAction
} from './dashboardSlice';
import {
  changeRole,
  loggedUser,
} from '../login/loginSlice';
import '../../App.css'

interface IAdvice {
  id: number,
  name: string,
  location: string
  category: string
  likes: number
}

interface User {
  id: number,
  email: string,
  role: string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      margin: '1vw',
    },
  }),
);

export const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const advicesSelector = useSelector(advicesStateArray);
  const loggedUserSelector = useSelector(loggedUser);
  const { history } = useReactRouter()
  const classes = useStyles();

  useEffect(() => {
    dispatch(initialLoadItems());
    !loggedUserSelector && history.push('/login');
  }, [])

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const likeFunction = (e: React.MouseEvent, advice: IAdvice, user: User) => {
    e.stopPropagation()
    dispatch(likeAction(advice));
    dispatch(changeRole(user));
    loggedUserSelector.role == 'USER_BEGINNER' && handleClickOpen()
  };

  let user = loggedUserSelector;

  const Item = (advice: IAdvice) => (
    <React.Fragment>
      <Grid item xs={12} sm={4}>
        <div className="advice-item">
          <Paper className={classes.paper}>
            <b>Title</b>
            <p>{advice.name}</p>
            <b>Location</b>
            <p>{advice.location}</p>
            <b>Category</b>
            <p>{advice.category.split(",").map(el => <span>{el}</span>)}</p>
            <p><span><b>Likes: </b></span>{advice.likes}</p>
          </Paper>
          <i className="fa fa-thumbs-o-up"
            onClick={(e: React.MouseEvent) => likeFunction(e, advice, user)}>
          </i>
        </div>
      </Grid>
    </React.Fragment>
  )

  const adviceList = advicesSelector.advices.map((advice: IAdvice) =>
    <Item
      id={advice.id}
      name={advice.name}
      location={advice.location}
      category={advice.category}
      likes={advice.likes}
      key={advice.id}
    />
  )

  return (
    <div>
      <div id="res"></div>
      <div className="flex-wrapper advice-list">
        {adviceList}
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"You have become an Advanced user!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You unlocked new routes in the Header.
              <br />
            <br />
              You can add your own advices now!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
