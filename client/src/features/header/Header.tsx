import React, { Component, MouseEventHandler } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Grid from "@material-ui/core/Grid";
import HomeIcon from "@material-ui/icons/Home";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { debounce } from "lodash";

import { loggedUser, logOutUser } from "../login/loginSlice";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 0,
    },
  })
);

export default function Header() {
  const dispatch = useDispatch();
  const loggedUserSelector = useSelector(loggedUser);
  const classes = useStyles();

  const [showHeader, setShowHeader] = React.useState(false);

  const didScrollPage = (e: any) => {
    const headerStickyOffset = 200;
    if (window.scrollY > headerStickyOffset) {
      setShowHeader(true);
    } else {
      setShowHeader(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("scroll", debounce(didScrollPage, 100));

    return () => {
      window.removeEventListener("keydown", didScrollPage);
    };
  }, []);

  function onLogout() {
    dispatch(logOutUser());
  }

  return (
    <div className={`App-header ${showHeader ? "smaller" : "bigger"}`}>
      {loggedUserSelector.role !== "" ? (
        <div className={classes.root} style={{ width: "90%" }}>
          <Grid container spacing={0}>
            <Grid item xs={6}>
              <Box
                display="flex"
                justifyContent="flex-start"
                style={{ display: "flex" }}
              >
                <span>
                  <Link to="/" style={{ textDecoration: "none" }}>
                    <HomeIcon style={{ transform: "scale(1.3)" }} />
                  </Link>
                </span>
                {loggedUserSelector.role !== "USER_BEGINNER" && (
                  <span>
                    <Link to="/add-new" style={{ textDecoration: "none" }}>
                      Add new advice
                    </Link>
                  </span>
                )}
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" justifyContent="flex-end">
                <span>
                  <Link to="/myprofile" style={{ textDecoration: "none" }}>
                    My profile
                  </Link>
                </span>
                <span onClick={onLogout}>
                  <Link to="/login" style={{ textDecoration: "none" }}>
                    Log out
                  </Link>
                </span>
              </Box>
            </Grid>
          </Grid>
        </div>
      ) : (
        <div>
          <span>
            <Link
              to="/signup"
              style={{ textDecoration: "none", color: "white" }}
            >
              SignUp
            </Link>
          </span>
          <span>
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "white" }}
            >
              Login
            </Link>
          </span>
        </div>
      )}
    </div>
  );
}
