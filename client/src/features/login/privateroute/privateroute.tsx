import React, { Component } from "react";
import { useSelector } from 'react-redux';

import {Redirect, Route, RouteProps} from 'react-router'

export interface IPrivateRouteProps extends RouteProps {
  isAuth: boolean 
  redirectPath: string 
}

const PrivateRoute: React.FC<IPrivateRouteProps> = (props) => {
    return props.isAuth ? (
    <Route {...props} component={props.component} render={undefined} />
  ) : (
    <Redirect to={{pathname: props.redirectPath}} />
  )
}

export default PrivateRoute