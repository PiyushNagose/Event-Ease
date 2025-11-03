import React, { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";

export default function EventList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    API.get("/events")
      .then((r) => setEvents(r.data))
      .catch(() => {});
  }, []);

  return (
    <div>
      <Typography variant="h4" mb={3}>
        Events
      </Typography>
      <Grid container spacing={3}>
        {events.map((ev) => (
          <Grid item xs={12} sm={6} md={4} key={ev._id}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={ev.image || "https://via.placeholder.com/400x200"}
                  alt={ev.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{ev.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(ev.date).toLocaleString()} •{" "}
                    {ev.venue || "Online"}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    {ev.description?.slice(0, 80)}...
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "space-between", px: 2 }}>
                  <Button
                    component={Link}
                    to={`/event/${ev._id}`}
                    size="small"
                    color="primary"
                  >
                    View
                  </Button>
                  <Typography variant="subtitle1" color="secondary">
                    ₹{ev.price || 0}
                  </Typography>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
