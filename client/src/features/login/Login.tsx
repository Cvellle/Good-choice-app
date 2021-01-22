import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setLoggedUser,
  loggedUser,
} from './loginSlice';
import axios from 'axios'
import { Formik } from 'formik'
import * as yup from 'yup'
import useReactRouter from 'use-react-router';

const initialValues = {
  id: 0,
  email: '',
  password: '',
}

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email is not valid')
    .required('Email is required'),
  password: yup.string().required('Password is required.')
})

export const Login: React.FC = () => {
  const dispatch = useDispatch();
  const loggedUserSelector = useSelector(loggedUser);
  const { history } = useReactRouter()

  useEffect(() => {
    (loggedUserSelector.email !== "") && history.push('/');
    (loggedUserSelector.email == "") && history.push('/login');
  }, [])


  return (
    <div className="login">
      <p>{loggedUserSelector.email}</p>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          axios.get("/api/datas", {
            params: {
              email: values.email,
              password: values.password
            }
          }).then(
            (res) => {
              if (res.data[0]) {
                history.push('/');
                dispatch(setLoggedUser({
                  id: res.data[0].id,
                  email: res.data[0].email,
                  role: res.data[0].role,
                }))
              }
            }
          )
        }}
        validationSchema={validationSchema}
      >
        {props => {
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
              <label htmlFor="email" style={{ display: 'block' }}>
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
                  errors.email && touched.email ? 'text-input error' : 'text-input'
                }
              />
              <p style={{ color: 'red', visibility: 'visible', height: '15px', textAlign: 'center' }}>{errors.email && touched.email && (
                <div className="input-feedback">{errors.email}</div>
              )}</p>
              <label htmlFor="password" style={{ display: 'block' }}>
                Password
              </label>
              <input
                required
                id="password"
                placeholder="Enter your password"
                type="text"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.password && touched.password ? 'text-input error' : 'text-input'
                }
              />
              <p style={{ color: 'red', visibility: 'visible', height: '15px', textAlign: 'center' }}>
                {errors.password && touched.password && (
                  <div className="input-feedback">{errors.password}</div>
                )}
              </p>
              <button type="submit">
                Log in
              </button>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}
