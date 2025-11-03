import React, { useEffect, useState } from "react";
import API from "../api";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";
import { MdEventAvailable } from "react-icons/md";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    API.get("/bookings/my")
      .then((r) => setBookings(r.data))
      .catch(() => {});
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <Typography variant="h4" mb={3}>
        My Bookings
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        {bookings.length === 0 && <Typography>No bookings yet!</Typography>}
        {bookings.map((b) => (
          <motion.div
            key={b._id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <MdEventAvailable size={40} color="#1976d2" />
                  <Box>
                    <Typography variant="h6">{b.eventId?.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tickets: {b.tickets} • Total: ₹{b.totalPrice}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Booked on: {new Date(b.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>
    </motion.div>
  );
}
