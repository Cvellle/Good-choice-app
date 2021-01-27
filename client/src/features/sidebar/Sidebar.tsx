import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import axios from 'axios'

import {
  setLoggedUser,
  loggedUser,
} from '../login/loginSlice';
import '../../App.css'
import './sidebar.css'

export const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const loggedUserSelector = useSelector(loggedUser);

  const [image, setImage] = useState<any>();

  const onSubmitImage = async (e: React.FormEvent) => {
    e.preventDefault();
    let data = new FormData();
    data.append('files', image[0]);

    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };

    fetch("/upload", {
      method: "POST",
      body: data,
    })
      .then(() => {
        dispatch(setLoggedUser({
          id: loggedUserSelector.id,
          email: loggedUserSelector.email,
          role: loggedUserSelector.role,
          image: image[0].name
        }))
      }
      )
      .then(() => {
        axios.put("/api/changeImage", {
          email: { email: loggedUserSelector.email },
          update: {
            image: image[0].name
          }
        });
      })
  }

  return (
    <div className="sidebar">
      <Grid container spacing={0}>
        <Grid item xs={12} lg={2} className="sidebarGrid">
          <Box display="flex" justifyContent="center" style={{ display: "flex" }} className="profileWrapper">
            <form onSubmit={(e) => onSubmitImage(e)} className="create-post-form">
              <div className="profileImageDiv">
                {<img src={loggedUserSelector.image && `./${loggedUserSelector.image}`} alt="" />}
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
