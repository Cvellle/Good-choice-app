import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useReactRouter from 'use-react-router';
import Grid from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import axios from 'axios'

import {
  setLoggedUser,
  loggedUser,
} from '../login/loginSlice';
import '../../App.css'
import './sidebar.css'

interface User {
  id: number,
  email: string,
  role: string,
  image: string
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

export const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const loggedUserSelector = useSelector(loggedUser);

  const [image, setImage] = useState<any>();
  const [profileImage, setProfileImage] = useState<any>();

  useEffect(() => {
    loggedUserSelector.image !== " " && importImage()
  }, [])

  const importImage = () => {
    let urlPart = loggedUserSelector.image
    import(`../../uploads/${urlPart}`)
      .then(
        (image) => {
          setProfileImage(image.default);
        })
  }

  const onSubmitImage = async (e: React.FormEvent) => {
    e.preventDefault();
    let data = new FormData();
    data.append('files', image[0]);

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };

    axios.post('/upload', data, config)
      .then(res => {
        console.log(res);
      })
      .then(res => {
        setImage(res)
      })
      .then(res => {
        image && axios.put("/api/changeImage", {
          email: { email: loggedUserSelector.email },
          update: {
            image: image[0].name
          }
        });
        image && dispatch(setLoggedUser({
          id: loggedUserSelector.id,
          email: loggedUserSelector.email,
          role: loggedUserSelector.role,
          image: image[0].name
        }))
      })
      .then(() => importImage())
  };

  return (
    <div className="sidebar">
      <Grid container spacing={0}>
        <Grid item xs={12} lg={2} className="sidebarGrid">
          <Box display="flex" justifyContent="center" style={{ display: "flex" }} className="profileWrapper">
            <form onSubmit={(e) => onSubmitImage(e)} className="create-post-form">
              <div className="profileImageDiv">
                <img src={profileImage && profileImage} alt="" />
              </div>
              <div className="input-wrapper">
                <span className="label">
                  Select image
                  </span>
                <input
                  type="file"
                  name="files"
                  id="file"
                  multiple
                  onChange={e => setImage(e.target.files)}
                  className="uploadInput"
                />
              </div>
              <br />
              <button className="submitButton">Upload</button>
            </form>
          </Box>
        </Grid>
      </Grid>
    </div >
  )
}
