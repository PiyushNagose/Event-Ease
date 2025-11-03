import React, { useEffect, useState } from "react";
import API from "../api";
import { useParams } from "react-router-dom";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState(1);
  const [booking, setBooking] = useState(null);
  const [qr, setQr] = useState(null);

  useEffect(() => {
    API.get(`/events/${id}`)
      .then((r) => setEvent(r.data))
      .catch(() => {});
  }, [id]);

  const book = async () => {
    try {
      const res = await API.post("/bookings", { eventId: id, tickets });
      setBooking(res.data);
      const q = await API.post(`/events/${id}/qrcode`);
      setQr(q.data.dataUrl);
    } catch (err) {
      alert(err.response?.data?.msg || "Booking error");
    }
  };

  if (!event) return <Typography>Loading...</Typography>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <Card>
        <CardMedia
          component="img"
          height="300"
          image={event.image || "https://via.placeholder.com/800x300"}
          alt={event.title}
        />
        <CardContent>
          <Typography variant="h4">{event.title}</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {new Date(event.date).toLocaleString()} • {event.venue || "Online"}
          </Typography>
          <Typography variant="body1" mt={2}>
            {event.description}
          </Typography>

          <Box mt={3} display="flex" alignItems="center" gap={2}>
            <TextField
              type="number"
              label="Tickets"
              value={tickets}
              onChange={(e) => setTickets(Number(e.target.value))}
              sx={{ width: "120px" }}
            />
            <Button variant="contained" color="primary" onClick={book}>
              Book Now
            </Button>
          </Box>

          {booking && (
            <Box
              mt={3}
              p={2}
              sx={{ border: "1px solid #ccc", borderRadius: "8px" }}
            >
              <Typography variant="h6">Booking Confirmed</Typography>
              <Typography>
                Tickets: {booking.tickets} • Total: ₹{booking.totalPrice}
              </Typography>
              {qr && (
                <img
                  src={qr}
                  alt="QR code"
                  style={{ marginTop: "10px", width: "200px", height: "200px" }}
                />
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
