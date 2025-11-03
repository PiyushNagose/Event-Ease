import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <Paper elevation={4} sx={{ maxWidth: 400, mx: "auto", mt: 5, p: 4 }}>
        <Typography variant="h5" mb={2}>
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={submit}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <TextField
            required
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            required
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
        </Box>
      </Paper>
    </motion.div>
  );
}
