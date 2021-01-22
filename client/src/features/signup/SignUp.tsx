import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useReactRouter from 'use-react-router';
import axios from 'axios'
import { Formik } from 'formik'
import * as yup from 'yup'

import {
  setLoggedUser,
  loggedUser,
} from '../login/loginSlice';

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'USER_BEGINNER',
  registrationKey: ' '
}

const validationSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup
    .string()
    .email('Email is not valid')
    .required('Email is required'),
  password: yup.string().required('Password is required.')
})

export const SignUp: React.FC = () => {
  const dispatch = useDispatch();
  const { history } = useReactRouter()
  const loggedUserSelector = useSelector(loggedUser);

  useEffect(() => {
    (loggedUserSelector.role !== "") && history.push('/');
    (loggedUserSelector.role == "") && history.push('/signup');
  }, [])

  return (
    <div className="signup">
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { setSubmitting }) => {
          dispatch(setLoggedUser({
            id: 0,
            email: values.email,
            role: '',
          }))
          axios.get("/api/datas", {
            params: {
              email: values.email,
            }
          }).then(
            (res) => {
              if (!res.data[0]) {
                history.push('/login')
                axios.post("/api/datas", {
                  firstName: values.firstName,
                  lastName: values.lastName,
                  email: values.email,
                  password: values.password,
                  role: values.role,
                  registrationKey: values.registrationKey,
                })
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
              <label htmlFor="firstName" style={{ display: 'block' }}>
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
                  errors.firstName && touched.firstName ? 'text-input error' : 'text-input'
                }
              />
              <p style={{ color: 'red', visibility: 'visible', height: '15px', textAlign: 'center' }}>
                {errors.firstName && touched.firstName && (
                  <div className="input-feedback">{errors.firstName}</div>
                )}
              </p>
              <label htmlFor="firstName" style={{ display: 'block' }}>
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
                  errors.lastName && touched.lastName ? 'text-input error' : 'text-input'
                }
              />
              <p style={{ color: 'red', visibility: 'visible', height: '15px', textAlign: 'center' }}>
                {errors.lastName && touched.lastName && (
                  <div className="input-feedback">{errors.lastName}</div>
                )}
              </p>
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
              <input
                id="role"
                placeholder="Enter your role"
                value={values.role}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.role && touched.role ? 'text-input error' : 'text-input'
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
                  errors.role && touched.role ? 'text-input error' : 'text-input'
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
}