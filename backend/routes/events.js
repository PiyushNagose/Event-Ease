const express = require("express");
const router = express.Router();
const auth = require("../Middleware/Auth");
const Event = require("../Models/Event");
const Booking = require("../Models/Booking");
const QRCode = require("qrcode");

// Create event (organizer)
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "Organizer")
      return res.status(403).json({ msg: "Only organizers" });
    const {
      title,
      date,
      venue,
      description,
      category,
      price,
      image,
      coordinates,
    } = req.body;
    const event = new Event({
      title,
      date,
      venue,
      description,
      category,
      price,
      image,
      organizerId: req.user.id,
      location: coordinates ? { type: "Point", coordinates } : undefined,
    });
    await event.save();
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Public: list events, with optional category or text search
router.get("/", async (req, res) => {
  try {
    const { q, category } = req.query;
    const filter = {};
    if (q) filter.$text = { $search: q }; 
    if (category) filter.category = category;
    const events = await Event.find(filter).sort({ date: 1 }).limit(200);
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Get single
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Not found" });
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Update (organizer only)
router.put("/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Not found" });
    if (String(event.organizerId) !== req.user.id)
      return res.status(403).json({ msg: "Not owner" });
    Object.assign(event, req.body);
    await event.save();
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Delete
router.delete("/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Not found" });
    if (String(event.organizerId) !== req.user.id)
      return res.status(403).json({ msg: "Not owner" });
    await event.remove();
    res.json({ msg: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Organizer: events with booking counts (analytics)
router.get("/organizer/my", auth, async (req, res) => {
  try {
    if (req.user.role !== "Organizer")
      return res.status(403).json({ msg: "Only organizers" });
    const events = await Event.find({ organizerId: req.user.id }).lean();
    // get booking counts
    const ids = events.map((e) => e._id);
    const agg = await Booking.aggregate([
      { $match: { eventId: { $in: ids } } },
      {
        $group: {
          _id: "$eventId",
          ticketsSold: { $sum: "$tickets" },
          bookings: { $sum: 1 },
        },
      },
    ]);
    const map = {};
    agg.forEach((a) => (map[String(a._id)] = a));
    const resEvents = events.map((e) => ({
      ...e,
      stats: map[String(e._id)] || { ticketsSold: 0, bookings: 0 },
    }));
    res.json(resEvents);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Simple "featured" events endpoint - top N by tickets sold overall
router.get("/featured/top", async (req, res) => {
  try {
    const agg = await Booking.aggregate([
      { $group: { _id: "$eventId", ticketsSold: { $sum: "$tickets" } } },
      { $sort: { ticketsSold: -1 } },
      { $limit: 5 },
    ]);
    const ids = agg.map((a) => a._id);
    const events = await Event.find({ _id: { $in: ids } });
    // sort events in the same order
    const ordered = ids
      .map((id) => events.find((e) => String(e._id) === String(id)))
      .filter(Boolean);
    res.json(ordered);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// QR code generator for a booking payload (server-side: returns dataURL)
router.post("/:id/qrcode", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });
    const payload = {
      eventId: event._id,
      title: event.title,
      user: { id: req.user.id, name: req.user.name },
      ts: Date.now(),
    };
    const data = JSON.stringify(payload);
    const dataUrl = await QRCode.toDataURL(data);
    res.json({ dataUrl });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
