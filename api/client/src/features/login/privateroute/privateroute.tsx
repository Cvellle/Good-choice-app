import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  isAuth: boolean;
  redirectPath: string;
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  isAuth,
  redirectPath,
  children,
}) => {
  return isAuth ? children : <Navigate to={redirectPath} replace />;
};

export default PrivateRoute;
