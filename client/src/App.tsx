import React from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import { useSelector } from 'react-redux';

import Header from './features/header/Header';
import { SignUp } from './features/signup/SignUp';
import { Login } from './features/login/Login';
import { Dashboard } from './features/dashboard/Dashboard';
import { AddItems } from './features/dashboard/AddItems';
import './App.css';
import PrivateRoute from './features/login/privateroute/privateroute';
import {
  loggedUser,
} from './features/login/loginSlice';


function App() {
  const loggedUserSelector = useSelector(loggedUser);
  let userRole = loggedUserSelector.role;
  let adminBoolean = false;
  let beginnerUserBoolean = false;
  let advancedUserBoolean = false;

  userRole == "ADMIN" && (adminBoolean = true);
  userRole == "USER_BEGINNER" && (beginnerUserBoolean = true);
  userRole == "USER_ADVANCED" && (advancedUserBoolean = true);

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Route component={SignUp} exact path="/signup" />
        <Route component={Login} exact path="/login" />
        <PrivateRoute component={Dashboard} isAuth={adminBoolean || beginnerUserBoolean || advancedUserBoolean} redirectPath="/login" path="/" exact />
        <PrivateRoute component={AddItems} isAuth={adminBoolean || advancedUserBoolean} redirectPath="/" path="/add-new" exact />
      </BrowserRouter>
    </div>
  );
}

export default App;
