import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import Header from "./features/header/Header";
import { SignUp } from "./features/signup/SignUp";
import { Login } from "./features/login/Login";
import { Dashboard } from "./features/dashboard/Dashboard";

import { MyProfile } from "./features/myprofile/MyProfile";

import { Sidebar } from "./features/sidebar/Sidebar";
import PrivateRoute from "./features/login/privateroute/privateroute";
import { loggedUser } from "./features/login/loginSlice";
import "./AppCss.css";
import chatImage from "./images/chat.png";
import { AddItems } from "./features/dashboard/AddItems";

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
      <BrowserRouter>
      <Header />
      {adminBoolean || beginnerUserBoolean || advancedUserBoolean ? <Sidebar /> : null}
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {/* <Route
            path="/"
            element={
              <PrivateRoute
                isAuth={
                  adminBoolean || beginnerUserBoolean || advancedUserBoolean
                }
                redirectPath="/login"
              >
                <Sidebar />
              </PrivateRoute>
            }
          /> */}
          <Route
            path="/"
            element={
              <PrivateRoute
                isAuth={
                  adminBoolean || beginnerUserBoolean || advancedUserBoolean
                }
                redirectPath="/login"
              >
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-new"
            element={
              <PrivateRoute
                isAuth={adminBoolean || advancedUserBoolean}
                redirectPath="/login"
              >
                <AddItems />
              </PrivateRoute>
            }
          />
          <Route
            path="/myprofile"
            element={
              <PrivateRoute
                isAuth={
                  beginnerUserBoolean || adminBoolean || advancedUserBoolean
                }
                redirectPath="/signup"
              >
                <MyProfile />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>

      <div
        style={
          chatVisible &&
          (beginnerUserBoolean || adminBoolean || advancedUserBoolean)
            ? { display: "flex" }
            : { display: "none" }
        }
      ></div>
      {adminBoolean ||
        beginnerUserBoolean ||
        (advancedUserBoolean && (
          <img
            src={chatImage}
            className="chat-image"
            onClick={() => toggleChat()}
          />
        ))}
    </div>
  );
}

export default App;
