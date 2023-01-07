const Parking = require("../models/parkingModel");
const VehicleDetail = require("../models/vehicleDetails");

exports.createParking = async (req, res, next) => {
  //   let parkObj = {
  //     parkingSize: 3,
  //     entryPoint: "C",
  //     parkingSlot: 6,
  //     status: "available",
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

//CHECK IF VEHICLE's PAYMENT IS CONTINOUS
exports.checkVehicleHistory = async (req, res, next) => {
  const { plateNo } = req.params;

  const vehicle = await VehicleDetail.find({ plateNumber: plateNo })
    .sort({
      endTime: -1,
    })
    .populate("parkingId");
  console.log(vehicle);
  let timeSpan = null;
  if (vehicle.length) {
    const endDate = new Date(vehicle[0].endTime).getTime();
    timeSpan = new Date().getTime() - endDate;
    console.log(timeSpan);
  }

  res.status(200).json({
    history: vehicle,
    continousPayment:
      timeSpan > 3600000 ? false : timeSpan == null ? false : true,
  });
};

//PARK TO THE NEARES PARKING SLOT BASED ON ENTRY POINT AND SIZE
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

  //CHANGE STATUS OF PARKING SLOT TO AVAILABLE
  const park = await Parking.findById({ _id: id });
  park.status = "available";
  const unPark = await Parking.findByIdAndUpdate({ _id: id }, park, {
    new: true,
    runValidators: true,
  });

  //ADD ENDTIME TO VEHICLE PARKED
  const vehicle = await VehicleDetail.find({ parkingId: id }).sort({
    startTime: -1,
  });
  vehicle[0].endTime = new Date();
  const updateVehicle = await VehicleDetail.findByIdAndUpdate(
    { _id: vehicle[0]._id },
    vehicle[0],
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ unPark, vehicle: updateVehicle });
};
