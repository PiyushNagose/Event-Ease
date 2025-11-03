const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    attendeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tickets: { type: Number, default: 1 },
    totalPrice: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
