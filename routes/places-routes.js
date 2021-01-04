const express = require("express");

const HttpError = require("../models/http-error");

const PlacesControllers = require("../controllers/places-controllers");

//notice that router below is will be completed with specified in app.js
const router = express.Router();

//==== > GET routes
//route to api/places/:pId
router.get("/:pId", PlacesControllers.getPlacebyId);

// route to /api/places/users/:uid
router.get("/user/:uId", PlacesControllers.getPlacesByUserId);

//==== > POST/PATCH routes
//route to api/place/
router.post("/", PlacesControllers.createPlace);

//route to api/place/:pId to update/patch a place

router.patch("/:pId", PlacesControllers.updatePlace);

//route to /api/place/:pId to delete a place by ID

router.delete("/:pId", PlacesControllers.deletePlace);

//exports
module.exports = router;
