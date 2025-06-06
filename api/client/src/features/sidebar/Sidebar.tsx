import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@material-ui/core/Grid";

import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";

import { setLoggedUser, loggedUser } from "../login/loginSlice";
import "../../AppCss.css";
import noImagePicture from "../../images/noimage.jpg";
import { Box } from "@mui/material";

export const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const loggedUserSelector = useSelector(loggedUser);

  const [image, setImage] = useState<any>();
  const [profileImageUrl, setProfileImageUrl] = useState<string>(
    loggedUserSelector.image
  );
  const [loaded, setLoaded] = useState<boolean>(false);

  const onSubmitImage = async (e: React.FormEvent) => {
    e.preventDefault();
    let data = new FormData();
    data.append("files", image[0]);

    const config: any = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    fetch("/api/upload", {
      method: "POST",
      body: data,
      ...config
    })
      .then(() => {
        dispatch(
          setLoggedUser({
            id: loggedUserSelector.id,
            firstName: loggedUserSelector.firstName,
            lastName: loggedUserSelector.lastName,
            email: loggedUserSelector.email,
            role: loggedUserSelector.role,
            image: image && image[0].name,
          })
        );
      })
      .then(() => {
        axios.put("/api/changeImage", {
          email: { email: loggedUserSelector.email },
          update: {
            image: image[0].name,
          },
        });
      })
      .then(() => {
        setProfileImageUrl(image[0].name);
      });
  };

  return (
    <div className="sidebar">
      <Grid container spacing={0}>
        <Grid item xs={12} lg={2} className="sidebarGrid">
          <Box
            display="flex"
            justifyContent="center"
            style={{ display: "flex" }}
            className="profileWrapper"
          >
            <form
              onSubmit={(e) => onSubmitImage(e)}
              className="create-post-form"
            >
              <div className="profileImageDiv">
                {!loaded ? <CircularProgress /> : null}
                <img
                  style={loaded ? { opacity: "1" } : { opacity: "0" }}
                  src={
                    loggedUserSelector.image !== " "
                      ? `./profileImage/${profileImageUrl}`
                      : noImagePicture
                  }
                  alt=""
                  ref={(input) => {
                    if (!input) {
                      return;
                    }
                    const img = input;

                    const updateFunc = () => {
                      setLoaded(true);
                    };
                    img.onload = updateFunc;
                    if (img.complete) {
                      updateFunc();
                    }
                  }}
                />
              </div>
              <div className="input-wrapper">
                <span className="label">Select image</span>
                <input
                  type="file"
                  name="files"
                  id="file"
                  multiple
                  onChange={(e) => setImage(e.target.files)}
                  className="uploadInput"
                />
              </div>
              <br />
              <button className="submitButton" disabled={!image}>
                Upload
              </button>
            </form>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};
