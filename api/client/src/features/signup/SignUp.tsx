import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import axios from "axios";
import { Formik } from "formik";
import * as yup from "yup";

import { setLoggedUser, loggedUser } from "../login/loginSlice";
import { useNavigate } from "react-router-dom";

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "USER_BEGINNER",
  registrationKey: " ",
  image: " ",
};

const validationSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Email is not valid").required("Email is required"),
  password: yup.string().required("Password is required."),
});

export const SignUp: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedUserSelector = useSelector(loggedUser);

  useEffect(() => {
    loggedUserSelector.role !== "" && navigate("/");
    loggedUserSelector.role == "" && navigate("/signup");
  }, []);

  let usersCollection = "datas";

  return (
    <div className="signup">
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);
          dispatch(
            setLoggedUser({
              id: 0,
              firstName: "",
              lastName: "",
              email: values.email,
              role: "",
              image: "",
            })
          );
          axios
            .get(`/api/${usersCollection}`, {
              params: {
                email: values.email,
              },
            })
            .then((res) => {
              if (!res.data[0]) {
                navigate("/login");
                axios.post(`/api/${usersCollection}`, {
                  firstName: values.firstName,
                  lastName: values.lastName,
                  email: values.email,
                  password: values.password,
                  role: values.role,
                  registrationKey: values.registrationKey,
                  image: values.image,
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
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
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
                htmlFor="email"
                style={{ display: "block", height: "2.5vh" }}
              >
                Email
              </label>
              <input
                id="email"
                placeholder="Enter your email"
                type="text"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
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
                required
                id="password"
                placeholder="Enter your password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
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
              <input
                id="role"
                placeholder="Enter your role"
                value={values.role}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.role && touched.role
                    ? "text-input error"
                    : "text-input"
                }
                type="hidden"
              />
              <input
                id="registrationKey"
                placeholder="Enter your role"
                value={values.registrationKey}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.registrationKey && touched.registrationKey
                    ? "text-input error"
                    : "text-input"
                }
                type="hidden"
              />
              <input
                id="image"
                placeholder="Enter your role"
                value={values.image}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.image && touched.image
                    ? "text-input error"
                    : "text-input"
                }
                type="hidden"
              />
              <button type="submit" disabled={isSubmitting}>
                Sign in
              </button>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};
