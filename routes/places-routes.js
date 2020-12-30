const express = require("express");

const HttpError = require("../models/http-error");

const PlacesControllers = require("../controllers/places-controllers");

const router = express.Router();

//notice that router below is will be completed with specified in app.js, so path is "/api/places/"
router.get("/:pId", PlacesControllers.getPlacebyId);

// route to /api/places/users/:uid

router.get("/user/:uId", PlacesControllers.getPlaceByUserId);

module.exports = router;
