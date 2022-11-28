import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";
import {
  Container,
  Typography,
  Button,
  CssBaseline,
  TextField,
} from "@mui/material";
import { AxiosInstance } from "../utils/functions";
import UserStore from "../stores/UserStore";

import "./RegisterForm.css";

function RegisterForm() {
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmed_password, setConfirmed_password] = useState("");
  const [about, setAbout] = useState("");
  const [email, setEmail] = useState("");
  const [birth_date, setBirth_date] = useState("");
  const [hometown, setHometown] = useState("");
  const [present_location, setPresent_location] = useState("");
  const [website, setWesbite] = useState("");
  const [gender, setGender] = useState("");
  const [interests, setInterests] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData();
    data.append("first_name", first_name);
    data.append("last_name", last_name);
    data.append("username", username);
    data.append("password", password);
    data.append("confirmed_password", confirmed_password);
    data.append("about", about);
    data.append("email", email);
    data.append("birth_date", birth_date);
    data.append("hometown", hometown);
    data.append("present_location", present_location);
    data.append("gender", gender);
    data.append("website", website);
    data.append("interests", interests);
    data.append("avatar", e.currentTarget.avatar.files[0]);
    AxiosInstance.post(`/register/`, data)
      .then((res) => {
        setError("");
        UserStore.setToken(res.data.token);
        UserStore.setUser(res.data.user);
        navigate("/");
      })
      .catch((err) => {
        setError(JSON.stringify(err.response.data));
      });
  };
  return (
    <div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className="paper">
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <form onSubmit={handleRegister} className="form">
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="first_name"
              label="First Name"
              name="first_name"
              value={first_name}
              onChange={(e) => setFirst_name(e.target.value)}
              autoComplete="first_name"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="last_name"
              label="Last Name"
              name="last_name"
              value={last_name}
              onChange={(e) => setLast_name(e.target.value)}
              autoComplete="last_name"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="password"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmed_password"
              label="Confirm Password"
              type="password"
              id="confirmed_password"
              value={confirmed_password}
              onChange={(e) => setConfirmed_password(e.target.value)}
              autoComplete="confirmed_password"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="about"
              label="About"
              id="about"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              autoComplete="about"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="email"
              label="email"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="birth_date"
              id="birth_date"
              type="date"
              value={birth_date}
              onChange={(e) => setBirth_date(e.target.value)}
              autoComplete="birth_date"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="hometown"
              label="Hometown"
              name="hometown"
              value={hometown}
              onChange={(e) => setHometown(e.target.value)}
              autoComplete="hometown"
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="present_location"
              label="Present Location"
              name="present_location"
              value={present_location}
              onChange={(e) => setPresent_location(e.target.value)}
              autoComplete="present_location"
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Website"
              name="website"
              id="website"
              type="url"
              // defaultValue={"https://google.com"}
              value={website}
              onChange={(e) => setWesbite(e.target.value)}
              autoComplete="website"
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Gender"
              name="gender"
              id="gender"
              type="text"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              autoComplete="gender"
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Interests"
              name="interests"
              id="interests"
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              autoComplete="interests"
            />
            <input
              accept="image/*"
              name="avatar"
              type="file"
              multiple={false}
            />
            {error !== "" && <p>{error}</p>}
            <Button type="submit" fullWidth variant="contained" color="primary">
              Register
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default observer(RegisterForm);
