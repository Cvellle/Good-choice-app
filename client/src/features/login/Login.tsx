import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Formik } from "formik";
import * as yup from "yup";


import { setLoggedUser, loggedUser } from "./loginSlice";
import { useNavigate } from "react-router-dom";

const validationSchema = yup.object().shape({
  email: yup.string().email("Email is not valid").required("Email is required"),
  password: yup.string().required("Password is required."),
});

export const Login: React.FC = () => {
  const dispatch = useDispatch();
  const loggedUserSelector = useSelector(loggedUser);
  const navigate = useNavigate();

  useEffect(() => {
    loggedUserSelector.role !== "" && navigate("/");
    loggedUserSelector.role == "" && navigate("/login");
  }, []);

  const initialValues = {
    id: 0,
    email: loggedUserSelector.email,
    password: "",
  };

  let usersCollection = "datas";

  return (
    <div className="login">
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);
          axios
            .get(`/api/${usersCollection}`, {
              params: {
                email: values.email,
                password: values.password,
              },
            })
            .then((res) => {
              if (res.data[0]) {
                navigate("/");
                dispatch(
                  setLoggedUser({
                    id: res.data[0].id,
                    firstName: res.data[0].firstName,
                    lastName: res.data[0].lastName,
                    email: res.data[0].email,
                    role: res.data[0].role,
                    image: res.data[0].image,
                  })
                );
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
            handleChange,
            handleBlur,
            handleSubmit
          }: any = props;
          return (
            <form onSubmit={handleSubmit}>
              <label htmlFor="email" style={{ display: "block" }}>
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
                  height: "15px",
                  textAlign: "center",
                }}
              >
                {errors.email && touched.email && (
                  <div className="input-feedback">{errors.email}</div>
                )}
              </p>
              <label htmlFor="password" style={{ display: "block" }}>
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
                  height: "15px",
                  textAlign: "center",
                }}
              >
                {errors.password && touched.password && (
                  <div className="input-feedback">{errors.password}</div>
                )}
              </p>
              <button type="submit">Log in</button>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};
