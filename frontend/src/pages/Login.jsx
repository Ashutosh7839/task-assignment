import React, { useState } from "react";
import API from "../services/api";
import { TextField, Button, Container } from "@mui/material";

const Login = ({ setAuth }) => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      setAuth(true);
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <Container>
      <h2>Login</h2>

      <TextField
        fullWidth
        label="Email"
        margin="normal"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <Button variant="contained" onClick={handleLogin}>
        Login
      </Button>
    </Container>
  );
};

export default Login;