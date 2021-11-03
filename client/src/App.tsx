import React, { useState } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";
import { ApolloProvider } from "react-apollo";

import Header from "./features/header/Header";
import { SignUp } from "./features/signup/SignUp";
import { Login } from "./features/login/Login";
import { Dashboard } from "./features/dashboard/Dashboard";
import { AddItems } from "./features/dashboard/AddItems";
import { MyProfile } from "./features/myprofile/MyProfile";
import Chat from "./features/chat/Chat";
import { Sidebar } from "./features/sidebar/Sidebar";
import PrivateRoute from "./features/login/privateroute/privateroute";
import { loggedUser } from "./features/login/loginSlice";
import { apolloClient } from "./features/chat/api";
import "./App.css";
import chat-image from "./images/chat.png";

function App() {
  const loggedUserSelector = useSelector(loggedUser);
  let userRole = loggedUserSelector.role;
  let adminBoolean = false;
  let beginnerUserBoolean = false;
  let advancedUserBoolean = false;

  const [chatVisible, setChatVisible] = useState<boolean>(false);

  const toggleChat = () => {
    setChatVisible(!chatVisible);
  };

  userRole == "ADMIN" && (adminBoolean = true);
  userRole == "USER_BEGINNER" && (beginnerUserBoolean = true);
  userRole == "USER_ADVANCED" && (advancedUserBoolean = true);

  return (
    <div className="App">
      <ApolloProvider client={apolloClient}>
        <ApolloHooksProvider client={apolloClient}>
          <BrowserRouter>
            <Header />
            <PrivateRoute
              component={Sidebar}
              isAuth={
                adminBoolean ||
                beginnerUserBoolean ||
                advancedUserBoolean ||
                advancedUserBoolean
              }
              redirectPath="/login"
              path="/"
            />
            <Route component={SignUp} exact path="/signup" />
            <Route component={Login} exact path="/login" />
            <PrivateRoute
              component={Dashboard}
              isAuth={
                adminBoolean || beginnerUserBoolean || advancedUserBoolean
              }
              redirectPath="/login"
              path="/"
              exact
            />
            <PrivateRoute
              component={AddItems}
              isAuth={adminBoolean || advancedUserBoolean}
              redirectPath="/login"
              path="/add-new"
              exact
            />
            <PrivateRoute
              component={MyProfile}
              isAuth={
                beginnerUserBoolean || adminBoolean || advancedUserBoolean
              }
              redirectPath="/signup"
              path="/myprofile"
              exact
            />
            <div
              style={
                chatVisible &&
                (beginnerUserBoolean || adminBoolean || advancedUserBoolean)
                  ? { display: "flex" }
                  : { display: "none" }
              }
            >
              <Chat />
            </div>
            {adminBoolean ||
              beginnerUserBoolean ||
              (advancedUserBoolean && (
                <img
                  src={chat-image}
                  className="chat-image"
                  onClick={() => toggleChat()}
                />
              ))}
          </BrowserRouter>
        </ApolloHooksProvider>
      </ApolloProvider>
    </div>
  );
}

export default App;
