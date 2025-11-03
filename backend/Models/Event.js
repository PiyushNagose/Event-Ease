const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: Date, required: true },
    venue: String,
    description: String,
    category: String,
    price: { type: Number, default: 0 },
    image: String, 
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    location: {

      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, 
    },
  },
  { timestamps: true }
);

eventSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Event", eventSchema);
