import React from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import { createTheme } from "@mui/material/styles";
import { blue } from "@mui/material/colors";

import BoardList from "./components/BoardList";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ThreadList from "./components/ThreadList";
import PostList from "./components/PostList";
import Profile from "./components/Profile";

function App() {
  return (
    <ThemeProvider
      theme={createTheme({
        palette: {
          mode: "light",
          primary: {
            main: blue[500],
          },
          secondary: {
            main: "#000000",
          },
        },
      })}
    >
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<BoardList />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/boards/:boardId/threads/" element={<ThreadList />} />
          <Route path="/profile/:profileId/" element={<Profile />} />
          <Route path="/threads/:threadId/posts/" element={<PostList />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
