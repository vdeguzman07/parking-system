const router = require("express").Router();
const parkingController = require("../controller/parkingController");

router.route("/").get(parkingController.getParking);

router.route("/:id").patch(parkingController.unpark);

router.route("/check").post(parkingController.checkAvailableParking);

router.route("/get-details/:id").get(parkingController.getVehicleDetails);

router.route('/check-history/:plateNo').get(parkingController.checkVehicleHistory)

module.exports = router;
