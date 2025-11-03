import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";

export default function EventForm() {
  const [form, setForm] = useState({
    title: "",
    date: "",
    venue: "",
    description: "",
    category: "",
    price: 0,
    image: "",
    coordinates: "",
  });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const body = {
        ...form,
        coordinates: form.coordinates
          ? form.coordinates.split(",").map(Number)
          : undefined,
      };
      await API.post("/events", body);
      navigate("/dashboard");
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
      <Paper elevation={4} sx={{ maxWidth: 600, mx: "auto", p: 4 }}>
        <Typography variant="h5" mb={2}>
          Create Event
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
            label="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <TextField
            required
            type="datetime-local"
            label="Date & Time"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <TextField
            label="Venue"
            value={form.venue}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
          />
          <TextField
            label="Description"
            multiline
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <TextField
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <TextField
            type="number"
            label="Price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
          />
          <TextField
            label="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
          <TextField
            label="Coordinates (lng,lat)"
            value={form.coordinates}
            onChange={(e) => setForm({ ...form, coordinates: e.target.value })}
          />
          <Button type="submit" variant="contained" color="primary">
            Create Event
          </Button>
        </Box>
      </Paper>
    </motion.div>
  );
}
