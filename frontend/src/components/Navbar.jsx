import React from "react";
import { AppBar, Toolbar, Typography, Button, Stack } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ y: -70 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
    >
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexGrow: 1, textDecoration: "none", color: "#fff" }}
          >
            EventEase
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button color="inherit" component={Link} to="/">
              Events
            </Button>
            {user?.role === "Organizer" && (
              <Button color="inherit" component={Link} to="/create">
                Create
              </Button>
            )}
            {user?.role === "Organizer" && (
              <Button color="inherit" component={Link} to="/dashboard">
                Dashboard
              </Button>
            )}
            {user?.role === "Attendee" && (
              <Button color="inherit" component={Link} to="/bookings">
                My Bookings
              </Button>
            )}
            {!user ? (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/register">
                  Register
                </Button>
              </>
            ) : (
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            )}
          </Stack>
        </Toolbar>
      </AppBar>
    </motion.div>
  );
}
