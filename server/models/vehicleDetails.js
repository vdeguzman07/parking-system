const mongoose = require("mongoose");

const vehicleDetailSchema = new mongoose.Schema(
  {
    plateNumber: {
      type: String,
      required: [true, "Please provide plateNumber"],
    },
    brand: {
      type: String,
      required: [true, "Please provide brand"],
    },
    startTime: {
      type: Date,
      required: [true, "Please provide startTime"],
    },
    endTime: {
      type: Date,
      //   required: [true, "Please provide endTime"],
    },
    parkingId: {
      type: mongoose.Types.ObjectId,
      ref: "Park",
      required: [true, "Please provide parkingId"],
    },
    vehicleSize: {
      type: String,
      required: [true, "Please provide vehicleSize"],
    },
    entryPoint: {
      type: String,
      required: [true, "Please provide entryPoint"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("VehicleDetail", vehicleDetailSchema);
