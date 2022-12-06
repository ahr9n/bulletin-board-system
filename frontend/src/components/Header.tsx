import { observer } from "mobx-react";
import "../App.css";
import { AppBar, Avatar, Button, Toolbar, Typography } from "@mui/material";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import UserStore from "../stores/UserStore";
import React from "react";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  function navigateToLogin() {
    if (location.pathname !== "/login") navigate("/login");
  }
  function navigateToRegister() {
    if (location.pathname !== "/registration") navigate("/registration");
  }
  function navigateToUserProfile() {
    if (location.pathname !== "/profile")
      navigate(`/profile/${UserStore.getUser().id}/`);
  }
  function navigateToHome() {
    if (location.pathname !== "/") navigate("/");
  }
  function logUserOut() {
    UserStore.logUserOut();
    navigateToHome();
  }
  function userProfileMenu() {
    return (
      <React.Fragment>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
          }}
        >
          <div className="text">
            <b>Hello, {UserStore.user.username}!</b>
          </div>
          <div
            className="text"
            onClick={navigateToUserProfile}
            style={{ cursor: "pointer" }}
          >
            <b>Profile</b>
          </div>
          <div
            className="text"
            onClick={logUserOut}
            style={{ cursor: "pointer" }}
          >
            <b>Logout</b>
          </div>
        </div>
        <Avatar alt={UserStore.user.username} src={UserStore.user.avatar} />
      </React.Fragment>
    );
  }
  function loginHeader() {
    if (UserStore.isLoggedIn) {
      return userProfileMenu();
    } else {
      return (
        <React.Fragment>
          <Button
            variant="outlined"
            sx={{ my: 1, mx: 1.5 }}
            onClick={navigateToLogin}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            sx={{ my: 1, mx: 1.5 }}
            onClick={navigateToRegister}
          >
            Register
          </Button>
        </React.Fragment>
      );
    }
  }
  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          <NavLink
            to={"/"}
            style={{
              color: "#4D98CE",
              textDecoration: "none",
              fontStyle: "normal",
              fontWeight: "bold",
            }}
          >
            Bulletin Board System
          </NavLink>
        </Typography>
        {loginHeader()}
      </Toolbar>
    </AppBar>
  );
}

export default observer(Header);
