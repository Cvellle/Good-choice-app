import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useReactRouter from "use-react-router";
import axios from "axios";
import { Formik } from "formik";
import * as yup from "yup";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import { setLoggedUser, loggedUser } from "../login/loginSlice";

const validationSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Email is not valid").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const MyProfile: React.FC = () => {
  const dispatch = useDispatch();
  const { history } = useReactRouter();
  const loggedUserSelector = useSelector(loggedUser);

  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteProfile = () => {
    axios
      .delete("/api/datas", {
        data: {
          email: { email: loggedUserSelector.email },
        },
      })
      .then(() => {
        dispatch(
          setLoggedUser({
            id: 0,
            firstName: "",
            lastName: "",
            email: "",
            role: "",
            image: "",
          })
        );
      });
  };

  useEffect(() => {
    loggedUserSelector.role == "" && history.push("/signup");
  }, []);

  const processDev = process.env.USERS_ROUTE_DEVELOPMENT;
  const processProd = process.env.USERS_ROUTE_PRODUCTION;

  let usersCollection = "datas";

  const initialValues = {
    firstName: loggedUserSelector.firstName,
    lastName: loggedUserSelector.lastName,
    email: loggedUserSelector.email,
    password: "",
  };

  return (
    <div className="signup myProfile">
      <div className="deleteDiv">
        <button type="submit" onClick={handleClickOpen}>
          Delete
        </button>
      </div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Delete profile"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteProfile} color="primary" autoFocus>
            Delete profile
          </Button>
        </DialogActions>
      </Dialog>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          axios
            .get(`/api/${usersCollection}`, {
              params: {
                email: values.email,
                password: values.password,
              },
            })
            .then((res) => {
              if (res.data[0]) {
                axios
                  .put(`/api/datas`, {
                    email: { email: loggedUserSelector.email },
                    update: {
                      firstName: values.firstName,
                      lastName: values.lastName,
                      email: values.email,
                      password: values.password,
                    },
                  })
                  .then(() => {
                    history.push("/signup");
                  })
                  .then(() => {
                    dispatch(
                      setLoggedUser({
                        id: loggedUserSelector.id,
                        firstName: values.firstName,
                        lastName: values.lastName,
                        email: values.email,
                        role: loggedUserSelector.role,
                        image: loggedUserSelector.image,
                      })
                    );
                  });
              }
            });
        }}
        validationSchema={validationSchema}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            dirty,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset,
          } = props;
          return (
            <form onSubmit={handleSubmit}>
              <label
                htmlFor="firstName"
                style={{ display: "block", height: "2.5vh" }}
              >
                First name
              </label>
              <input
                id="firstName"
                placeholder="Enter your first name"
                type="text"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{ height: "2.5vh" }}
                className={
                  errors.firstName && touched.firstName
                    ? "text-input error"
                    : "text-input"
                }
              />
              <p
                style={{
                  color: "red",
                  visibility: "visible",
                  height: "2vh",
                  textAlign: "center",
                }}
              >
                {errors.firstName && touched.firstName && (
                  <div className="input-feedback">{errors.firstName}</div>
                )}
              </p>
              <label
                htmlFor="firstName"
                style={{ display: "block", height: "2.5vh" }}
              >
                Last name
              </label>
              <input
                id="lastName"
                placeholder="Enter your last name"
                type="text"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{ height: "2.5vh" }}
                className={
                  errors.lastName && touched.lastName
                    ? "text-input error"
                    : "text-input"
                }
              />
              <p
                style={{
                  color: "red",
                  visibility: "visible",
                  height: "2vh",
                  textAlign: "center",
                }}
              >
                {errors.lastName && touched.lastName && (
                  <div className="input-feedback">{errors.lastName}</div>
                )}
              </p>
              <label
                htmlFor="firstName"
                style={{ display: "block", height: "2.5vh" }}
              >
                Email
              </label>
              <input
                id="email"
                placeholder="Enter your last name"
                type="text"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{ height: "2.5vh" }}
                className={
                  errors.email && touched.email
                    ? "text-input error"
                    : "text-input"
                }
              />
              <p
                style={{
                  color: "red",
                  visibility: "visible",
                  height: "2vh",
                  textAlign: "center",
                }}
              >
                {errors.email && touched.email && (
                  <div className="input-feedback">{errors.email}</div>
                )}
              </p>
              <label
                htmlFor="password"
                style={{ display: "block", height: "2.5vh" }}
              >
                Password
              </label>
              <input
                id="password"
                placeholder="Enter your password"
                type="text"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{ height: "2.5vh" }}
                className={
                  errors.password && touched.password
                    ? "text-input error"
                    : "text-input"
                }
              />
              <p
                style={{
                  color: "red",
                  visibility: "visible",
                  height: "2vh",
                  textAlign: "center",
                }}
              >
                {errors.password && touched.password && (
                  <div className="input-feedback">{errors.password}</div>
                )}
              </p>
              <button type="submit" disabled={isSubmitting}>
                Update
              </button>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};
