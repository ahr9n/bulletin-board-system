import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { observer } from "mobx-react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
} from "@mui/material";
import UserStore from "../stores/UserStore";

function LoginForm() {
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  function setErrorState(errorMsg: string) {
    setError((prevState) => !prevState);
    setErrorMessage(errorMsg);
  }
  const location = useLocation();
  const navigate = useNavigate();
  function navigateToHome() {
    if (location.pathname !== "/") navigate("/");
  }
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let email: string;
    let password: string;
    email = data.get("email")!.toString();
    password = data.get("password")!.toString();
    try {
      await UserStore.logUserIn(email, password);
      navigateToHome();
    } catch (error: any) {
      setErrorState("Wrong email or password!");
      console.log(error.response.status);
    }
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
      {error ? (
        <Alert
          variant="filled"
          severity="error"
          onClose={() => {
            setErrorState("");
          }}
        >
          {errorMessage}
        </Alert>
      ) : null}
    </Container>
  );
}

export default observer(LoginForm);
