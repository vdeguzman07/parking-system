const Parking = require("../models/parkingModel");
const VehicleDetail = require("../models/vehicleDetails");

exports.createParking = async (req, res, next) => {
  //   //   for (let i = 1; i < 7; i++) {
  //   let parkObj = {
  //     parkingSize: 3,
  //     entryPoint: "C",
  //     parkingSlot: 6,
  //     status: "available",
  //   };
  //   console.log(parkObj);
  //   const parking = await Parking.create(parkObj);
  //   //   console.log(parking);
  //   res.status(200).json({ parking });
  //   //   }
};

exports.getParking = async (req, res, next) => {
  const parkings = await Parking.find({});
  res.status(200).json({ parkings: parkings, total: parkings.length });
};

exports.checkVehicleHistory = async (req, res, next) => {};

exports.checkAvailableParking = async (req, res, next) => {
  const { entryPoint, vehicleSize } = req.body;

  let size = [];
  if (vehicleSize === "small") size = [1, 2, 3];
  else if (vehicleSize === "medium") size = [2, 3];
  else if (vehicleSize === "large") size = [3];

  //FIND NEAREST PARKING SLOT BASED ON ENTRY POINT AND PARKING SIZE
  const parks = await Parking.find({
    entryPoint,
    parkingSize: { $in: size },
    status: "available",
  });
  // console.log(parks[0]._id);
  const data = {
    ...req.body,
    parkingId: parks[0]._id,
    vehicleSize: vehicleSize === "small" ? 1 : vehicleSize === "medium" ? 2 : 3,
  };

  //CREATE VEHICLE DETAILS
  const vehicleDetail = await VehicleDetail.create(data);
  console.log(vehicleDetail);
  parks[0].status = "unavailable";

  //UPDATE PARKING STATUS TO UNAVAILABLE
  const updateParkingStatus = await Parking.findByIdAndUpdate(
    {
      _id: parks[0]._id,
    },
    parks[0],
    {
      new: true,
      runValidators: true,
    }
  );
  console.log(updateParkingStatus);
  res.status(200).json({ vehicleDetail, updateParkingStatus });
};

exports.getVehicleDetails = async (req, res, next) => {
  const { id } = req.params;

  const currentParking = await VehicleDetail.find({ parkingId: id }).sort({
    startTime: -1,
  });
  console.log(currentParking[0]);
  res.status(200).json({ currentParking: currentParking[0] });
};

exports.unpark = async (req, res, next) => {
  const { id } = req.params;
  const park = await Parking.findById({ _id: id });

  park.status = "available";
  console.log(park);
  const unPark = await Parking.findByIdAndUpdate({ _id: id }, park, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ unPark });
};
