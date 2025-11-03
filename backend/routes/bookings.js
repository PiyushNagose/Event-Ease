const express = require("express");
const router = express.Router();
const auth = require("../Middleware/Auth");
const Booking = require("../Models/Booking");
const Event = require("../Models/Event");

// Create booking (attendee)
router.post("/", auth, async (req, res) => {
  try {
    const { eventId, tickets = 1 } = req.body;
    if (req.user.role !== "Attendee")
      return res.status(403).json({ msg: "Only attendees can book" });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    const totalPrice = (event.price || 0) * tickets;
    const booking = new Booking({
      eventId,
      attendeeId: req.user.id,
      tickets,
      totalPrice,
    });
    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Attendee: my bookings
router.get("/my", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ attendeeId: req.user.id }).populate(
      "eventId"
    );
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
