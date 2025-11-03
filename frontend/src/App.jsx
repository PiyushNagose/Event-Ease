import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import EventList from "./pages/EventList";
import EventDetails from "./pages/EventDetails";
import EventForm from "./pages/EventForm";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import MyBookings from "./pages/MyBookings";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      <Navbar />
      <div style={{ maxWidth: "1200px", margin: "20px auto", padding: "10px" }}>
        <Routes>
          <Route path="/" element={<EventList />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route
            path="/create"
            element={
              <PrivateRoute role="Organizer">
                <EventForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute role="Organizer">
                <OrganizerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <PrivateRoute role="Attendee">
                <MyBookings />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}
