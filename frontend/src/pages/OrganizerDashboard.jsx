import React, { useEffect, useState } from "react";
import API from "../api";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale);

export default function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    API.get("/events/organizer/my")
      .then((r) => setEvents(r.data))
      .catch(() => {});
    API.get("/events/featured/top")
      .then((r) => setFeatured(r.data))
      .catch(() => {});
  }, []);

  const chartData = {
    labels: events.map((e) => e.title),
    datasets: [
      {
        label: "Tickets Sold",
        data: events.map((e) => e.stats?.ticketsSold || 0),
        backgroundColor: "#1976d2",
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <Typography variant="h4" mb={3}>
        Organizer Dashboard
      </Typography>

      {/* Tickets Sold Chart */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Tickets Sold per Event
          </Typography>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
            }}
          />
        </CardContent>
      </Card>

      {/* Featured Events */}
      <Typography variant="h6" mb={2}>
        Featured Events
      </Typography>
      <Grid container spacing={3}>
        {featured.map((f) => (
          <Grid item xs={12} sm={6} md={4} key={f._id}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card elevation={3}>
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Avatar
                    src={f.image || "https://via.placeholder.com/150"}
                    variant="rounded"
                    sx={{ width: 120, height: 80, mb: 1 }}
                  />
                  <Typography variant="subtitle1" fontWeight="bold">
                    {f.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: ₹{f.price || 0}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
        {featured.length === 0 && (
          <Typography>No featured events yet.</Typography>
        )}
      </Grid>
    </motion.div>
  );
}
