// backend/routes/wishlist.js
const express = require("express");
const router = express.Router();
const auth = require("../Middleware/Auth");
const mongoose = require("mongoose");
const User = require("../Models/User");
const Event = require("../Models/Event");

// Add to wishlist
router.post("/add", auth, async (req, res) => {
  try {
    const { eventId } = req.body;
    if (!mongoose.isValidObjectId(eventId))
      return res.status(400).json({ msg: "Invalid event id" });
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    await User.updateOne(
      { _id: req.user.id },
      { $addToSet: { wishlist: mongoose.Types.ObjectId(eventId) } }
    );
    res.json({ msg: "Added to wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Remove from wishlist
router.post("/remove", auth, async (req, res) => {
  try {
    const { eventId } = req.body;
    if (!mongoose.isValidObjectId(eventId))
      return res.status(400).json({ msg: "Invalid event id" });
    await User.updateOne(
      { _id: req.user.id },
      { $pull: { wishlist: mongoose.Types.ObjectId(eventId) } }
    );
    res.json({ msg: "Removed from wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Get my wishlist (populated)
router.get("/my", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist");
    return res.json(user?.wishlist || []);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
