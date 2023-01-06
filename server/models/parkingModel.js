const mongoose = require("mongoose");

const ParkSchema = new mongoose.Schema({
  parkingSize: {
    type: Number,
    required: [true, "Please provide parkingSize"],
    enum: [1, 2, 3],
  },
  entryPoint: {
    type: String,
    required: [true, "Please provide entryPoint"],
    enum: ["A", "B", "C"],
  },
  parkingSlot: {
    type: Number,
    required: [true, "Please provide parkingSlot"],
    enum: [1, 2, 3, 4, 5, 6],
  },
  status: {
    type: String,
    required: [true, "Please provide status"],
    enum: ["available", "unavailable", "partial"],
  },
});

module.exports = mongoose.model("Park", ParkSchema);
