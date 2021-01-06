const express = require("express");
//importing check as object desctructuring
const { check } = require("express-validator");

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
// using express-validation, you can pass more than one middleware on the same method
router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  PlacesControllers.createPlace
);

//route to api/place/:pId to update/patch a place
//using express-validation, chain method
router.patch(
  "/:pId",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    
  ],
  PlacesControllers.updatePlace
);

//route to /api/place/:pId to delete a place by ID

router.delete("/:pId", PlacesControllers.deletePlace);

//exports
module.exports = router;
